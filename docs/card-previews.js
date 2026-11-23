import {icon} from "./ui.js";

// One live document gets the preview slot. Posters keep the rest of the grid
// cheap, including when hundreds of results have been expanded.
export function enableCardPreviews(grid, designs) {
  if (!grid) return;
  const hover = matchMedia("(hover:hover) and (pointer:fine)");
  const reduced = matchMedia("(prefers-reduced-motion:reduce)");
  const controller = new AbortController();
  const listen = {signal:controller.signal};
  let active, timer, pinned = false;
  const size = new ResizeObserver(fit);
  const visible = new IntersectionObserver(entries=>{
    if (active && entries.some(entry=>entry.target===active.card && !entry.isIntersecting)) stop();
  });
  function fit() {
    if (!active) return;
    const {stage, frame, design} = active;
    const scale = Math.min(stage.clientWidth/design.width,stage.clientHeight/design.height);
    frame.style.transform = `translate(-50%, -50%) scale(${scale})`;
  }
  function stop() {
    clearTimeout(timer);
    if (!active) return;
    const {stage,button,frame,design} = active;
    visible.disconnect();
    size.disconnect();
    stage.classList.remove("show-preview");
    frame.remove();
    button.innerHTML = icon("play",15);
    button.setAttribute("aria-pressed","false");
    button.setAttribute("aria-label","Preview "+design.name);
    button.title = "Play preview";
    active = null;
    pinned = false;
  }
  function start(card, pin) {
    if (active?.card===card) return;
    stop();
    const design = designs.get(card.dataset.design);
    const button = card.querySelector(".motion-mark");
    if (!button || !design?.loop) return;
    const stage = card.querySelector(".card-image");
    const frame = document.createElement("iframe");
    frame.className = "card-frame";
    frame.tabIndex = -1;
    frame.inert = true;
    frame.title = design.name+" motion preview";
    frame.setAttribute("aria-hidden","true");
    frame.setAttribute("sandbox","allow-scripts");
    frame.src = "./demos/"+design.id+".html";
    frame.style.width = design.width+"px";
    frame.style.height = design.height+"px";
    active = {card,stage,button,frame,design};
    pinned = pin;
    button.innerHTML = icon("pause",15);
    button.setAttribute("aria-pressed","true");
    button.setAttribute("aria-label","Stop preview of "+design.name);
    button.title = "Stop preview";
    frame.addEventListener("load",()=>{if (active?.frame===frame) stage.classList.add("show-preview");},{once:true});
    stage.append(frame);
    fit();
    size.observe(stage);
    visible.observe(card);
  }
  grid.addEventListener("pointerover",event=>{
    const card = event.target.closest(".card");
    if (!card || card.contains(event.relatedTarget) || pinned || !hover.matches || reduced.matches) return;
    clearTimeout(timer);
    if (card.querySelector(".motion-mark")) timer=setTimeout(()=>start(card,false),260);
  },listen);
  grid.addEventListener("pointerout",event=>{
    const card = event.target.closest(".card");
    if (!card || card.contains(event.relatedTarget)) return;
    clearTimeout(timer);
    if (active?.card===card && !pinned) stop();
  },listen);
  grid.addEventListener("click",event=>{
    const button = event.target.closest(".motion-mark");
    if (!button) return;
    const card = button.closest(".card");
    if (active?.card===card) stop(); else start(card,true);
  },listen);
  document.addEventListener("keydown",event=>{if(event.key==="Escape") stop();},listen);
  document.addEventListener("visibilitychange",()=>{if(document.hidden) stop();},listen);
  reduced.addEventListener("change",event=>{if(event.matches && !pinned) stop();},listen);
  return () => {stop();controller.abort();};
}
