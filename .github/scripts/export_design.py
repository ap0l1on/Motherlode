#!/usr/bin/env python3
"""Export a Motherlode design using Chrome, Pillow and macOS AVFoundation.

    python3 .github/scripts/export_design.py section/category/design
    python3 .github/scripts/export_design.py section/category/design --jobs 2

Reads motherlode:size/scale/loop/still metadata and inline or local stylesheet
colorway selectors from source/design.html. All colorways get PNGs and, for
animations, 24 fps H.264 MP4s. Loop durations round up to a whole video frame;
odd video dimensions receive at most one pixel of padding (PNGs stay exact).
Creates preview.png (static) or preview.gif (animated), plus colorways.png.
For a carousel, motherlode:slides declares the number of ?slide=N pages;
every page is also saved under exports/slides/<colorway>/.

Chrome workers use private profiles and DevTools pipes, not the user's browser.
Each colorway gets a fresh browser context with separate storage.
DevTools sets the exact viewport, waits for fonts/images and captures animation
times deterministically. No Node, browser driver, ffmpeg or pip install needed.
The compiled AVFoundation helper is reused from the current user's temp directory.
CSS / Web Animations are supported; timers, canvas and video are not seekable.
An export is staged before replacing generated files; unrelated files are kept.
Old PNG/MP4 exports outside the current set are reported, not silently deleted.
"""

import argparse
import base64
from concurrent.futures import ThreadPoolExecutor, as_completed
from contextlib import contextmanager
from dataclasses import dataclass
import hashlib
from html.parser import HTMLParser
import json
import math
import os
from pathlib import Path
from queue import Empty, SimpleQueue
import re
import selectors
import shutil
import stat
import subprocess
import sys
import tempfile
from threading import Event
import time
from urllib.parse import quote, unquote, urlencode, urlsplit


# Chrome expects null-terminated JSON on file descriptors 3 and 4. Launch via
# this tiny exec shim so threaded workers need neither preexec_fn nor sockets.
if __name__ == "__main__" and sys.argv[1:2] == ["--_chrome-pipe"]:
    os.dup2(0, 3)
    os.dup2(1, 4)
    os.dup2(2, 1)  # Ordinary Chrome stdout belongs in the log, never the protocol.
    os.execv(sys.argv[2], sys.argv[2:])

from PIL import Image, ImageDraw, ImageFont, ImageOps

