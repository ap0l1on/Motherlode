#!/usr/bin/env python3
"""Refresh the GitHub Pages catalog, lightweight posters and portable live demos.

Run python3 -B .github/scripts/build_site.py after editing library sources or exports.
The site is published from docs/. Edit docs/prompts.json to update the designer guide.
"""
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from pathlib import Path
from tempfile import TemporaryDirectory
import filecmp
import json
import re
import shutil
import subprocess

from PIL import Image, ImageStat

from build_catalog import GROUPS, title
from export_design import read_design
from site_source import portable_html

ROOT = Path(__file__).resolve().parents[2]
SITE = ROOT / "docs"
CREDIT = re.compile(r'https://(?:www\.)?tiktok\.com/(@[\w.]+)/(?:photo|video)/\d+')
PLAYER = (Path(__file__).with_name("site_player.js")).read_text("utf-8")


def visible_swatch(path):
    """Pick a representative visible color, weighting area, chroma and lightness."""
    with Image.open(path) as image:
        image.thumbnail((88, 88), Image.Resampling.BILINEAR)
        reduced = image.convert("RGB").quantize(colors=24)
    table = reduced.getpalette()
    candidates = []
    for count, index in reduced.getcolors():
        rgb = tuple(table[3*index:3*index+3])
        low, high = min(rgb)/255, max(rgb)/255
        lightness = (low + high)/2
        area = count/(reduced.width * reduced.height)
        score = area**.38 * (.08 + (high-low)**.8) * (1 - abs(lightness-.55)*1.35)
        candidates.append((score, rgb))
    return "#%02x%02x%02x" % max(candidates)[1]


def build_design(folder, stage):
    design = read_design(folder)
    key = folder.relative_to(ROOT).as_posix()
    readme = (folder / "README.md").read_text("utf-8")
    lines = readme.strip().splitlines()
    if not lines or not lines[0].startswith("# "):
        raise ValueError(f"Missing design title in {key}")
    summary = next((line.strip() for line in lines[1:] if line.strip() and not line.startswith(("#","!","|","<"))), "")
    summary = re.sub(r'\[([^]]+)\]\([^)]+\)', r'\1', summary).replace("`", "")
    credits = {match[0]: match[1] for match in CREDIT.finditer(readme)}
    demo = stage / "demos" / (key + ".html")
    poster = stage / "posters" / (key + ".webp")
    demo.parent.mkdir(parents=True, exist_ok=True)
    poster.parent.mkdir(parents=True, exist_ok=True)
    document = portable_html(design.source)
    bridge = '<script data-motherlode-player>\n' + PLAYER + '</script>\n'
    end = document.lower().rfind("</body>")
    demo.write_text(document[:end] + bridge + document[end:] if end >= 0 else document + bridge, encoding="utf-8")
    with Image.open(folder / "exports/original.png") as source:
        image = source.convert("RGB")
        image.thumbnail((800, 660), Image.Resampling.LANCZOS)
        w, h = image.size
        sample = Image.new("RGB", (4, 1))
        sample.putdata([image.getpixel((x, y)) for x, y in ((1,1),(w-2,1),(1,h-2),(w-2,h-2))] if min(w,h)>2 else [image.getpixel((0,0))]*4)
        edge = "#%02x%02x%02x" % tuple(ImageStat.Stat(sample).median)
        image.save(poster, "WEBP", quality=86, method=5)
    return {"id":key, "name":lines[0][2:].strip(), "description":summary,
            "width":design.width, "height":design.height, "loop":design.loop, "still":design.still,
            "slides":design.slides, "mat":edge,
            "palettes":[[name, visible_swatch(folder/"exports"/(name+".png"))] for name in design.colorways],
            "credits":[{"handle":handle,"url":url} for url,handle in credits.items()]}


def added_dates():
    """When each design first landed in git, in UTC, keyed by its folder. Uncommitted designs are left out."""
    try:
        log = subprocess.run(["git", "-C", str(ROOT), "log", "--diff-filter=A", "--format=%x00%aI", "--name-only",
                              "--", "*/source/design.html"], capture_output=True, text=True, check=True).stdout
    except (OSError, subprocess.CalledProcessError):
        return {}
    dates = {}
    for block in log.split("\x00")[1:]:
        lines = [line.strip() for line in block.splitlines() if line.strip()]
        if not lines:
            continue
        when = datetime.fromisoformat(lines[0]).astimezone(timezone.utc).isoformat(timespec="seconds")
        for path in lines[1:]:
            if path.endswith("/source/design.html"):
                # The log runs newest first, so the oldest add wins.
                dates[path[:-len("/source/design.html")]] = when
    return dates

def synchronize(source, destination):
    destination.parent.mkdir(parents=True, exist_ok=True)
    if not destination.is_file() or not filecmp.cmp(source, destination, shallow=False):
        shutil.copyfile(source, destination)


def main():
    sections, folders = [], []
    for group, entries in GROUPS:
        for sec, description, cats in entries:
            sections.append({"id":sec, "name":title(sec), "group":group, "description":description,
                             "categories":[[cat,title(cat),label] for cat,label in cats]})
            for cat, _ in cats:
                folders.extend(sorted(p.parents[1] for p in (ROOT/sec/cat).glob("*/source/design.html")))
    with TemporaryDirectory(prefix="motherlode-pages-") as tmp:
        stage = Path(tmp)
        with ThreadPoolExecutor(max_workers=4) as pool:
            designs = list(pool.map(lambda folder: build_design(folder, stage), folders))
        # The website lists the newest designs first. A design that isn't committed yet counts as new.
        dates = added_dates()
        now = datetime.now(timezone.utc).isoformat(timespec="seconds")
        for row in designs:
            row["added"] = dates.get(row["id"], now)
        manifest = {"sections":sections, "designs":designs}
        (stage / "catalog.json").write_text(json.dumps(manifest, ensure_ascii=False, separators=(",", ":"))+"\n", encoding="utf-8")
        for file in stage.rglob("*"):
            if file.is_file() and file.name != "catalog.json":
                synchronize(file, SITE / file.relative_to(stage))
        previous = SITE / "catalog.json"
        stale = {row["id"] for row in json.loads(previous.read_text())["designs"]} if previous.exists() else set()
        stale.difference_update(row["id"] for row in designs)
        synchronize(stage / "catalog.json", previous)
        for key in stale:
            if re.fullmatch(r'[a-z0-9-]+/[a-z0-9-]+/[a-z0-9-]+', key):
                (SITE/"demos"/(key+".html")).unlink(missing_ok=True)
                (SITE/"posters"/(key+".webp")).unlink(missing_ok=True)
    print(f"{len(designs)} designs, {len(sections)} sections, {sum(len(s['categories']) for s in sections)} categories")


if __name__ == "__main__":
    main()
