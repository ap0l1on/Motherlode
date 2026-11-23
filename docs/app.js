/* Motherlode website. Plain JavaScript, no build step.
   Reads catalog.json and prompts.json, which .github/scripts/build_site.py writes. */
(() => {
  "use strict";

  const REPO = "https://github.com/ap0l1on/Motherlode";
  const RAW = "https://raw.githubusercontent.com/ap0l1on/Motherlode/main/";
  const PAGE = 24;

  // Strong first impressions: these lead the library and fill the first view of the home page.
  const FEATURED = [
    "web/landing-pages/violet-sleep-sphere", "3d/product-renders/ruby-wing-coupe", "ui/tab-bars/honey-drop-tabs",
    "animations/particles/copper-spiral-galaxy", "web/landing-pages/race-garage-slider", "dashboards/e-commerce/sage-store-console",
    "device-screens/smart-displays/amber-glass-tube-clock", "web/e-commerce/solar-citrus-soda", "ui/menus/neon-orbit-menu",
    "web/product-pages/color-block-beetle-specimens", "3d/abstract/prismatic-filament-projector",
    "animations/animated-illustrations/cobalt-fan-peacock", "web/landing-pages/blue-orbit-run", "ui/cards/prismatic-trainer-picker",
    "dashboards/analytics/kepler-orbital-command", "web/auth-pages/panda-paw-password", "ui/toggles/eight-ray-day-night",
    "ui/carousels/orbiting-scene-carousel", "games/board-games/turning-color-cube", "web/landing-pages/lunar-gravity",
    "apps/music/soft-clay-record-player", "web/error-pages/tangerine-tumble-404", "animations/motion-graphics/chromatic-thread-loom",
    "web/auth-pages/midnight-lighthouse-login", "ui/progress-bars/aurora-speedometer", "ui/toggles/knurled-brass-power",
    "ui/cards/gilded-astronomer-relic", "3d/characters/spectrum-mohawk-sculpture", "ui/navbars/apricot-liquid-navbar",
  ];
  // Designs whose colorways look very different, for the live section on the home page.
  const LIVE = [
    "web/landing-pages/race-garage-slider", "animations/animated-illustrations/cobalt-fan-peacock",
    "ui/toggles/eight-ray-day-night", "web/product-pages/folding-bike-configurator", "animations/particles/copper-spiral-galaxy",
    "dashboards/sales-crm/coral-pipeline", "ui/buttons/rocket-download", "web/product-pages/color-block-beetle-specimens",
    "web/error-pages/tangerine-tumble-404", "dashboards/project-management/indigo-night-workspace",
  ];

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  const plural = (n, word, many = word + "s") => `${n.toLocaleString("en-US")} ${n === 1 ? word : many}`;
  const secs = (v) => `${Number(Number(v).toFixed(1))}s`;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const fine = matchMedia("(hover: hover) and (pointer: fine)");
  const isMac = /Mac|iPhone|iPad|iPod/i.test(navigator.platform || navigator.userAgent);
  const main = $("#main");
  const nav = $("#nav");

  const ICONS = {
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    out: '<path d="M7 17 17 7M8 7h9v9"/>',
    right: '<path d="m9 6 6 6-6 6"/>',
    left: '<path d="m15 6-6 6 6 6"/>',
    down: '<path d="m6 9 6 6 6-6"/>',
    play: '<path d="M8 5.6v12.8a1 1 0 0 0 1.5.86l10.4-6.4a1 1 0 0 0 0-1.72L9.5 4.74A1 1 0 0 0 8 5.6Z" fill="currentColor" stroke="none"/>',
    pause: '<rect x="6.5" y="5" width="3.6" height="14" rx="1.2" fill="currentColor" stroke="none"/><rect x="13.9" y="5" width="3.6" height="14" rx="1.2" fill="currentColor" stroke="none"/>',
    restart: '<path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3L4.5 9"/><path d="M4.5 4.5V9H9"/>',
    copy: '<rect x="8.5" y="8.5" width="11.5" height="11.5" rx="2.6"/><path d="M15.5 8.5V6.6A2.6 2.6 0 0 0 12.9 4H6.6A2.6 2.6 0 0 0 4 6.6v6.3a2.6 2.6 0 0 0 2.6 2.6h1.9"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    download: '<path d="M12 4v11M7 10.5l5 5 5-5M5 20h14"/>',
    expand: '<path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/>',
    shuffle: '<path d="M3 7h3.5c5 0 6 10 11 10H21M3 17h3.5c2 0 3.2-1.6 4.2-3.4M14.3 10.4C15.3 8.6 16.5 7 18.5 7H21M18 4l3 3-3 3M18 14l3 3-3 3"/>',
    grid: '<rect x="4" y="4" width="6.5" height="6.5" rx="1.6"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.6"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.6"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.6"/>',
    book: '<path d="M4 5.5c2.8-1.2 5.6-1 8 .8 2.4-1.8 5.2-2 8-.8v13c-2.8-1.2-5.6-1-8 .8-2.4-1.8-5.2-2-8-.8Z"/><path d="M12 6.3v13"/>',
    hash: '<path d="M5 9h14M5 15h14M10 4 8 20M16 4l-2 16"/>',
    image: '<rect x="3.5" y="4.5" width="17" height="15" rx="2.6"/><circle cx="9" cy="10" r="1.7"/><path d="m20.5 16-4.8-4.8-9.2 8.3"/>',
    film: '<rect x="3.5" y="4.5" width="17" height="15" rx="2.6"/><path d="m10 9.2 4.8 2.8-4.8 2.8Z"/>',
    motion: '<circle cx="12" cy="12" r="8.5"/><path d="m10.2 8.8 5 3.2-5 3.2Z" fill="currentColor"/>',
    still: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M4 15.5 9 11l4 3.5 2.5-2L20 16"/>',
    spark: '<path d="M12 3.5c.7 4.4 3.1 6.8 7.5 7.5-4.4.7-6.8 3.1-7.5 7.5-.7-4.4-3.1-6.8-7.5-7.5 4.4-.7 6.8-3.1 7.5-7.5Z"/>',
  };
  const icon = (name, size = 18, cls = "") =>
    `<svg class="i ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ""}</svg>`;

  /* ---------- Data ---------- */
  let D = null;

  function prepare(catalog, prompts) {
    const rank = new Map(FEATURED.map((id, i) => [id, i]));
    const sections = catalog.sections.map((s, index) => {
      const cats = s.categories.map(([id, name, desc]) => ({ id, name, desc, designs: [] }));
      return { id: s.id, name: s.name, group: s.group, desc: s.description, index, cats, catMap: new Map(cats.map((c) => [c.id, c])), designs: [] };
    });
    const sectionMap = new Map(sections.map((s) => [s.id, s]));
    const designs = [];
    for (const raw of catalog.designs) {
      const [secId, catId, slug] = raw.id.split("/");
      const sec = sectionMap.get(secId);
      const cat = sec && sec.catMap.get(catId);
      if (!cat || !slug) continue;
      const d = { ...raw, sec, cat, slug, added: raw.added || "", rank: rank.has(raw.id) ? rank.get(raw.id) : Infinity };
      d.search = [d.name, d.description, cat.name, sec.name, d.palettes.map((p) => p[0]).join(" ")].join(" ").toLowerCase();
      designs.push(d);
      sec.designs.push(d);
      cat.designs.push(d);
    }
    const byName = (a, b) => a.name.localeCompare(b.name);
    const byNew = (a, b) => (a.added < b.added ? 1 : a.added > b.added ? -1 : 0) || byName(a, b);
    const groups = [];
    for (const s of sections) {
      let g = groups.find((x) => x.name === s.group);
      if (!g) groups.push((g = { name: s.group, sections: [] }));
      g.sections.push(s);
    }
    D = {
      sections, sectionMap, groups, designs, prompts,
      designMap: new Map(designs.map((d) => [d.id, d])),
      newest: [...designs].sort(byNew),
      featured: [...designs].sort((a, b) => a.rank - b.rank || byNew(a, b)),
      catCount: sections.reduce((n, s) => n + s.cats.length, 0),
      filledCats: sections.reduce((n, s) => n + s.cats.filter((c) => c.designs.length).length, 0),
      byName, byNew,
    };
  }

  const poster = (d) => `./posters/${d.id}.webp`;
  const demoSrc = (d) => `./demos/${d.id}.html`;
  const designHref = (d) => `#/${d.id}`;
  const secHref = (s) => `#/${s.id}`;
  const catHref = (s, c) => `#/${s.id}/${c.id}`;

  function matchingGuide(sec, cat) {
    const data = D.prompts;
    const key = sec + "/" + cat;
    return data.guides.find((g) => g.categories && g.categories.includes(key)) ||
      data.guides.find((g) => !g.categories && g.sections.includes(sec)) || data.universal;
  }

  /* ---------- Shared bits ---------- */
  function cardHTML(d) {
    const swatch = [d.palettes[0], ...d.palettes.slice(4, 7)].filter(Boolean);
    return `<article class="card">
      <a class="card-media" href="${designHref(d)}" data-id="${esc(d.id)}" style="--mat:${esc(d.mat)}" aria-label="${esc(d.name)}">
        <img src="${poster(d)}" alt="" loading="lazy" decoding="async">
        ${d.loop ? '<span class="card-badge"><i></i>Animated</span>' : ""}
      </a>
      <div class="card-meta">
        <a class="card-title" href="${designHref(d)}">${esc(d.name)}</a>
        <span class="swatches" title="${d.palettes.length} colorways">${swatch.map((p) => `<i style="--sw:${esc(p[1])}"></i>`).join("")}<em>${d.palettes.length}</em></span>
        <span class="card-sub"><a href="${catHref(d.sec, d.cat)}">${esc(d.cat.name)}</a></span>
      </div>
    </article>`;
  }

  // One live iframe at a time; posters do the rest of the work.
  function previewer() {
    let active = null;
    let timer = 0;
    function start(host, d) {
      stop();
      if (!host.isConnected) return;
      const f = document.createElement("iframe");
      f.className = "pv";
      f.tabIndex = -1;
      f.inert = true;
      f.setAttribute("aria-hidden", "true");
      f.setAttribute("sandbox", "allow-scripts");
      f.style.width = d.width + "px";
      f.style.height = d.height + "px";
      const scale = Math.min(host.clientWidth / d.width, host.clientHeight / d.height);
      f.style.transform = `translate(-50%, -50%) scale(${scale})`;
      f.src = demoSrc(d);
      f.addEventListener("load", () => { if (active && active.f === f) host.classList.add("pv-on"); }, { once: true });
      host.append(f);
      active = { host, f };
    }
    function stop() {
      clearTimeout(timer);
      if (!active) return;
      active.host.classList.remove("pv-on");
      active.f.remove();
      active = null;
    }
    function schedule(host, d, delay = 280) {
      clearTimeout(timer);
      timer = setTimeout(() => start(host, d), delay);
    }
    return { start, stop, schedule };
  }

  function gridPreviews(grid) {
    if (!grid) return () => {};
    const pv = previewer();
    const over = (e) => {
      const media = e.target.closest(".card-media");
      if (!media || media.contains(e.relatedTarget) || e.pointerType !== "mouse" || reduced.matches) return;
      const d = D.designMap.get(media.dataset.id);
      if (d && d.loop) pv.schedule(media, d);
    };
    const out = (e) => {
      const media = e.target.closest(".card-media");
      if (!media || media.contains(e.relatedTarget)) return;
      pv.stop();
    };
    grid.addEventListener("pointerover", over);
    grid.addEventListener("pointerout", out);
    return () => { pv.stop(); grid.removeEventListener("pointerover", over); grid.removeEventListener("pointerout", out); };
  }

  let toastTimer = 0;
  function toast(message) {
    const el = $("#toast");
    el.innerHTML = icon("check", 16) + esc(message);
    el.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("is-on"), 2200);
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.cssText = "position:fixed;top:-1000px;opacity:0";
      document.body.append(area);
      area.select();
      let ok = false;
      try { ok = document.execCommand("copy"); } catch { ok = false; }
      area.remove();
      return ok;
    }
  }

  function observeOnce(el, fn, margin = "0px") {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => fn(e.isIntersecting)), { rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
  }

  /* ---------- Routing ---------- */
  let teardown = [];
  let navType = "push";
  const scrolls = new Map();

  function legacy(raw) {
    if (!raw || raw.startsWith("/")) return null;
    const cut = raw.indexOf("?");
    const path = cut < 0 ? raw : raw.slice(0, cut);
    const params = new URLSearchParams(cut < 0 ? "" : raw.slice(cut + 1));
    if (path === "library") {
      const s = params.get("section");
      const c = params.get("category");
      params.delete("section");
      params.delete("category");
      const rest = params.toString();
      if (!s && !rest) return "#/";
      return "#/" + (s ? s + (c ? "/" + c : "") : "all") + (rest ? "?" + rest : "");
    }
    if (path.startsWith("design/")) return "#/" + path.slice(7) + (params.size ? "?" + params : "");
    return "#/" + raw;
  }

  function route() {
    let raw = location.hash.slice(1);
    const moved = legacy(raw);
    if (moved) {
      history.replaceState(null, "", moved);
      raw = moved.slice(1);
    }
    const cut = raw.indexOf("?");
    const path = (cut < 0 ? raw : raw.slice(0, cut)).replace(/^\/+|\/+$/g, "");
    const params = new URLSearchParams(cut < 0 ? "" : raw.slice(cut + 1));
    const parts = path ? path.split("/").map((p) => { try { return decodeURIComponent(p); } catch { return p; } }) : [];
    if (!parts.length) return { name: "home", params };
    if (parts[0] === "all" && parts.length === 1) return { name: "library", params };
    if (parts[0] === "categories" && parts.length === 1) return { name: "categories", params };
    if (parts[0] === "prompts" && parts.length <= 2) return { name: "prompts", id: parts[1] || "universal", params };
    const sec = D.sectionMap.get(parts[0]);
    if (!sec) return { name: "missing", params };
    if (parts.length === 1) return { name: "library", sec, params };
    const cat = sec.catMap.get(parts[1]);
    if (!cat) return { name: "missing", params };
    if (parts.length === 2) return { name: "library", sec, cat, params };
    const design = D.designMap.get(parts.slice(0, 3).join("/"));
    if (design && parts.length === 3) return { name: "design", design, params };
    return { name: "missing", params };
  }

  function go(hash) {
    navType = "push";
    if (location.hash === hash) render("push");
    else location.hash = hash;
  }

  function render(type) {
    teardown.forEach((fn) => { try { fn(); } catch (err) { console.error(err); } });
    teardown = [];
    const r = route();
    document.body.classList.toggle("is-home", r.name === "home");
    const key = r.name === "design" ? "library" : r.name;
    $$(".nav-links a").forEach((a) => (a.dataset.nav === key ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current")));
    closeMenu();
    if (r.name === "home") renderHome();
    else if (r.name === "library") renderLibrary(r);
    else if (r.name === "design") renderDesign(r);
    else if (r.name === "categories") renderCategories(r);
    else if (r.name === "prompts") renderPrompts(r);
    else renderMissing();
    onScroll();
    const saved = type === "pop" ? scrolls.get(location.hash) : undefined;
    requestAnimationFrame(() => window.scrollTo({ top: saved || 0, behavior: "instant" }));
    if (type === "push" && r.name !== "home") main.focus({ preventScroll: true });
  }

  /* ---------- Home ---------- */
  function renderHome() {
    const n = D.designs.length;
    document.title = "Motherlode · The mother of all design libraries";
    main.innerHTML = `<div class="page home">
      <section class="hero" aria-label="Motherlode">
        <div class="hero-canvas" aria-hidden="true"></div>
        <div class="hero-shade"></div>
        <div class="hero-copy">
          <span class="hero-pill"><span class="live-dot"></span><span><b>${n}</b> live designs and counting</span></span>
          <h1 class="hero-title"><span class="line"><span>The <span class="serif">mother</span> of all</span></span><span class="line"><span>design libraries.</span></span></h1>
          <p class="hero-sub">Real, working designs, from landing pages to particle hearts. Play with them live, flip through their colorways and take the code.</p>
          <div class="hero-cta">
            <a class="btn btn-lime" href="#/all">Browse the library ${icon("arrow", 18, "i-go")}</a>
            <button class="btn btn-ghost" type="button" data-search>${icon("search", 17)} Search <kbd>${isMac ? "⌘" : "Ctrl "}K</kbd></button>
          </div>
        </div>
        <div class="hero-foot"><span><span class="drag-glyph"><i></i><i></i><i></i></span>Drag to explore</span><span class="hint-right">${n} designs · ${D.catCount} categories</span></div>
      </section>
      ${liveHTML()}
      ${bentoHTML()}
      ${freshHTML()}
      ${teaserHTML()}
    </div>`;
    teardown.push(initHero($(".hero", main)));
    teardown.push(initLive($("#live", main)));
    teardown.push(initBento($(".bento", main)));
    teardown.push(gridPreviews($("#fresh .grid", main)));
  }

  function heroList() {
    const lead = FEATURED.map((id) => D.designMap.get(id)).filter(Boolean);
    const taken = new Set(lead.map((d) => d.id));
    const buckets = new Map();
    for (const d of D.newest) {
      if (taken.has(d.id)) continue;
      const key = d.sec.id + "/" + d.cat.id;
      if (!buckets.has(key)) buckets.set(key, []);
      buckets.get(key).push(d);
    }
    const queues = [...buckets.values()].sort((a, b) => b.length - a.length);
    const mixed = [];
    for (let added = true; added;) {
      added = false;
      for (const q of queues) if (q.length) { mixed.push(q.shift()); added = true; }
    }
    return [...lead, ...mixed];
  }

  function initHero(hero) {
    const canvas = $(".hero-canvas", hero);
    const copy = $(".hero-copy", hero);
    const list = heroList();
    if (!list.length) return () => {};
    const pv = previewer();
    const byEl = new WeakMap();
    const DRIFT_X = -0.3;
    const DRIFT_Y = -0.19;
    let tiles = [];
    let tw = 0, th = 0, sw = 0, sh = 0, cols = 0, rows = 0, W = 1, H = 1, vw = 0, vh = 0;
    let shift = [];
    let lens = { cx: 0, cy: 0, rx: 1, ry: 1 };
    let ox = 0, oy = 0, vx = DRIFT_X, vy = DRIFT_Y;
    let raf = 0, last = 0, inView = true, dragging = false, press = null, mark = null, hover = null, suppress = false;
    let tag = null;

    const wrapX = (x) => ((x % W) + W) % W - sw;
    const wrapY = (y) => ((y % H) + H) % H - sh;
    // Tiles clear out around the headline and fade under the nav bar.
    const lensAt = (x, y) => {
      const dx = (x + tw / 2 - lens.cx) / lens.rx;
      const dy = (y + th / 2 - lens.cy) / lens.ry;
      return smooth(0.8, 1.32, Math.sqrt(dx * dx + dy * dy)) * smooth(lens.top - th * 0.15, lens.top + th * 0.55, y + th / 2);
    };

    function measure() {
      const box = canvas.getBoundingClientRect();
      vw = box.width;
      vh = box.height;
      tw = vw < 560 ? 148 : vw < 1000 ? 208 : vw < 1600 ? 252 : 288;
      th = Math.round(tw * 0.74);
      const gap = vw < 560 ? 10 : 16;
      sw = tw + gap;
      sh = th + gap;
      cols = Math.max(Math.ceil(vw / sw) + 2, Math.ceil(Math.sqrt(list.length * (sh / sw) * (vw / Math.max(vh, 1)))));
      rows = Math.max(Math.ceil(vh / sh) + 2, Math.ceil(list.length / cols));
      W = cols * sw;
      H = rows * sh;
      shift = Array.from({ length: cols }, (_, c) => [0, 0.52, 0.16, 0.7, 0.34][c % 5] * sh);
      const c = copy.getBoundingClientRect();
      const navH = nav.getBoundingClientRect().height;
      lens = { cx: c.left - box.left + c.width / 2, cy: c.top - box.top + c.height / 2, rx: c.width / 2 + tw * 0.8, ry: c.height / 2 + th * 0.5, top: navH };
      canvas.style.setProperty("--tw", tw + "px");
      canvas.style.setProperty("--th", th + "px");
    }

    function build() {
      pv.stop();
      canvas.textContent = "";
      measure();
      const total = cols * rows;
      const slots = [];
      for (let k = 0; k < total; k++) {
        const c = k % cols;
        const r = Math.floor(k / cols);
        const x = wrapX(c * sw + ox);
        const y = wrapY(r * sh + shift[c] + oy);
        const seen = x < vw && y < vh && x + tw > 0 && y + th > 0;
        const score = seen ? lensAt(x, y) * 10 - Math.hypot(x + tw / 2 - lens.cx, y + th / 2 - lens.cy) / 1000 : -1;
        slots.push({ k, c, r, score });
      }
      const order = [...slots].sort((a, b) => b.score - a.score);
      const pick = new Array(total);
      order.forEach((slot, i) => { pick[slot.k] = list[i % list.length]; });
      const frag = document.createDocumentFragment();
      tiles = slots.map(({ k, c, r }) => {
        const d = pick[k];
        const el = document.createElement("a");
        el.className = "tile";
        el.href = designHref(d);
        el.tabIndex = -1;
        el.draggable = false;
        el.innerHTML = `<div class="tile-in" style="--mat:${esc(d.mat)}"><img alt="" draggable="false" decoding="async"><span class="tile-cap"><b>${esc(d.name)}</b><span>${esc(d.cat.name)}</span></span></div>`;
        frag.append(el);
        const t = { el, inner: el.firstElementChild, img: el.querySelector("img"), d, c, r, shown: false, live: false, loaded: false };
        byEl.set(el, t);
        return t;
      });
      canvas.append(frag);
      place();
    }

    function load(t) {
      t.loaded = true;
      t.img.addEventListener("load", () => t.img.classList.add("is-in"), { once: true });
      t.img.src = poster(t.d);
    }

    function hide(t) {
      t.shown = false;
      t.el.style.visibility = "hidden";
      if (t.live) { t.live = false; t.el.classList.remove("is-live"); }
    }

    function place() {
      for (const t of tiles) {
        const x = wrapX(t.c * sw + ox);
        const y = wrapY(t.r * sh + shift[t.c] + oy);
        if (!(x < vw && y < vh && x + tw > 0 && y + th > 0)) { if (t.shown) hide(t); continue; }
        const o = lensAt(x, y);
        if (o < 0.015) { if (t.shown) hide(t); continue; }
        if (!t.shown) {
          t.shown = true;
          t.el.style.visibility = "visible";
          if (!t.loaded) load(t);
        }
        t.el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) scale(${(0.8 + 0.2 * o).toFixed(3)})`;
        t.el.style.opacity = o.toFixed(3);
        const live = o > 0.55;
        if (live !== t.live) { t.live = live; t.el.classList.toggle("is-live", live); }
      }
    }

    function tick(now) {
      raf = 0;
      if (!inView || document.hidden) return;
      const dt = last ? Math.min(3, (now - last) / 16.67) : 1;
      last = now;
      if (!dragging) {
        const k = hover || reduced.matches ? 0 : 1;
        const ease = 1 - Math.pow(0.955, dt);
        vx += (DRIFT_X * k - vx) * ease;
        vy += (DRIFT_Y * k - vy) * ease;
        if (Math.abs(vx) > 0.002 || Math.abs(vy) > 0.002) {
          ox += vx * dt;
          oy += vy * dt;
          place();
        }
      }
      raf = requestAnimationFrame(tick);
    }
    const run = () => { if (!raf && inView && !document.hidden) { last = 0; raf = requestAnimationFrame(tick); } };

    function showTag(text) {
      if (!tag || !fine.matches) return;
      tag.textContent = text;
      tag.classList.add("is-on");
    }

    const down = (e) => {
      if (e.button !== 0) return;
      press = { x: e.clientX, y: e.clientY, id: e.pointerId };
      mark = { x: e.clientX, y: e.clientY, t: performance.now() };
    };
    const move = (e) => {
      if (tag && e.pointerType === "mouse") tag.style.transform = `translate3d(${e.clientX + 16}px, ${e.clientY + 18}px, 0)`;
      if (!press || e.pointerId !== press.id) return;
      if (!dragging) {
        if (Math.hypot(e.clientX - press.x, e.clientY - press.y) < 6) return;
        dragging = true;
        canvas.classList.add("is-dragging");
        pv.stop();
        vx = vy = 0;
        showTag("Dragging");
        try { canvas.setPointerCapture(e.pointerId); } catch { /* the pointer is already gone */ }
      }
      const now = performance.now();
      const dx = e.clientX - mark.x;
      const dy = e.clientY - mark.y;
      const step = Math.max(1, now - mark.t);
      ox += dx;
      oy += dy;
      vx = vx * 0.4 + (dx / step) * 16.67 * 0.6;
      vy = vy * 0.4 + (dy / step) * 16.67 * 0.6;
      mark = { x: e.clientX, y: e.clientY, t: now };
      place();
    };
    const up = (e) => {
      if (!press || e.pointerId !== press.id) return;
      if (dragging) {
        if (performance.now() - mark.t > 90) vx = vy = 0;
        vx = clamp(vx, -70, 70);
        vy = clamp(vy, -70, 70);
        dragging = false;
        canvas.classList.remove("is-dragging");
        if (e.type === "pointerup") {
          suppress = true;
          setTimeout(() => { suppress = false; }, 0);
        }
        showTag(hover ? "Open" : "Drag");
        run();
      }
      press = null;
    };
    const swallow = (e) => { if (suppress) { e.preventDefault(); e.stopPropagation(); } };
    const over = (e) => {
      if (e.pointerType !== "mouse") return;
      const el = e.target.closest(".tile");
      const t = el ? byEl.get(el) : null;
      const next = t && t.live ? t : null;
      if (next === hover) return;
      hover = next;
      pv.stop();
      if (!dragging) showTag(hover ? "Open" : "Drag");
      if (hover && hover.d.loop && !dragging && !reduced.matches) pv.schedule(hover.inner, hover.d, 360);
      run();
    };
    const leave = () => {
      hover = null;
      pv.stop();
      if (tag && !dragging) tag.classList.remove("is-on");
      run();
    };

    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointerover", over);
    canvas.addEventListener("pointerleave", leave);
    canvas.addEventListener("click", swallow, true);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);

    if (fine.matches) {
      tag = document.createElement("div");
      tag.className = "cursor-tag";
      tag.setAttribute("aria-hidden", "true");
      document.body.append(tag);
    }

    let resizeTimer = 0;
    const resize = () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(() => { build(); run(); }, 160); };
    window.addEventListener("resize", resize);
    const unobserve = observeOnce(hero, (seen) => { inView = seen; if (seen) run(); else pv.stop(); });
    const visibility = () => { if (!document.hidden) run(); };
    document.addEventListener("visibilitychange", visibility);
    // Fonts change the headline size, which moves the clear space in the middle.
    document.fonts?.ready.then(() => { if (canvas.isConnected) { measure(); place(); } });

    build();
    run();
    return () => {
      cancelAnimationFrame(raf);
      raf = 0;
      inView = false;
      pv.stop();
      unobserve();
      clearTimeout(resizeTimer);
      tag?.remove();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", visibility);
    };
  }

  function liveHTML() {
    return `<section class="section wrap" id="live" aria-labelledby="live-h">
      <div class="live">
        <div class="live-copy">
          <span class="eyebrow">Live, not screenshots</span>
          <h2 class="h2" id="live-h">Every design is <span class="serif">real code.</span></h2>
          <p class="lede">Each one runs right here in your browser. Flip through its colorways, pause the motion, then copy the HTML or download it.</p>
          <div class="live-name"><a id="live-link" href="#/all"></a><span id="live-cat"></span></div>
          <div class="cw-label"><span>Colorways</span><span id="live-count"></span></div>
          <div class="colorways" id="live-cws" role="group" aria-label="Colorways"></div>
          <div class="live-actions">
            <a class="btn btn-lime btn-sm" id="live-open" href="#/all">Open this design ${icon("arrow", 16, "i-go")}</a>
            <button class="btn btn-ghost btn-sm" type="button" id="live-next">${icon("shuffle", 16)} Show another</button>
          </div>
        </div>
        <div class="live-stage-wrap">
          <div class="live-stage" id="live-stage"></div>
          <div class="live-hud">
            <span class="glass live-tag"><span class="live-dot"></span>Running live</span>
            <span class="glass"><button class="icon-btn" type="button" id="live-prev" aria-label="Previous design">${icon("left", 16)}</button><span class="glass-count" id="live-pos"></span><button class="icon-btn" type="button" id="live-fwd" aria-label="Next design">${icon("right", 16)}</button></span>
          </div>
        </div>
      </div>
    </section>`;
  }

  function initLive(root) {
    const picks = LIVE.map((id) => D.designMap.get(id)).filter(Boolean);
    if (!picks.length) { root.remove(); return () => {}; }
    const stage = $("#live-stage", root);
    const chips = $("#live-cws", root);
    const CYCLE = 2400;
    let index = 0, d = null, frame = null, pending = null, palette = "original";
    let cycling = !reduced.matches, inView = false, timer = 0;
    root.style.setProperty("--cycle", CYCLE + "ms");

    const post = (action, value) => frame?.contentWindow?.postMessage({ type: "motherlode-player", action, value }, "*");
    function fit(f) {
      if (!f || !d) return;
      const s = Math.min((stage.clientWidth * 0.9) / d.width, (stage.clientHeight * 0.86) / d.height, 2);
      f.style.transform = `translate(-50%, -50%) scale(${s})`;
    }
    function paint() {
      $$(".cw", chips).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.cw === palette)));
      const bar = $('.cw[aria-pressed="true"] .cw-bar', chips);
      if (bar) { bar.style.animation = "none"; void bar.offsetWidth; bar.style.animation = ""; }
    }
    function cycle() {
      clearTimeout(timer);
      root.classList.toggle("is-cycling", cycling && inView);
      paint();
      if (!cycling || !inView) return;
      timer = setTimeout(() => {
        const at = d.palettes.findIndex((p) => p[0] === palette);
        if (at >= d.palettes.length - 1) show(index + 1);
        else setPalette(d.palettes[at + 1][0], false);
      }, CYCLE);
    }
    function setPalette(name, byUser) {
      palette = name;
      post("palette", name);
      if (byUser) cycling = false;
      cycle();
    }
    function show(i) {
      index = (i + picks.length) % picks.length;
      d = picks[index];
      palette = "original";
      $("#live-link", root).textContent = d.name;
      $("#live-link", root).href = designHref(d);
      $("#live-open", root).href = designHref(d);
      $("#live-cat", root).textContent = `${d.cat.name} · ${d.sec.name}`;
      $("#live-count", root).textContent = String(d.palettes.length);
      $("#live-pos", root).textContent = `${String(index + 1).padStart(2, "0")} / ${String(picks.length).padStart(2, "0")}`;
      chips.innerHTML = d.palettes.map(([name, hex]) =>
        `<button class="cw" type="button" data-cw="${esc(name)}" aria-pressed="${name === palette}" style="--sw:${esc(hex)}"><i></i>${esc(name)}<span class="cw-bar"></span></button>`).join("");
      if (pending) pending.remove();
      const f = document.createElement("iframe");
      f.title = `${d.name}, running live`;
      f.setAttribute("sandbox", "allow-scripts");
      f.referrerPolicy = "no-referrer";
      f.style.width = d.width + "px";
      f.style.height = d.height + "px";
      f.src = demoSrc(d);
      pending = f;
      stage.append(f);
      fit(f);
      f.addEventListener("load", () => {
        if (pending !== f) return;
        pending = null;
        const old = frame;
        frame = f;
        f.classList.add("is-in");
        if (palette !== "original") post("palette", palette);
        if (!inView) post("pause");
        if (old) { old.classList.remove("is-in"); setTimeout(() => old.remove(), 520); }
      }, { once: true });
      cycle();
    }

    chips.addEventListener("click", (e) => {
      const b = e.target.closest(".cw");
      if (b) setPalette(b.dataset.cw, true);
    });
    $("#live-next", root).addEventListener("click", () => show(index + 1 + Math.floor(Math.random() * (picks.length - 1))));
    $("#live-fwd", root).addEventListener("click", () => show(index + 1));
    $("#live-prev", root).addEventListener("click", () => show(index - 1));
    const resize = () => { fit(frame); fit(pending); };
    window.addEventListener("resize", resize);
    const unobserve = observeOnce(stage, (seen) => {
      inView = seen;
      post(seen ? "resume" : "pause");
      cycle();
    }, "-10% 0px");
    show(0);
    return () => { clearTimeout(timer); unobserve(); window.removeEventListener("resize", resize); };
  }

  function sectionPicks(s, n = 3) {
    const sorted = [...s.designs].sort((a, b) => a.rank - b.rank || D.byNew(a, b));
    const picks = [];
    const used = new Set();
    for (const d of sorted) { if (picks.length < n && !used.has(d.cat.id)) { picks.push(d); used.add(d.cat.id); } }
    for (const d of sorted) { if (picks.length < n && !picks.includes(d)) picks.push(d); }
    return picks;
  }

  function bentoHTML() {
    const filled = D.sections.filter((s) => s.designs.length).sort((a, b) => b.designs.length - a.designs.length || a.index - b.index);
    const top = filled.slice(0, 8);
    const rest = filled.slice(8);
    const size = (i) => (i === 0 ? "big" : i === 1 ? "wide" : "");
    return `<section class="section wrap" aria-labelledby="sec-h">
      <div class="section-head">
        <div><span class="eyebrow">Sorted by what it is</span><h2 class="h2" id="sec-h" style="margin-top:18px">Find it <span class="serif">fast.</span></h2></div>
        <a class="head-link" href="#/categories">All ${D.catCount} categories ${icon("arrow", 16)}</a>
      </div>
      <div class="bento">${top.map((s, i) => `<a class="bento-tile ${size(i)}" href="${secHref(s)}">
          <span class="bento-arrow">${icon("out", 20)}</span>
          <div class="fan">${sectionPicks(s).map((d) => `<span class="fan-card" style="--mat:${esc(d.mat)}"><img src="${poster(d)}" alt="" loading="lazy" decoding="async"></span>`).join("")}</div>
          <div class="bento-name"><h3>${esc(s.name)}</h3><span>${s.designs.length}</span></div>
          <p class="bento-desc">${esc(s.desc)}.</p>
        </a>`).join("")}</div>
      <div class="bento-more">${rest.map((s) => `<a class="chip" href="${secHref(s)}">${esc(s.name)} <small>${s.designs.length}</small></a>`).join("")}<a class="chip chip-all" href="#/categories">Browse all ${D.catCount} categories ${icon("arrow", 15)}</a></div>
    </section>`;
  }

  function initBento(bento) {
    if (!bento) return () => {};
    const move = (e) => {
      const tile = e.target.closest(".bento-tile");
      if (!tile) return;
      const r = tile.getBoundingClientRect();
      tile.style.setProperty("--mx", `${e.clientX - r.left}px`);
      tile.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    bento.addEventListener("pointermove", move);
    return () => bento.removeEventListener("pointermove", move);
  }

  function freshHTML() {
    const fresh = D.newest.slice(0, 8);
    return `<section class="section wrap" id="fresh" aria-labelledby="fresh-h">
      <div class="section-head">
        <div><span class="eyebrow">Just added</span><h2 class="h2" id="fresh-h" style="margin-top:18px">Fresh from <span class="serif">the mine.</span></h2></div>
        <a class="head-link" href="#/all?sort=new">Everything new ${icon("arrow", 16)}</a>
      </div>
      <div class="grid">${fresh.map(cardHTML).join("")}</div>
    </section>`;
  }

  function teaserHTML() {
    const u = D.prompts.universal;
    const count = D.prompts.guides.length + 1;
    return `<section class="section wrap" aria-labelledby="prompt-h">
      <div class="teaser">
        <div>
          <span class="eyebrow">Designer prompts</span>
          <h2 class="h2" id="prompt-h">Make your <span class="serif">own.</span></h2>
          <p class="lede">${count} copy-ready briefs for every kind of design, covering composition, type, color, motion and the final check. Paste one into your favorite AI or hand it to a designer.</p>
          <a class="btn btn-lime" href="#/prompts">Open the prompts ${icon("arrow", 18, "i-go")}</a>
        </div>
        <div class="doc" aria-hidden="true">
          <div class="doc-top"><b>${esc(u.title)}</b><span>${icon("copy", 13)}</span></div>
          ${u.paragraphs.slice(0, 3).map((p) => `<p>${esc(p)}</p>`).join("")}
        </div>
      </div>
    </section>`;
  }

  /* ---------- Library ---------- */
  function renderLibrary(r) {
    const { sec, cat, params } = r;
    const scope = cat ? cat.designs : sec ? sec.designs : D.designs;
    const state = {
      q: (params.get("q") || "").slice(0, 120),
      type: ["animated", "static"].includes(params.get("type")) ? params.get("type") : "",
      sort: ["new", "az"].includes(params.get("sort")) ? params.get("sort") : "",
      page: clamp(parseInt(params.get("page"), 10) || 1, 1, 400),
      empties: params.get("empty") === "1",
    };
    const path = cat ? `${sec.id}/${cat.id}` : sec ? sec.id : "all";
    const title = cat ? cat.name : sec ? sec.name : "All designs";
    const desc = cat ? `${cat.desc}.` : sec ? `${sec.desc}.` :
      `Every design in Motherlode, ${plural(D.filledCats, "category", "categories")} deep and growing. Hover anything to see it move.`;
    document.title = `${title} · Motherlode`;

    const filled = D.sections.filter((s) => s.designs.length || s === sec).sort((a, b) => b.designs.length - a.designs.length || a.index - b.index);
    const sectionRail = `<div class="rail" aria-label="Sections">
      <a class="chip" href="#/all" ${!sec ? 'aria-current="page"' : ""}>All <small>${D.designs.length}</small></a>
      ${filled.map((s) => `<a class="chip" href="${secHref(s)}" ${s === sec ? 'aria-current="page"' : ""}>${esc(s.name)} <small>${s.designs.length}</small></a>`).join("")}
    </div>`;
    let catRail = "";
    if (sec) {
      const empty = sec.cats.filter((c) => !c.designs.length && c !== cat);
      const shown = sec.cats.filter((c) => c.designs.length || c === cat || state.empties);
      catRail = `<div class="rail rail-sub" aria-label="${esc(sec.name)} categories">
        <a class="chip" href="${secHref(sec)}" ${!cat ? 'aria-current="page"' : ""}>All ${esc(sec.name)} <small>${sec.designs.length}</small></a>
        ${shown.map((c) => `<a class="chip ${c.designs.length ? "" : "is-empty"}" href="${catHref(sec, c)}" ${c === cat ? 'aria-current="page"' : ""}>${esc(c.name)} <small>${c.designs.length}</small></a>`).join("")}
        ${empty.length && !state.empties ? `<button class="chip is-empty" type="button" id="show-empty">+ ${empty.length} empty</button>` : ""}
      </div>`;
    }
    const crumbs = `<nav class="crumbs" aria-label="Breadcrumb"><a href="#/all">Library</a>${sec ? `${icon("right", 14)}<a href="${secHref(sec)}">${esc(sec.name)}</a>` : ""}${cat ? `${icon("right", 14)}<span aria-current="page">${esc(cat.name)}</span>` : ""}</nav>`;

    main.innerHTML = `<div class="page wrap page-top library">
      ${crumbs}
      <div class="title-row"><h1 class="h1">${esc(title)}<sup>${scope.length}</sup></h1></div>
      <p class="page-desc">${esc(desc)}</p>
      ${sectionRail}${catRail}
      <div class="toolbar">
        <label class="filter">${icon("search", 17)}<input type="search" id="lib-q" placeholder="Filter ${plural(scope.length, "design")}" value="${esc(state.q)}" autocomplete="off" aria-label="Filter designs"></label>
        <div class="seg" role="group" aria-label="Motion">${[["", "All"], ["animated", "Animated"], ["static", "Static"]].map(([k, label]) => `<button type="button" data-type="${k}" aria-pressed="${k === state.type}">${label}</button>`).join("")}</div>
        <label class="select"><span class="sr-only">Sort</span><select id="lib-sort"><option value="">Featured</option><option value="new" ${state.sort === "new" ? "selected" : ""}>Newest</option><option value="az" ${state.sort === "az" ? "selected" : ""}>A to Z</option></select>${icon("down", 15)}</label>
        <span class="count" id="lib-count"></span>
      </div>
      <div class="results" id="lib-results"></div>
    </div>`;

    const results = $("#lib-results", main);
    let unmore = () => {};
    let unpreview = () => {};

    function list() {
      const terms = state.q.toLowerCase().split(/\s+/).filter(Boolean);
      const found = scope.filter((d) => (!state.type || (state.type === "animated" ? !!d.loop : !d.loop)) && terms.every((t) => d.search.includes(t)));
      if (state.sort === "new") found.sort(D.byNew);
      else if (state.sort === "az") found.sort(D.byName);
      else found.sort((a, b) => a.rank - b.rank || D.byNew(a, b));
      return found;
    }
    function sync() {
      const q = new URLSearchParams();
      if (state.q) q.set("q", state.q);
      if (state.type) q.set("type", state.type);
      if (state.sort) q.set("sort", state.sort);
      if (state.page > 1) q.set("page", String(state.page));
      if (state.empties) q.set("empty", "1");
      history.replaceState(null, "", `#/${path}${q.size ? "?" + q : ""}`);
    }
    function draw() {
      unmore();
      unpreview();
      const found = list();
      const shown = Math.min(found.length, state.page * PAGE);
      $("#lib-count", main).textContent = found.length === scope.length ? plural(found.length, "design") : `${found.length} of ${scope.length}`;
      if (!found.length) {
        const guide = matchingGuide(sec ? sec.id : "", cat ? cat.id : "");
        results.innerHTML = state.q || state.type ? `<div class="empty"><div class="empty-mark">${icon("search", 24)}</div><h2>Nothing matches that</h2><p>Try a different word or clear the filters.</p><div class="row"><button class="btn btn-ghost btn-sm" type="button" id="clear">Clear filters</button></div></div>`
          : `<div class="empty"><div class="empty-mark">${icon("spark", 24)}</div><h2>Nothing mined here yet</h2><p>${esc(cat ? cat.name : sec ? sec.name : "This shelf")} is still empty. Designs land here as they're rebuilt. Want to make one? Start with the ${esc(guide.title.toLowerCase())}.</p><div class="row"><a class="btn btn-lime btn-sm" href="#/prompts/${esc(guide.id)}">Open the prompt ${icon("arrow", 16)}</a>${sec ? `<a class="btn btn-ghost btn-sm" href="${secHref(sec)}">Back to ${esc(sec.name)}</a>` : ""}</div></div>`;
        $("#clear", results)?.addEventListener("click", () => {
          state.q = ""; state.type = ""; state.page = 1;
          $("#lib-q", main).value = "";
          $$(".seg button", main).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.type === "")));
          sync(); draw();
        });
        return;
      }
      results.innerHTML = `<div class="grid">${found.slice(0, shown).map(cardHTML).join("")}</div>
        ${shown < found.length ? `<div class="more-row"><button class="btn btn-ghost" type="button" id="more">Show more <span style="color:var(--muted)">${found.length - shown} left</span></button></div>` : ""}`;
      unpreview = gridPreviews($(".grid", results));
      const more = $("#more", results);
      if (more) {
        const grow = () => {
          state.page += 1;
          sync();
          const grid = $(".grid", results);
          const next = list();
          const from = (state.page - 1) * PAGE;
          grid.insertAdjacentHTML("beforeend", next.slice(from, state.page * PAGE).map(cardHTML).join(""));
          if (state.page * PAGE >= next.length) { unmore(); more.parentElement.remove(); }
          else more.querySelector("span").textContent = `${next.length - state.page * PAGE} left`;
        };
        more.addEventListener("click", grow);
        unmore = observeOnce(more, (seen) => { if (seen) grow(); }, "600px");
      }
    }

    let typing = 0;
    $("#lib-q", main).addEventListener("input", (e) => {
      clearTimeout(typing);
      typing = setTimeout(() => { state.q = e.target.value.trim(); state.page = 1; sync(); draw(); }, 90);
    });
    $(".seg", main).addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      state.type = b.dataset.type;
      state.page = 1;
      $$(".seg button", main).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      sync(); draw();
    });
    $("#lib-sort", main).addEventListener("change", (e) => { state.sort = e.target.value; state.page = 1; sync(); draw(); });
    $("#show-empty", main)?.addEventListener("click", () => { state.empties = true; sync(); render("replace"); });
    $(".rail [aria-current]", main)?.scrollIntoView({ block: "nearest", inline: "center" });
    draw();
    teardown.push(() => { clearTimeout(typing); unmore(); unpreview(); });
  }

  /* ---------- Design page ---------- */
  function renderDesign(r) {
    const d = r.design;
    const params = r.params;
    const url = demoSrc(d);
    const slides = d.slides || 1;
    let palette = d.palettes.some((p) => p[0] === params.get("color")) ? params.get("color") : "original";
    let slide = clamp(parseInt(params.get("slide"), 10) || 1, 1, slides);
    let paused = !!d.loop && reduced.matches;
    let frozenAtLoad = paused;
    let generation = 0;
    let elapsed = d.still || 0;
    let started = performance.now();
    let source = "";
    let disposed = false;
    let frame = null;
    const request = new AbortController();
    const siblings = [...d.cat.designs].sort(D.byName);
    const at = siblings.indexOf(d);
    const prev = siblings.length > 1 ? siblings[(at - 1 + siblings.length) % siblings.length] : null;
    const next = siblings.length > 1 ? siblings[(at + 1) % siblings.length] : null;
    const pool = d.cat.designs.length > 1 ? d.cat.designs : d.sec.designs;
    const more = pool.filter((x) => x !== d).sort((a, b) => a.rank - b.rank || D.byNew(a, b)).slice(0, 8);
    const moreIn = d.cat.designs.length > 1 ? d.cat : d.sec;
    const guide = matchingGuide(d.sec.id, d.cat.id);
    const credits = (d.credits || []).map((c) => `<a href="${esc(c.url)}" target="_blank" rel="noopener">${esc(c.handle)} ↗</a>`).join(", ");
    document.title = `${d.name} · ${d.cat.name} · Motherlode`;

    main.innerHTML = `<div class="page wrap page-top design-page">
      <div class="design-top">
        <nav class="crumbs" aria-label="Breadcrumb"><a href="#/all">Library</a>${icon("right", 14)}<a href="${secHref(d.sec)}">${esc(d.sec.name)}</a>${icon("right", 14)}<a href="${catHref(d.sec, d.cat)}">${esc(d.cat.name)}</a></nav>
        ${prev ? `<div class="stepper"><a class="icon-btn" href="${designHref(prev)}" aria-label="Previous: ${esc(prev.name)}" title="Previous (←)">${icon("left", 18)}</a><a class="icon-btn" href="${designHref(next)}" aria-label="Next: ${esc(next.name)}" title="Next (→)">${icon("right", 18)}</a></div>` : ""}
      </div>
      <h1 class="design-title">${esc(d.name)}</h1>
      ${d.description ? `<p class="design-desc">${esc(d.description)}</p>` : ""}
      <div class="design-grid">
        <section class="stage-card" aria-label="Live design">
          <div class="stage" id="stage"></div>
          <div class="stage-bar">
            <div class="meta"><span>${d.width} × ${d.height}</span><span class="hide-sm">${d.loop ? `${icon("motion", 14)}${secs(d.loop)} loop` : `${icon("still", 14)}Static`}</span></div>
            <div class="tools">
              ${slides > 1 ? `<div class="slides"><button class="icon-btn" type="button" id="prev-slide" aria-label="Previous slide">${icon("left", 16)}</button><span id="slide-pos"></span><button class="icon-btn" type="button" id="next-slide" aria-label="Next slide">${icon("right", 16)}</button></div>` : ""}
              ${d.loop ? '<button class="icon-btn" type="button" id="play"></button>' : ""}
              <button class="icon-btn" type="button" id="restart" aria-label="Restart" title="Restart">${icon("restart", 16)}</button>
              <a class="icon-btn" id="full" target="_blank" rel="noopener" aria-label="Open at full size" title="Open at full size">${icon("expand", 16)}</a>
            </div>
          </div>
        </section>
        <aside class="panel" aria-label="Design options">
          <div class="box">
            <div class="box-h"><span>Colorways</span><span>${d.palettes.length}</span></div>
            <div class="palettes" role="group" aria-label="Colorways">${d.palettes.map(([name, hex], i) =>
              `<button class="pal" type="button" data-color="${esc(name)}" aria-pressed="${name === palette}"><i style="--sw:${esc(hex)}"></i><span>${esc(name)}</span>${i < 9 ? `<kbd>${i + 1}</kbd>` : ""}</button>`).join("")}</div>
          </div>
          <div class="box">
            <div class="actions">
              <button class="btn btn-lime" type="button" id="copy" disabled>${icon("copy", 17)}Copy code</button>
              <button class="btn btn-ghost" type="button" id="download" disabled>${icon("download", 17)}Download</button>
            </div>
            <div class="exports"><a id="png" target="_blank" rel="noopener">${icon("image", 15)}PNG</a>${d.loop ? `<a id="mp4" target="_blank" rel="noopener">${icon("film", 15)}MP4</a>` : ""}</div>
          </div>
          <div class="box">
            <dl class="facts">
              <div><dt>Category</dt><dd><a href="${catHref(d.sec, d.cat)}">${esc(d.cat.name)}</a></dd></div>
              <div><dt>Size</dt><dd>${d.width} × ${d.height}</dd></div>
              <div><dt>Motion</dt><dd>${d.loop ? `${secs(d.loop)} loop` : "Static"}</dd></div>
              ${slides > 1 ? `<div><dt>Slides</dt><dd>${slides}</dd></div>` : ""}
              ${credits ? `<div><dt>Based on</dt><dd>A TikTok by ${credits}</dd></div>` : ""}
            </dl>
          </div>
          <div class="box links">
            <a href="${REPO}/tree/main/${esc(d.id)}" target="_blank" rel="noopener"><span>Design folder on GitHub</span>${icon("out", 16)}</a>
            <a href="#/prompts/${esc(guide.id)}"><span>${esc(guide.title)} prompt</span>${icon("arrow", 16)}</a>
          </div>
        </aside>
      </div>
      ${more.length ? `<section class="section" style="padding-top:clamp(64px,8vw,112px)">
        <div class="section-head"><h2 class="h2" style="font-size:clamp(28px,3.4vw,46px)">More in <span class="serif">${esc(moreIn.name)}</span></h2><a class="head-link" href="${moreIn === d.cat ? catHref(d.sec, d.cat) : secHref(d.sec)}">See all ${moreIn.designs.length} ${icon("arrow", 16)}</a></div>
        <div class="grid">${more.map(cardHTML).join("")}</div>
      </section>` : ""}
    </div>`;

    const stage = $("#stage", main);
    const copyBtn = $("#copy", main);
    const downloadBtn = $("#download", main);
    const timeAt = () => (d.loop ? (elapsed + (performance.now() - started) / 1000) % d.loop : 0);
    const demoURL = (atRest = paused, version = 0) => {
      const q = new URLSearchParams();
      if (slides > 1) q.set("slide", String(slide));
      if (atRest && d.loop) q.set("t", String(Number(elapsed.toFixed(4))));
      if (version) q.set("view", String(version));
      return url + (q.size ? "?" + q : "") + "#" + palette;
    };
    const send = (action, value) => frame?.contentWindow?.postMessage({ type: "motherlode-player", action, value }, "*");
    const share = () => {
      const q = new URLSearchParams();
      if (palette !== "original") q.set("color", palette);
      if (slide > 1) q.set("slide", String(slide));
      history.replaceState(null, "", `${designHref(d)}${q.size ? "?" + q : ""}`);
    };
    function fit() {
      if (!frame) return;
      const maxH = clamp(window.innerHeight * 0.66, 280, 780);
      const scale = Math.min(stage.clientWidth / d.width, maxH / d.height, 2.4);
      stage.style.height = `${Math.max(240, Math.round(d.height * scale))}px`;
      frame.style.width = d.width + "px";
      frame.style.height = d.height + "px";
      frame.style.transform = `translate(-50%, -50%) scale(${scale})`;
    }
    function tools() {
      $("#full", main).href = demoURL();
      const exportsBase = `${RAW}${d.id}/exports/${palette}`;
      $("#png", main).href = exportsBase + ".png";
      if (d.loop) {
        $("#mp4", main).href = exportsBase + ".mp4";
        const play = $("#play", main);
        play.innerHTML = icon(paused ? "play" : "pause", 16);
        play.title = play.ariaLabel = paused ? "Play animation" : "Pause animation";
      }
      if (slides > 1) $("#slide-pos", main).textContent = `${slide} / ${slides}`;
      $$(".pal", main).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.color === palette)));
      copyBtn.title = `Copy the HTML in the ${palette} colorway`;
      downloadBtn.title = `Download the HTML in the ${palette} colorway`;
    }
    function load() {
      frozenAtLoad = paused;
      const f = document.createElement("iframe");
      f.title = `${d.name}, live design`;
      f.referrerPolicy = "no-referrer";
      f.setAttribute("sandbox", "allow-scripts allow-forms allow-downloads");
      f.src = demoURL(frozenAtLoad, ++generation);
      f.addEventListener("load", () => {
        if (disposed || frame !== f) return;
        send("palette", palette);
        if (paused && !frozenAtLoad) send("pause");
      });
      frame = f;
      stage.replaceChildren(f);
      fit();
      tools();
    }
    function setPalette(name) {
      if (!name || name === palette) return;
      palette = name;
      share();
      send("palette", palette);
      tools();
    }
    const onMessage = (e) => {
      if (!frame || e.source !== frame.contentWindow || e.data?.type !== "motherlode-slide") return;
      const value = e.data.slide;
      if (!Number.isInteger(value) || value < 1 || value > slides || value === slide) return;
      slide = value;
      share();
      tools();
    };
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.target.closest("input, textarea, select, [contenteditable]") || !$("#search").hidden) return;
      if (e.key === "ArrowLeft" && prev) go(designHref(prev));
      else if (e.key === "ArrowRight" && next) go(designHref(next));
      else if (/^[1-9]$/.test(e.key) && d.palettes[Number(e.key) - 1]) setPalette(d.palettes[Number(e.key) - 1][0]);
    };

    $(".palettes", main).addEventListener("click", (e) => setPalette(e.target.closest(".pal")?.dataset.color));
    $("#play", main)?.addEventListener("click", () => {
      if (!paused) {
        elapsed = timeAt();
        paused = true;
        send("pause");
      } else {
        paused = false;
        started = performance.now();
        if (frozenAtLoad) { elapsed = 0; load(); } else send("resume");
      }
      tools();
    });
    $("#restart", main).addEventListener("click", () => { elapsed = 0; started = performance.now(); load(); toast("Restarted"); });
    for (const [id, step] of [["#prev-slide", -1], ["#next-slide", 1]]) {
      $(id, main)?.addEventListener("click", () => {
        slide = ((slide - 1 + step + slides) % slides) + 1;
        share();
        elapsed = paused ? d.still || 0 : 0;
        started = performance.now();
        load();
      });
    }
    const selected = () => {
      const html = source.replace(/<script data-motherlode-player>[\s\S]*?<\/script>\s*/i, "");
      return palette === "original" ? html : html.replace(/<head\b[^>]*>/i, (head) => `${head}\n<script>if (!location.hash) location.hash = ${JSON.stringify(palette)};</script>`);
    };
    copyBtn.addEventListener("click", async () => {
      if (!source) return;
      if (await copyText(selected())) {
        toast(`Copied the ${palette} HTML`);
        copyBtn.innerHTML = icon("check", 17) + "Copied";
        setTimeout(() => { if (!disposed) copyBtn.innerHTML = icon("copy", 17) + "Copy code"; }, 1800);
      } else {
        toast("Copy didn't work here. Use Download instead.");
      }
    });
    downloadBtn.addEventListener("click", () => {
      if (!source) return;
      const blob = new Blob([selected()], { type: "text/html;charset=utf-8" });
      const href = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = href;
      a.download = `${d.slug}-${palette}.html`;
      document.body.append(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(href), 30000);
    });
    fetch(url, { signal: request.signal })
      .then((res) => { if (!res.ok) throw new Error(String(res.status)); return res.text(); })
      .then((html) => { if (disposed) return; source = html; copyBtn.disabled = false; downloadBtn.disabled = false; })
      .catch(() => { if (!disposed) copyBtn.title = "The source couldn't load. Use the GitHub folder instead."; });

    const sizeWatch = new ResizeObserver(fit);
    sizeWatch.observe(stage.parentElement);
    window.addEventListener("message", onMessage);
    document.addEventListener("keydown", onKey);
    if (!paused) elapsed = 0;
    load();
    teardown.push(gridPreviews($(".grid", main)));
    teardown.push(() => {
      disposed = true;
      request.abort();
      sizeWatch.disconnect();
      window.removeEventListener("message", onMessage);
      document.removeEventListener("keydown", onKey);
    });
  }

  /* ---------- Categories ---------- */
  function renderCategories(r) {
    document.title = "Every category · Motherlode";
    let only = r.params.get("filled") === "1";
    main.innerHTML = `<div class="page wrap page-top">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="#/all">Library</a>${icon("right", 14)}<span>Categories</span></nav>
      <div class="title-row"><h1 class="h1">Every <span class="serif">category.</span><sup>${D.catCount}</sup></h1></div>
      <p class="page-desc">${D.catCount} categories in ${D.sections.length} sections, from logos to tattoo designs. ${D.filledCats} of them have designs so far, and the rest are waiting to be filled.</p>
      <div class="index-tools">
        <label class="filter">${icon("search", 17)}<input type="search" id="cat-q" placeholder="Find a category" autocomplete="off" aria-label="Find a category"></label>
        <div class="seg" role="group" aria-label="Show"><button type="button" data-only="0" aria-pressed="${!only}">All</button><button type="button" data-only="1" aria-pressed="${only}">With designs</button></div>
      </div>
      <div id="cat-list"></div>
    </div>`;
    const box = $("#cat-list", main);
    const input = $("#cat-q", main);
    function draw() {
      const terms = input.value.toLowerCase().split(/\s+/).filter(Boolean);
      const hit = (s, c) => terms.every((t) => `${c.name} ${c.desc} ${s.name}`.toLowerCase().includes(t));
      const html = D.groups.map((g) => {
        const blocks = g.sections.map((s) => {
          const cats = s.cats.filter((c) => (!only || c.designs.length) && hit(s, c));
          if (!cats.length) return "";
          return `<div class="sec"><div class="sec-h"><a href="${secHref(s)}">${esc(s.name)}</a><span>${s.designs.length ? plural(s.designs.length, "design") : `${s.cats.length} categories`}</span></div>
            <div class="cats">${cats.map((c) => `<a class="${c.designs.length ? "" : "is-empty"}" href="${catHref(s, c)}"><span>${esc(c.name)}</span>${c.designs.length ? `<b>${c.designs.length}</b>` : ""}</a>`).join("")}</div></div>`;
        }).join("");
        if (!blocks) return "";
        const count = g.sections.reduce((n, s) => n + s.cats.length, 0);
        return `<section class="group"><div class="group-h"><h2>${esc(g.name)}</h2><span>${g.sections.length} sections · ${count} categories</span></div><div class="secs">${blocks}</div></section>`;
      }).join("");
      box.innerHTML = html || '<p class="no-match">No category matches that. Try another word.</p>';
    }
    input.addEventListener("input", draw);
    $(".seg", main).addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      only = b.dataset.only === "1";
      $$(".seg button", main).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      history.replaceState(null, "", only ? "#/categories?filled=1" : "#/categories");
      draw();
    });
    draw();
  }

  /* ---------- Prompts ---------- */
  function renderPrompts(r) {
    const data = D.prompts;
    const records = [data.universal, ...data.guides];
    const guide = records.find((g) => g.id === r.id) || data.universal;
    const universal = guide === data.universal;
    const groups = [...new Set(data.guides.map((g) => g.group))];
    document.title = `${guide.title} · Motherlode`;
    const link = (g) => `<a href="#/prompts/${esc(g.id)}" ${g === guide ? 'aria-current="page"' : ""}>${esc(g.title)}</a>`;
    main.innerHTML = `<div class="page wrap page-top">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Home</a>${icon("right", 14)}<span>Prompts</span></nav>
      <div class="title-row"><h1 class="h1">Designer <span class="serif">prompts.</span></h1></div>
      <p class="page-desc">Start with the universal brief, then add the one for what you're making. Paste them into your favorite AI, or hand them to a designer.</p>
      <div class="prompt-layout">
        <nav class="prompt-nav" aria-label="Prompts">
          <label class="filter">${icon("search", 16)}<input type="search" id="prompt-q" placeholder="Find a prompt" autocomplete="off" aria-label="Find a prompt"></label>
          <div id="prompt-links"></div>
        </nav>
        <div>
          <label class="select prompt-select"><span class="sr-only">Choose a prompt</span><select id="prompt-pick"><option value="universal" ${universal ? "selected" : ""}>${esc(data.universal.title)}</option>${groups.map((g) => `<optgroup label="${esc(g)}">${data.guides.filter((x) => x.group === g).map((x) => `<option value="${esc(x.id)}" ${x === guide ? "selected" : ""}>${esc(x.title)}</option>`).join("")}</optgroup>`).join("")}</select>${icon("down", 15)}</label>
          <article class="prompt-doc">
            <span class="prompt-kind">${esc(universal ? "Universal brief" : guide.group)}</span>
            <h2>${esc(guide.title)}</h2>
            <p class="prompt-sum">${esc(guide.summary)}</p>
            <div class="prompt-actions">
              <button class="btn btn-lime btn-sm" type="button" id="copy-prompt">${icon("copy", 16)}Copy prompt</button>
              ${universal ? "" : `<button class="btn btn-ghost btn-sm" type="button" id="copy-both">${icon("copy", 16)}Copy with universal brief</button>`}
            </div>
            <div class="prompt-body">${guide.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("")}</div>
            <div class="prompt-foot"><span>${universal ? "Works for anything in the library" : esc(guide.sections.map((s) => D.sectionMap.get(s)?.name || s).join(" · "))}</span><a href="${REPO}/edit/main/docs/prompts.json" target="_blank" rel="noopener">Edit on GitHub ↗</a></div>
          </article>
        </div>
      </div>
    </div>`;
    const links = $("#prompt-links", main);
    function draw() {
      const term = $("#prompt-q", main).value.toLowerCase().trim();
      const hit = (g) => !term || [g.title, g.summary, g.group].join(" ").toLowerCase().includes(term);
      const html = (hit(data.universal) ? `<div class="prompt-group">${link(data.universal)}</div>` : "") +
        groups.map((name) => {
          const items = data.guides.filter((g) => g.group === name && hit(g));
          return items.length ? `<div class="prompt-group"><h3>${esc(name)}</h3>${items.map(link).join("")}</div>` : "";
        }).join("");
      links.innerHTML = html || '<p class="no-match" style="padding:12px 10px">No prompt matches.</p>';
    }
    $("#prompt-q", main).addEventListener("input", draw);
    $("#prompt-pick", main).addEventListener("change", (e) => go(`#/prompts/${e.target.value}`));
    const text = (g) => g.paragraphs.join("\n\n");
    const wire = (id, value, label) => $(id, main)?.addEventListener("click", async () => toast((await copyText(value)) ? label : "Copy didn't work here"));
    wire("#copy-prompt", text(guide), "Prompt copied");
    wire("#copy-both", `${data.universal.title}\n\n${text(data.universal)}\n\n${guide.title}\n\n${text(guide)}`, "Both prompts copied");
    draw();
    $('.prompt-group [aria-current="page"]', main)?.scrollIntoView({ block: "nearest" });
  }

  function renderMissing() {
    document.title = "Not found · Motherlode";
    main.innerHTML = `<div class="page wrap page-top"><div class="empty"><div class="empty-mark">${icon("search", 24)}</div><h2>This vein's empty</h2><p>That link doesn't match anything in the library.</p><div class="row"><a class="btn btn-lime btn-sm" href="#/all">Browse the library</a><a class="btn btn-ghost btn-sm" href="#/">Go home</a></div></div></div>`;
  }

  /* ---------- Search ---------- */
  function initSearch() {
    const box = $("#search");
    const input = $("#search-input");
    const results = $("#search-results");
    let items = [];
    let selected = 0;
    let lastFocus = null;

    const mark = (text, terms) => {
      let out = esc(text);
      const term = terms.find((t) => text.toLowerCase().includes(t));
      if (!term) return out;
      const at = text.toLowerCase().indexOf(term);
      return esc(text.slice(0, at)) + "<mark>" + esc(text.slice(at, at + term.length)) + "</mark>" + esc(text.slice(at + term.length));
    };
    const score = (name, rest, terms) => {
      const n = name.toLowerCase();
      if (!terms.every((t) => n.includes(t) || rest.includes(t))) return 0;
      let s = 1;
      for (const t of terms) {
        if (n.startsWith(t)) s += 6;
        else if (n.includes(" " + t)) s += 4;
        else if (n.includes(t)) s += 2;
      }
      return s;
    };

    function run() {
      const q = input.value.trim().toLowerCase();
      const terms = q.split(/\s+/).filter(Boolean);
      const groups = [];
      if (!terms.length) {
        groups.push(["Jump to", D.sections.filter((s) => s.designs.length).sort((a, b) => b.designs.length - a.designs.length).slice(0, 6)
          .map((s) => ({ href: secHref(s), kind: "section", title: s.name, sub: `${plural(s.designs.length, "design")} · ${s.desc}` }))]);
        groups.push(["Featured", D.featured.slice(0, 6).map((d) => ({ href: designHref(d), kind: "design", d, title: d.name, sub: `${d.cat.name} · ${d.sec.name}` }))]);
      } else {
        const designs = D.designs.map((d) => [score(d.name, d.search, terms), d]).filter(([s]) => s).sort((a, b) => b[0] - a[0] || a[1].rank - b[1].rank).slice(0, 8)
          .map(([, d]) => ({ href: designHref(d), kind: "design", d, title: d.name, sub: `${d.cat.name} · ${d.sec.name}` }));
        const cats = [];
        for (const s of D.sections) for (const c of s.cats) {
          const v = score(c.name, `${c.desc} ${s.name}`.toLowerCase(), terms);
          if (v) cats.push([v + (c.designs.length ? 1 : 0), s, c]);
        }
        cats.sort((a, b) => b[0] - a[0] || b[2].designs.length - a[2].designs.length);
        const sections = D.sections.map((s) => [score(s.name, s.desc.toLowerCase(), terms), s]).filter(([v]) => v).sort((a, b) => b[0] - a[0]).slice(0, 4);
        const prompts = [D.prompts.universal, ...D.prompts.guides].map((g) => [score(g.title, `${g.summary} ${g.group}`.toLowerCase(), terms), g]).filter(([v]) => v).sort((a, b) => b[0] - a[0]).slice(0, 3);
        if (designs.length) groups.push(["Designs", designs]);
        if (cats.length) groups.push(["Categories", cats.slice(0, 6).map(([, s, c]) => ({ href: catHref(s, c), kind: "category", title: c.name, sub: `${s.name} · ${c.designs.length ? plural(c.designs.length, "design") : "empty so far"}` }))]);
        if (sections.length) groups.push(["Sections", sections.map(([, s]) => ({ href: secHref(s), kind: "section", title: s.name, sub: `${plural(s.designs.length, "design")} · ${s.cats.length} categories` }))]);
        if (prompts.length) groups.push(["Prompts", prompts.map(([, g]) => ({ href: `#/prompts/${g.id}`, kind: "prompt", title: g.title, sub: g.summary }))]);
      }
      items = groups.flatMap(([, list]) => list);
      selected = 0;
      if (!items.length) {
        results.innerHTML = `<div class="sr-empty">Nothing for “${esc(input.value.trim())}”. Try “dashboard”, “login” or “heart”.</div>`;
        input.removeAttribute("aria-activedescendant");
        return;
      }
      let i = 0;
      results.innerHTML = groups.map(([label, list]) => `<div class="sr-group">${esc(label)}</div>${list.map((it) => {
        const id = `sr-${i++}`;
        const lead = it.kind === "design"
          ? `<span class="sr-thumb" style="--mat:${esc(it.d.mat)}"><img src="${poster(it.d)}" alt="" loading="lazy"></span>`
          : `<span class="sr-icon">${icon(it.kind === "prompt" ? "book" : it.kind === "section" ? "grid" : "hash", 17)}</span>`;
        return `<div class="sr" role="option" id="${id}" data-i="${i - 1}" aria-selected="false">${lead}<span class="sr-text"><b>${mark(it.title, terms)}</b><span>${esc(it.sub)}</span></span><span class="sr-go">${icon("arrow", 16)}</span></div>`;
      }).join("")}`).join("");
      paint();
    }
    function paint() {
      $$(".sr", results).forEach((el) => el.setAttribute("aria-selected", String(Number(el.dataset.i) === selected)));
      const el = $(`#sr-${selected}`, results);
      if (el) { input.setAttribute("aria-activedescendant", el.id); el.scrollIntoView({ block: "nearest" }); }
    }
    function open(q = "") {
      if (!box.hidden) return;
      lastFocus = document.activeElement;
      box.hidden = false;
      document.documentElement.style.overflow = "hidden";
      input.value = q;
      run();
      requestAnimationFrame(() => input.focus());
    }
    function close() {
      if (box.hidden) return;
      box.hidden = true;
      document.documentElement.style.overflow = "";
      lastFocus?.focus?.({ preventScroll: true });
    }
    function choose(i) {
      const it = items[i];
      if (!it) return;
      close();
      go(it.href);
    }
    input.addEventListener("input", run);
    input.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        if (!items.length) return;
        selected = (selected + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
        paint();
      } else if (e.key === "Enter") {
        e.preventDefault();
        choose(selected);
      } else if (e.key === "Tab") {
        e.preventDefault();
      }
    });
    results.addEventListener("pointermove", (e) => {
      const el = e.target.closest(".sr");
      if (el && Number(el.dataset.i) !== selected) { selected = Number(el.dataset.i); paint(); }
    });
    results.addEventListener("click", (e) => { const el = e.target.closest(".sr"); if (el) choose(Number(el.dataset.i)); });
    box.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) close(); });
    document.addEventListener("click", (e) => { if (e.target.closest("[data-search]")) open(); });
    document.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); box.hidden ? open() : close(); return; }
      if (e.key === "Escape" && !box.hidden) { e.preventDefault(); close(); return; }
      if (e.key === "/" && box.hidden && !e.target.closest("input, textarea, select, [contenteditable]")) { e.preventDefault(); open(); }
    });
    $$(".st-kbd").forEach((k) => { k.textContent = isMac ? "⌘K" : "Ctrl K"; });
  }

  /* ---------- Chrome ---------- */
  function renderFooter() {
    const foot = $("#footer");
    foot.innerHTML = `<div class="wrap">
      <div class="foot-top">
        <div class="foot-brand"><a class="brand" href="#/"><img src="./assets/mark.svg?v=3" alt="" width="30" height="30"><span>Motherlode</span></a>
          <p>The mother of all design libraries. Every design is rebuilt in code from a creator's post, and links back to it.</p></div>
        <div class="foot-col"><h4>Library</h4><a href="#/all">All designs</a><a href="#/all?sort=new">Newest</a><a href="#/categories">Categories</a><a href="#/prompts">Designer prompts</a></div>
        <div class="foot-col"><h4>Project</h4><a href="${REPO}" target="_blank" rel="noopener">GitHub ↗</a><a href="${REPO}#adding-a-design" target="_blank" rel="noopener">How designs are added ↗</a></div>
      </div>
      <div class="wordmark" aria-hidden="true"><span>Motherlode</span><span class="lit">Motherlode</span></div>
      <div class="foot-bottom"><span>${plural(D.designs.length, "design")} · ${D.catCount} categories · 8+ colorways each</span><span>Built with HTML, CSS and a lot of colorways.</span></div>
    </div>`;
    const word = $(".wordmark", foot);
    const lit = $(".lit", foot);
    word.addEventListener("pointermove", (e) => {
      const r = word.getBoundingClientRect();
      lit.style.setProperty("--mx", `${e.clientX - r.left}px`);
      lit.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
    word.addEventListener("pointerleave", () => { lit.style.setProperty("--mx", "-400px"); });
  }

  const menuButton = $(".nav-menu");
  function closeMenu() {
    $("#menu").hidden = true;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open menu");
  }
  menuButton.addEventListener("click", () => {
    const open = $("#menu").hidden;
    $("#menu").hidden = !open;
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  $("#menu").addEventListener("click", (e) => { if (e.target.closest("a")) closeMenu(); });

  function onScroll() {
    nav.classList.toggle("is-solid", window.scrollY > 24);
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Boot ---------- */
  history.scrollRestoration = "manual";
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (a && !e.defaultPrevented) navType = "push";
  }, true);
  window.addEventListener("hashchange", (e) => {
    const before = new URL(e.oldURL).hash;
    scrolls.set(before, window.scrollY);
    const type = navType;
    navType = "pop";
    render(type);
  });

  async function loadJSON(name) {
    const res = await fetch("./" + name, { cache: "no-cache" });
    if (!res.ok) throw new Error(`${name}: ${res.status}`);
    return res.json();
  }
  Promise.all([loadJSON("catalog.json"), loadJSON("prompts.json")])
    .then(([catalog, prompts]) => {
      prepare(catalog, prompts);
      initSearch();
      renderFooter();
      navType = "pop";
      render("push");
    })
    .catch((err) => {
      console.error(err);
      main.innerHTML = `<div class="wrap page-top"><div class="empty"><h2>The library didn't load</h2><p>Refresh the page, or browse the designs on GitHub.</p><div class="row"><a class="btn btn-lime btn-sm" href="${REPO}">Open GitHub</a></div></div></div>`;
    });
})();