CHROME = Path("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
FPS = 24
FILE_LIMIT = 50_000_000
GIF_LIMIT = 5_000_000
SLUG = re.compile(r"[a-z0-9]+(?:-[a-z0-9]+)*\Z")
COLORWAY = re.compile(r'''\[\s*data-colorway\s*=\s*(?:"([^"]+)"|'([^']+)'|([a-z0-9-]+))\s*\]''')


class DesignHTML(HTMLParser):
    def __init__(self):
        super().__init__()
        self.metadata = {}
        self.styles = []
        self.stylesheets = []
        self.in_style = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "meta" and attrs.get("name", "").startswith("motherlode:"):
            name = attrs["name"].split(":", 1)[1]
            if name in self.metadata:
                raise ValueError(f"Duplicate motherlode:{name} meta tag")
            self.metadata[name] = attrs.get("content", "")
        elif tag == "style":
            self.in_style = True
        elif tag == "link" and "stylesheet" in attrs.get("rel", "").split():
            self.stylesheets.append(attrs.get("href", ""))

    def handle_endtag(self, tag):
        if tag == "style":
            self.in_style = False

    def handle_data(self, data):
        if self.in_style:
            self.styles.append(data)


@dataclass(frozen=True)
class Design:
    source: Path
    width: int
    height: int
    scale: float
    loop: float | None
    still: float | None
    colorways: tuple[str, ...]
    slides: int = 1

    @property
    def pixels(self):
        return round(self.width * self.scale), round(self.height * self.scale)

    @property
    def frames(self):
        return math.ceil(self.loop * FPS - 1e-9) if self.loop else 0


def read_design(folder):
    source = folder / "source" / "design.html"
    parser = DesignHTML()
    parser.feed(source.read_text(encoding="utf-8"))
    meta = parser.metadata
    size = re.fullmatch(r"\s*([1-9][0-9]*)\s*[xX×]\s*([1-9][0-9]*)\s*", meta.get("size", ""))
    if not size:
        raise ValueError("motherlode:size must be WIDTHxHEIGHT, e.g. 393x852")
    width, height = map(int, size.groups())
    try:
        scale = float(meta["scale"])
        loop = float(meta["loop"]) if "loop" in meta else None
        still = float(meta.get("still", "0")) if loop is not None else None
    except (KeyError, ValueError) as error:
        raise ValueError("Provide numeric motherlode:scale (and loop/still for animation)") from error
    if not math.isfinite(scale) or scale <= 0:
        raise ValueError("motherlode:scale must be finite and positive")
    for dimension in (width * scale, height * scale):
        if not math.isfinite(dimension) or not 1 <= dimension <= 16384 or not dimension.is_integer():
            raise ValueError("Scaled dimensions must be whole pixels between 1 and 16384")
    if loop is not None and (not math.isfinite(loop) or loop <= 0 or
                             not math.isfinite(still) or not 0 <= still < loop):
        raise ValueError("Require a finite loop > 0 and 0 <= still < loop")
    if loop is None and "still" in meta:
        raise ValueError("motherlode:still requires motherlode:loop")
    for href in parser.stylesheets:
        url = urlsplit(href)
        if not url.scheme and not url.netloc and url.path:
            parser.styles.append((source.parent / unquote(url.path)).read_text(encoding="utf-8"))
    css = re.sub(r"/\*.*?\*/", "", "\n".join(parser.styles), flags=re.S)
    names = list(dict.fromkeys(next(value for value in match if value) for match in COLORWAY.findall(css)))
    if any(not SLUG.fullmatch(name) for name in names):
        raise ValueError("Colorway names must be lowercase words separated by dashes")
    if len(names) < 8 or not {"original", "light", "dark", "mono"}.issubset(names):
        raise ValueError("Provide at least 8 colorways, including original, light, dark and mono")
    names.remove("original")
    slides = int(meta.get("slides", "1"))
    if slides < 1:
        raise ValueError("motherlode:slides must be a positive integer")
    return Design(source, width, height, scale, loop, still, ("original", *names), slides)


class Chrome:
    """One synchronous DevTools connection per worker."""

    def __init__(self, executable, directory, design, timeout, *, open_page=True):
        self.executable, self.directory, self.design = executable, directory, design
        self.timeout = timeout
        self.process = None
        self.session = None
        self.sequence = 0
        self.buffer = b""
        self.events = []
        self.selector = selectors.DefaultSelector()
        self.log = None
        self.previous_frame = None
        self.open_initial_page = open_page

    def __enter__(self):
        self.log = (self.directory / "chrome.log").open("wb")
        command = [sys.executable, str(Path(__file__).resolve()), "--_chrome-pipe", str(self.executable),
            "--headless=new", "--remote-debugging-pipe", "--no-first-run", "--no-default-browser-check",
            "--hide-scrollbars", "--disable-background-networking", "--disable-component-update",
            "--disable-background-timer-throttling", "--disable-renderer-backgrounding",
            "--disable-backgrounding-occluded-windows", "--force-color-profile=srgb",
            f"--user-data-dir={self.directory / 'profile'}", "about:blank"]
        try:
            self.process = subprocess.Popen(command, stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                                            stderr=self.log, bufsize=0)
            self.selector.register(self.process.stdout, selectors.EVENT_READ)
            if self.open_initial_page:
                self.open_target()
            return self
        except BaseException:
            self.__exit__(None, None, None)
            raise

    def open_target(self, context=None):
        options = {"url": "about:blank"}
        if context is not None:
            options["browserContextId"] = context
        target = self.call("Target.createTarget", options)["targetId"]
        self.session = self.call("Target.attachToTarget", {"targetId": target, "flatten": True})["sessionId"]
        self.call("Page.enable")
        self.call("Emulation.setDeviceMetricsOverride", {
            "width": self.design.width, "height": self.design.height,
            "deviceScaleFactor": self.design.scale, "mobile": False})

    @contextmanager
    def isolated_page(self):
        # Storage and targets belong to a fresh context for each palette. Only
        # the Chrome process survives while the worker picks up its next job.
        context = self.call("Target.createBrowserContext", {"disposeOnDetach": True})["browserContextId"]
        try:
            self.open_target(context)
            yield self
        finally:
            self.session = None
            self.events.clear()
            self.previous_frame = None
            if self.process.poll() is None:
                self.call("Target.disposeBrowserContext", {"browserContextId": context})

    def __exit__(self, *_):
        if self.process:
            if self.process.stdin:
                self.process.stdin.close()  # Pipe EOF asks Chrome to shut down.
            try:
                self.process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                self.process.terminate()
                try:
                    self.process.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    self.process.kill()
                    self.process.wait()
            if self.process.stdout:
                self.process.stdout.close()
        self.selector.close()
        if self.log:
            self.log.close()

    def receive(self, deadline):
        # Screenshots can be several MB. Keep pipe fragments separately until
        # the terminator instead of copying the whole PNG on each short read.
        parts = []
        chunk = self.buffer
        while True:
            end = chunk.find(b"\0")
            if end >= 0:
                parts.append(chunk[:end])
                self.buffer = chunk[end + 1:]
                return json.loads(b"".join(parts))
            if chunk:
                parts.append(chunk)
            remaining = deadline - time.monotonic()
            if remaining <= 0 or not self.selector.select(remaining):
                raise RuntimeError("Chrome timed out; check page assets or increase --timeout")
            chunk = os.read(self.process.stdout.fileno(), 65536)
            if not chunk:
                log = (self.directory / "chrome.log").read_text(errors="replace")[-3000:]
                raise RuntimeError(f"Chrome closed the DevTools pipe:\n{log}")

    def call(self, method, params=None):
        self.sequence += 1
        request = {"id": self.sequence, "method": method, "params": params or {}}
        if self.session:
            request["sessionId"] = self.session
        data = memoryview(json.dumps(request).encode() + b"\0")
        while data:
            data = data[os.write(self.process.stdin.fileno(), data):]
        deadline = time.monotonic() + self.timeout
        while True:
            message = self.receive(deadline)
            if message.get("id") == self.sequence:
                if "error" in message:
                    raise RuntimeError(f"{method}: {message['error']}")
                return message.get("result", {})
            if message.get("method") == "Page.loadEventFired":
                self.events.append(message)

    def loaded(self):
        deadline = time.monotonic() + self.timeout
        while True:
            message = self.events.pop(0) if self.events else self.receive(deadline)
            if message.get("method") == "Page.loadEventFired" and message.get("sessionId") == self.session:
                return

    def evaluate(self, expression):
        result = self.call("Runtime.evaluate", {"expression": expression, "awaitPromise": True,
            "returnByValue": True, "timeout": self.timeout * 1000})
        if "exceptionDetails" in result:
            raise RuntimeError(f"Page script failed: {result['exceptionDetails']}")
        return result.get("result", {}).get("value")

    def render(self, colorway, seconds, output, wait_ms, slide=None):
        # Reload every timestamp: animations with fill modes, finished promises
        # and author-supplied ?t= initialization then behave like a fresh page.
        self.previous_frame = None
        params = {}
        if seconds is not None:
            params["t"] = f"{seconds:.9f}"
        if slide is not None:
            params["slide"] = slide
        query = "?" + urlencode(params) if params else ""
        url = self.design.source.as_uri() + query + "#" + quote(colorway)
        # Visiting a blank document forces a full navigation even for repeated
        # timestamps or hash-only changes, which emit no new load event. It also
        # avoids Page.reload restoring the previous document's original fragment.
        self.events.clear()
        blank = self.call("Page.navigate", {"url": "about:blank"})
        if "loaderId" in blank:
            self.loaded()
        self.events.clear()
        navigation = self.call("Page.navigate", {"url": url})
        if navigation.get("errorText"):
            raise RuntimeError(f"Cannot open design: {navigation['errorText']}")
        self.loaded()
        self.evaluate("""(async () => {
            await document.fonts.ready;
            await Promise.all([...document.images].map(image => image.decode()));
            await new Promise(resolve => setTimeout(resolve, WAIT));
            await document.fonts.ready;
            const failed = [...document.fonts].filter(font => font.status === 'error');
            if (failed.length) throw new Error('Font failed: ' + failed.map(font => font.family).join(', '));
        })()""".replace("WAIT", str(wait_ms)))
        state = self.evaluate("""(() => {
            const t = TIME;
            if (t !== null) for (const animation of document.getAnimations()) {
                animation.pause(); animation.currentTime = t * 1000;
            }
            return {colorway: document.documentElement.dataset.colorway,
                    width: innerWidth, height: innerHeight, scale: devicePixelRatio};
        })()""".replace("TIME", json.dumps(seconds)))
        if state["colorway"] != colorway:
            raise ValueError(f"Page did not select #{colorway}; include the hash/colorway script from AGENTS.md")
        if (state["width"], state["height"]) != (self.design.width, self.design.height):
            raise RuntimeError(f"Unexpected Chrome viewport: {state}")
        self.capture(output)

    def seek(self, seconds, output):
        """Seek existing CSS/WAAPI tracks in a document whose assets are ready."""
        changed = self.evaluate("""(() => {
            const t = TIME;
            const url = new URL(location.href);
            url.searchParams.set('t', String(t));
            history.replaceState(history.state, '', url);
            const animations = document.getAnimations();
            for (const animation of animations) {
                animation.pause(); animation.currentTime = t * 1000;
            }
            // A held pose can span dozens of video frames. Under --reuse-page
            // the page changes only through these tracks. Compare their painted
            // CSS values, including pseudo-elements and custom properties.
            const key = Symbol.for('motherlode.export.heldPose');
            const state = window[key] ||= {properties: new WeakMap(), last: null, witness: null};
            function painted(effect, property) {
                const style = getComputedStyle(effect.target, effect.pseudoElement || null);
                return property.startsWith('--') ? style.getPropertyValue(property) : style[property];
            }
            // A single changed painted property proves that a capture is
            // needed. Continuous motion often changes the very same property
            // every frame, even in a scene with hundreds of other tracks.
            const probe = state.witness;
            if (probe && animations[probe.index]?.effect === probe.effect) {
                const value = painted(probe.effect, probe.property);
                if (value !== probe.value) {
                    probe.value = value;
                    state.last = null;
                    return true;
                }
            } else {
                state.witness = null;
            }
            const last = state.last;
            let unchanged = last !== null && last.length === animations.length;
            const values = [];
            for (const [index, {effect}] of animations.entries()) {
                if (!effect?.target || !effect.getKeyframes) { state.last = null; return true; }
                let props = state.properties.get(effect);
                if (!props) {
                    const skip = new Set(['offset', 'computedOffset', 'easing', 'composite']);
                    props = [...new Set(effect.getKeyframes().flatMap(frame =>
                        Object.keys(frame).filter(k => !skip.has(k))))];
                    state.properties.set(effect, props);
                }
                const style = getComputedStyle(effect.target, effect.pseudoElement || null);
                const row = [];
                const previous = last?.[index];
                if (previous?.effect !== effect) unchanged = false;
                for (const [column, p] of props.entries()) {
                    const value = p.startsWith('--') ? style.getPropertyValue(p) : style[p];
                    if (value === undefined || value === '') { state.last = null; return true; }
                    if (previous?.effect === effect && previous.row[column] !== value) {
                        unchanged = false;
                        if (animations.length > 32) {
                            state.witness = {index, effect, property: p, value};
                            state.last = null;
                            return true;
                        }
                    }
                    row.push(value);
                }
                values.push({effect, row});
            }
            state.last = values;
            return !unchanged;
        })()""".replace("TIME", json.dumps(seconds)))
        if changed or self.previous_frame is None:
            self.capture(output)
        else:
            try:
                os.link(self.previous_frame, output)
            except OSError:
                shutil.copyfile(self.previous_frame, output)
        self.previous_frame = output

    def capture(self, output):
        options = {"format": "png", "fromSurface": True, "captureBeyondViewport": False}
        if output.suffix == ".jpg":
            options.update(format="jpeg", quality=100)
        screenshot = self.call("Page.captureScreenshot", options)
        output.write_bytes(base64.b64decode(screenshot["data"], validate=True))
        with Image.open(output) as image:
            if image.size != self.design.pixels:
                raise RuntimeError(f"Expected {self.design.pixels} capture, got {image.size}")


def run_command(command, timeout):
    result = subprocess.run(command, capture_output=True, text=True, timeout=timeout)
    if result.returncode:
        raise RuntimeError(f"{Path(command[0]).name} failed:\n{result.stderr[-5000:]}\n{result.stdout[-1000:]}")


def video_encoder(work):
    """Compile once per Swift source, toolchain and host OS in the user's temp directory."""
    import fcntl

    source = Path(__file__).with_name("encode_video.swift")
    compiler = shutil.which("swiftc")
    if not compiler:
        raise ValueError("Animated export needs Swift / Xcode Command Line Tools on macOS")
    version = subprocess.check_output([compiler, "--version"], stderr=subprocess.STDOUT, timeout=60)
    identity = b"\0".join((source.read_bytes(), version, os.fsencode(compiler),
                           os.fsencode(os.uname().release), os.fsencode(os.uname().machine),
                           os.fsencode(os.environ.get("SDKROOT", "")),
                           os.fsencode(os.environ.get("DEVELOPER_DIR", ""))))
    cache = Path(tempfile.gettempdir()) / f"motherlode-encoders-{os.getuid()}"
    try:
        cache.mkdir(mode=0o700, exist_ok=True)
        info = cache.lstat()
        private_directory = (stat.S_ISDIR(info.st_mode) and info.st_uid == os.getuid()
                             and (info.st_mode & 0o077) == 0)
        if private_directory:
            target = cache / hashlib.sha256(identity).hexdigest()
            with (cache / "build.lock").open("a+b") as lock:
                fcntl.flock(lock, fcntl.LOCK_EX)
                if not target.is_file() or not os.access(target, os.X_OK):
                    with tempfile.TemporaryDirectory(dir=cache) as temporary:
                        binary = Path(temporary) / "encode_video"
                        run_command([compiler, "-O", str(source), "-o", str(binary)], 180)
                        binary.chmod(0o700)
                        binary.replace(target)
                return target
    except OSError:
        # A read-only or unavailable cache still permits an ordinary one-off export.
        pass
    target = work / "encode_video"
    run_command([compiler, "-O", str(source), "-o", str(target)], 180)
    return target


def make_gif(frames, output):
    """Use a shared palette and cumulative GIF ticks to preserve loop timing."""
    paths = sorted(p for p in frames.glob("frame-*") if p.suffix in (".png", ".jpg"))

    def sample(index, width):
        with Image.open(paths[index]) as image:
            size = (width, max(1, round(image.height * width / image.width)))
            image.draft("RGB", size)
            return image.convert("RGB").resize(size, Image.Resampling.LANCZOS)

    # Start at 12 fps/600px; reduce palette, frame rate, then width if necessary.
    for width, step, colors in [(600, 2, 256), (600, 2, 128), (600, 3, 128),
                                (600, 4, 64), (480, 4, 64), (360, 4, 64), (240, 6, 32)]:
        indices = list(range(0, len(paths), step))
        # Train on samples spread across the whole loop, not just the first frame.
        cells = min(16, len(indices))
        palette_sheet = Image.new("RGB", (128 * cells, 128))
        for cell in range(cells):
            index = indices[round(cell * (len(indices) - 1) / max(1, cells - 1))]
            with sample(index, width) as frame:
                palette_sheet.paste(ImageOps.fit(frame, (128, 128)), (cell * 128, 0))
        palette = palette_sheet.quantize(colors=colors)
        # A long phone animation can have hundreds of large RGB previews.
        # Retain only indexed frames while Pillow assembles the GIF.
        quantized = []
        for index in indices:
            with sample(index, width) as frame:
                quantized.append(frame.quantize(palette=palette, dither=Image.Dither.FLOYDSTEINBERG))
        boundaries = [round(index / FPS * 100) for index in [*indices, len(paths)]]
        durations = [(b - a) * 10 for a, b in zip(boundaries, boundaries[1:])]
        quantized[0].save(output, save_all=True, append_images=quantized[1:], duration=durations,
                          loop=0, disposal=2, optimize=False)
        for image in [*quantized, palette_sheet, palette]:
            image.close()
        if output.stat().st_size < GIF_LIMIT:
            return
    raise RuntimeError("preview.gif exceeds 5 MB even after reducing its size; shorten the loop")


def make_grid(exports, names, output):
    columns = min(4, len(names))
    tile_width = 2000 // columns
    with Image.open(exports / f"{names[0]}.png") as original:
        tile_height = max(1, round(original.height * (tile_width - 24) / original.width))
    row_height = tile_height + 60
    grid = Image.new("RGB", (2000, math.ceil(len(names) / columns) * row_height), "#eeeeee")
    draw = ImageDraw.Draw(grid)
    font = ImageFont.load_default(size=22)
    for index, name in enumerate(names):
        x, y = (index % columns) * tile_width, (index // columns) * row_height
        with Image.open(exports / f"{name}.png") as image:
            thumbnail = image.convert("RGB").resize((tile_width - 24, tile_height), Image.Resampling.LANCZOS)
        grid.paste(thumbnail, (x + 12, y + 12))
        draw.text((x + 12, y + tile_height + 22), name, fill="#202020", font=font)
    grid.save(output, compress_level=6)


def export(folder, args):
    design = read_design(folder)
    chrome = args.chrome.expanduser().resolve()
    if not chrome.is_file():
        raise ValueError(f"Chrome not found: {chrome}; use --chrome PATH")
    print(f"{design.width}×{design.height} at {design.scale:g}×; {len(design.colorways)} colorways"
          + (f"; {design.frames} frames/loop at {FPS} fps" if design.loop else "; static"), flush=True)
    with tempfile.TemporaryDirectory(prefix=".motherlode-export-", dir=folder) as temporary:
        work = Path(temporary)
        exports = work / "exports"
        exports.mkdir()
        palettes = work / "palette-frames"
        palettes.mkdir()
        encoder = video_encoder(work) if design.loop else None

        def render_colorway(name, worker):
            directory = palettes / name
            directory.mkdir()
            frames = directory / "frames"
            frames.mkdir()
            try:
                with worker.isolated_page() as browser:
                    browser.render(name, design.still, exports / f"{name}.png", args.wait_ms)
                    if design.slides > 1:
                        slide_dir = exports / "slides" / name
                        slide_dir.mkdir(parents=True)
                        shutil.copyfile(exports / f"{name}.png", slide_dir / "01.png")
                        for slide in range(2, design.slides + 1):
                            browser.render(name, design.still, slide_dir / f"{slide:02}.png",
                                           args.wait_ms, slide=slide)
                        if design.loop and args.reuse_page:
                            browser.render(name, design.still, exports / f"{name}.png", args.wait_ms)
                    for index in range(design.frames):
                        suffix = "jpg" if args.video_frame_format == "jpeg" else "png"
                        path = frames / f"frame-{index:06d}.{suffix}"
                        if args.reuse_page:
                            browser.seek(index / FPS, path)
                        else:
                            browser.render(name, index / FPS, path, args.wait_ms)
                if design.loop:
                    run_command([str(encoder), str(frames), str(exports / f"{name}.mp4"), str(FPS)],
                                max(120, design.frames * 2))
                if name == "original" and design.loop:
                    make_gif(frames, work / "preview.gif")
                print(f"  {name}: PNG" + (" + MP4" if design.loop else ""), flush=True)
            except Exception as error:
                raise RuntimeError(f"{name}: {error}") from error
            finally:
                shutil.rmtree(directory)

        remaining = SimpleQueue()
        for name in design.colorways:
            remaining.put(name)
        stopped = Event()

        def render_worker(index):
            directory = work / f"browser-{index}"
            directory.mkdir()
            try:
                with Chrome(chrome, directory, design, args.timeout, open_page=False) as browser:
                    while not stopped.is_set():
                        try:
                            name = remaining.get_nowait()
                        except Empty:
                            return
                        render_colorway(name, browser)
            except BaseException:
                stopped.set()
                raise

        workers = min(args.jobs, len(design.colorways))
        with ThreadPoolExecutor(max_workers=workers) as pool:
            futures = [pool.submit(render_worker, index) for index in range(workers)]
            try:
                for future in as_completed(futures):
                    future.result()
            except BaseException:
                for future in futures:
                    future.cancel()
                raise
        preview = "preview.gif" if design.loop else "preview.png"
        if not design.loop:
            with Image.open(exports / "original.png") as original:
                ratio = 1200 / max(original.size)
                original.resize(tuple(max(1, round(side * ratio)) for side in original.size),
                                Image.Resampling.LANCZOS).save(work / preview)
        make_grid(exports, design.colorways, work / "colorways.png")
        extensions = ("png", "mp4") if design.loop else ("png",)
        media = [exports / f"{name}.{ext}" for name in design.colorways for ext in extensions]
        slides = [exports / "slides" / name / f"{index:02}.png"
                  for name in design.colorways for index in range(1, design.slides + 1)
                  if design.slides > 1]
        products = [*media, *slides, work / preview, work / "colorways.png"]
        for product in products:
            if product.stat().st_size >= FILE_LIMIT:
                raise RuntimeError(f"{product.name} exceeds 50 MB; reduce scale or loop duration")
        destination = folder / "exports"
        destination.mkdir(exist_ok=True)
        expected = {product.name for product in media}
        stale = sorted(path.name for path in destination.iterdir()
                       if path.suffix.lower() in {".png", ".mp4"} and path.name not in expected)
        for product in [*media, *slides]:
            target = destination / product.relative_to(exports)
            target.parent.mkdir(parents=True, exist_ok=True)
            product.replace(target)
        for name in (preview, "colorways.png"):
            (work / name).replace(folder / name)
        # A stale GIF wins the catalog's preview selection after animation is removed.
        (folder / ("preview.png" if design.loop else "preview.gif")).unlink(missing_ok=True)
        if stale:
            print("  Existing exports not refreshed (review/remove if obsolete): " + ", ".join(stale), flush=True)
    print(f"Exported → {folder}", flush=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("design", type=Path, help="Design folder containing source/design.html")
    parser.add_argument("--jobs", type=int, default=min(4, os.cpu_count() or 1), help="Parallel Chrome workers (default: up to 4)")
    parser.add_argument("--chrome", type=Path, default=CHROME, help="Chrome executable")
    parser.add_argument("--timeout", type=float, default=60, help="Seconds allowed per browser operation (default: 60)")
    parser.add_argument("--wait-ms", type=int, default=100, help="Asset settling time per frame (default: 100 ms)")
    parser.add_argument("--reuse-page", action="store_true", help="Seek already-loaded CSS/WAAPI tracks for faster loops. Omit for designs that build different content on page load for each ?t= value.")
    parser.add_argument("--video-frame-format", choices=("png", "jpeg"), default="png",
                        help="Temporary video frames: lossless PNG (default) or quality-100 JPEG. Still exports are always PNG.")
    args = parser.parse_args()
    if args.jobs < 1 or not math.isfinite(args.timeout) or args.timeout <= 0 or args.wait_ms < 0:
        parser.error("jobs and timeout must be positive; wait-ms must be nonnegative")
    try:
        export(args.design.expanduser().resolve(), args)
    except (OSError, ValueError, RuntimeError, subprocess.SubprocessError) as error:
        print(f"export_design: {error}", file=sys.stderr)
        return 1
    except KeyboardInterrupt:
        print("export_design: interrupted; existing exports were preserved", file=sys.stderr)
        return 130
    return 0


if __name__ == "__main__":
    sys.exit(main())
