import {repo, escapeHTML as e, icon, routeLink, designLink, mobileBrowse, notify, copyText} from "./ui.js";

function selectedHTML(source, palette) {
  source = source.replace(/<script data-motherlode-player>[\s\S]*?<\/script>\s*/i, "");
  if (palette === "original") return source;
  return source.replace(/<head\b[^>]*>/i, head =>
    head + `\n<script>if (!location.hash) location.hash = ${JSON.stringify(palette)};</script>`);
}

export function showDesign(main, design, context) {
  const d = design;
  const {params, lastLibrary, section, category, guide} = context;
  const url = `./demos/${d.id}.html`;
  let palette = d.palettes.some(([name]) => name === params.get("color")) ? params.get("color") : "original";
  let slide = Math.min(d.slides, Math.max(1, parseInt(params.get("slide"),10) || 1));
  let paused = Boolean(d.loop) && matchMedia("(prefers-reduced-motion: reduce)").matches;
  let frozenAtLoad = paused;
  let generation = 0;
  let elapsed = d.still || 0;
  let started = performance.now();
  let source, disposed = false;
  const request = new AbortController();
  const sourceRepo = `${repo}/tree/main/${d.id}`;
  const credits = d.credits.map(c => `<a href="${e(c.url)}" target="_blank" rel="noopener">${e(c.handle)} ${icon("external",12)}</a>`).join(" ");
  const variantButtons = d.palettes.map(([name,color]) => `<button type="button" class="palette-button" data-color="${e(name)}" aria-pressed="${name===palette}"><i style="--swatch:${color}"></i><span>${e(name)}</span><span class="palette-tick">${icon("check",13)}</span></button>`).join("");
  document.title = `${d.name} · Motherlode`;
  main.innerHTML = `<div class="page detail-page">
    ${mobileBrowse()}<nav class="breadcrumbs" aria-label="Breadcrumb"><a href="${e(lastLibrary)}">Library</a>${icon("chev-r",13)}<a href="${routeLink("library",{section:d.section})}">${e(section)}</a>${icon("chev-r",13)}<a href="${routeLink("library",{section:d.section,category:d.category})}">${e(category)}</a></nav>
    <div class="page-heading"><h1>${e(d.name)}</h1><p>${e(d.description)}</p></div>
    <div class="detail-layout"><section class="preview-panel" aria-label="Interactive design">
    <div class="preview-tools"><strong>${icon("frame",16)} Live preview</strong><div>${d.loop ? `<button class="icon-button" id="play-toggle" aria-label="Pause animation"></button>` : ""}
    <button id="restart-demo" class="icon-button" title="Restart preview" aria-label="Restart preview">${icon("reset",16)}</button>
    <a id="full-demo" class="icon-button" target="_blank" rel="noopener" title="Open at original size" aria-label="Open at original size">${icon("external",16)}</a></div></div>
    <div id="stage" class="stage"></div>
    <div class="preview-footer"><span>${d.width} × ${d.height} px</span>${d.slides>1 ? `<div class="slide-controls"><button class="icon-button" id="prev-slide" aria-label="Previous slide">${icon("chev-l",15)}</button><span id="slide-position"></span><button class="icon-button" id="next-slide" aria-label="Next slide">${icon("chev-r",15)}</button></div>` : `<span>${d.loop ? `${icon("motion",14)} ${Number(d.loop.toFixed(2))}s loop` : `${icon("still",14)} Static design`}</span>`}</div></section>
    <aside class="inspector" aria-label="Design controls"><h2>Colorways <span>${d.palettes.length}</span></h2><div class="palette-list" aria-label="Choose a colorway">${variantButtons}</div>
    <div class="source-actions"><button type="button" class="primary-button" id="copy-design" disabled>${icon("copy",17)}Copy code</button>
    <button type="button" class="quiet-button" id="download-design" disabled>${icon("download",17)}Download HTML</button><span id="code-status" class="sr-only" role="status"></span></div>
    <div class="export-links"><strong>Exports</strong><div><a id="export-png" target="_blank" rel="noopener">PNG ${icon("external",13)}</a>${d.loop?`<a id="export-mp4" target="_blank" rel="noopener">MP4 ${icon("external",13)}</a>`:""}</div></div></aside></div>
    <div class="design-links"><div><strong>Source</strong><a href="${sourceRepo}" target="_blank" rel="noopener">${icon("github",15)}Design folder</a>${credits?`<strong>Reference</strong>${credits}`:""}</div><a href="#prompts/${guide.id}">${icon("book",16)}${e(guide.title)} prompt</a></div></div>`;
  let frame;
  const stage = main.querySelector("#stage");
  const copy = main.querySelector("#copy-design");
  const download = main.querySelector("#download-design");
  const timeAt = () => d.loop ? ((elapsed + (performance.now()-started)/1000) % d.loop) : 0;
  const demoURL = (atRest = paused, version = 0) => {
    const query = new URLSearchParams();
    if (d.slides>1) query.set("slide",String(slide));
    if (atRest && d.loop) query.set("t",String(Number(elapsed.toFixed(4))));
    if (version) query.set("view",String(version));
    return url + (query.size?"?"+query:"") + "#" + palette;
  };
  function fitFrame() {
    if (!frame) return;
    const available = stage.clientWidth;
    const scale = Math.min(available / d.width, Math.max(260, Math.min(680, window.innerHeight*.64)) / d.height);
    stage.style.height = `${Math.max(152,Math.round(d.height*scale))}px`;
    frame.style.width = `${d.width}px`;
    frame.style.height = `${d.height}px`;
    frame.style.transform = `translate(-50%, -50%) scale(${scale})`;
  }
  function send(action, value) {
    frame.contentWindow?.postMessage({type:"motherlode-player",action,value}, "*");
  }
  function updateTools() {
    main.querySelector("#full-demo").href=demoURL();
    const exports = `https://raw.githubusercontent.com/ap0l1on/Motherlode/main/${d.id}/exports/${palette}`;
    main.querySelector("#export-png").href=exports+".png";
    if (d.loop) {
      main.querySelector("#export-mp4").href=exports+".mp4";
      const toggle=main.querySelector("#play-toggle");
      toggle.innerHTML=icon(paused?"play":"pause",16);
      toggle.title=toggle.ariaLabel=paused?"Play animation":"Pause animation";
    }
    if (d.slides>1) main.querySelector("#slide-position").textContent=`Slide ${slide} of ${d.slides}`;
    main.querySelectorAll("[data-color]").forEach(b => b.setAttribute("aria-pressed",String(b.dataset.color===palette)));
    copy.title=`Copy standalone HTML in the ${palette} colorway`;
    download.title=`Download standalone HTML in the ${palette} colorway`;
  }
  function loadFrame() {
    frozenAtLoad = paused;
    // A new frame starts its own preview without adding a second Back step.
    frame = document.createElement("iframe");
    frame.id = "demo-frame";
    frame.title = d.name + " interactive design";
    frame.referrerPolicy = "no-referrer";
    frame.setAttribute("sandbox", "allow-scripts allow-forms allow-downloads");
    frame.src = demoURL(frozenAtLoad, ++generation);
    frame.addEventListener("load", () => {
      if (disposed) return;
      send("palette",palette);
      if (paused && !frozenAtLoad) send("pause");
    });
    stage.replaceChildren(frame);
    fitFrame();
    updateTools();
  }
  function receiveSlide(event) {
    if (event.source !== frame.contentWindow || event.data?.type !== "motherlode-slide") return;
    const value = event.data.slide;
    if (!Number.isInteger(value) || value < 1 || value > d.slides || value === slide) return;
    slide = value;
    history.replaceState(null,"",designLink(d.id,palette,slide));
    updateTools();
  }
  window.addEventListener("message", receiveSlide);
  main.querySelector(".palette-list").addEventListener("click",ev=>{
    const button=ev.target.closest("[data-color]");
    if(!button || palette===button.dataset.color) return;
    palette=button.dataset.color;
    history.replaceState(null,"",designLink(d.id,palette,slide));
    send("palette",palette);
    updateTools();
  });
  main.querySelector("#play-toggle")?.addEventListener("click",()=>{
    if (!paused) {
      elapsed = timeAt();
      paused = true;
      send("pause");
    } else {
      paused = false;
      started = performance.now();
      if (frozenAtLoad) { elapsed=0; loadFrame(); }
      else send("resume");
    }
    updateTools();
  });
  main.querySelector("#restart-demo").addEventListener("click",()=>{
    elapsed=0;started=performance.now();loadFrame();notify("Preview restarted");
  });
  for (const [id,change] of [["#prev-slide",-1],["#next-slide",1]]) {
    main.querySelector(id)?.addEventListener("click",()=>{
      slide=((slide-1+change+d.slides)%d.slides)+1;
      history.replaceState(null,"",designLink(d.id,palette,slide));
      elapsed=paused?(d.still||0):0;started=performance.now();loadFrame();
    });
  }
  copy.addEventListener("click",async()=>{
    if (!source) return;
    if(await copyText(selectedHTML(source,palette),"Design code") && !disposed) {
      copy.innerHTML=icon("check",17)+"Copied";
      setTimeout(()=>{if(!disposed)copy.innerHTML=icon("copy",17)+"Copy code";},1800);
    }
  });
  download.addEventListener("click",()=>{
    if(!source)return;
    const blob=new Blob([selectedHTML(source,palette)],{type:"text/html;charset=utf-8"});
    const link=document.createElement("a");
    const objectUrl=URL.createObjectURL(blob);
    link.href=objectUrl;link.download=d.id.split("/").at(-1)+"-"+palette+".html";
    document.body.append(link);link.click();link.remove();
    setTimeout(()=>URL.revokeObjectURL(objectUrl),30000);
  });
  fetch(url,{signal:request.signal}).then(r=>{
    if(!r.ok)throw new Error("Source could not load");
    return r.text();
  }).then(html=>{
    if (disposed) return;
    source=html;copy.disabled=false;download.disabled=false;
  }).catch(()=>{
    if(disposed)return;
    const status=main.querySelector("#code-status");
    status.className="source-error";status.innerHTML=`Source unavailable. <a href="${sourceRepo}/source">Open the design folder</a>.`;
  });
  const observer=new ResizeObserver(fitFrame);
  observer.observe(stage);
  window.addEventListener("resize",fitFrame);
  if (!paused) elapsed=0;
  loadFrame();
  return () => {
    disposed=true;
    request.abort();
    observer.disconnect();
    window.removeEventListener("resize",fitFrame);
    window.removeEventListener("message",receiveSlide);
  };
}
