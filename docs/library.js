import {repo, escapeHTML as e, icon, routeLink, designLink, mobileBrowse} from "./ui.js";
import {showDesign} from "./design.js";
import {showPrompts, matchingGuide} from "./prompts.js";

const main = document.querySelector("#main-content");
const sidebar = document.querySelector("#sidebar");
const search = document.querySelector("#search-designs");
const shade = document.querySelector(".sidebar-shade");
const navLibrary = document.querySelector("#nav-library");
const navPrompts = document.querySelector("#nav-prompts");
const perPage = 18;
const features = [
  {id:"animations/particles/copper-spiral-galaxy", art:"copper-spiral-galaxy", background:"#271219"},
  {id:"3d/abstract/prismatic-filament-projector", art:"prismatic-filament-projector", background:"#030509"},
  {id:"animations/animated-illustrations/ink-and-cherry-canopy", art:"ink-and-cherry-canopy", background:"#fffdfc", light:true}
];
const opening = [
  "dashboards/e-commerce/sage-store-console", "ui/tab-bars/honey-drop-tabs", "3d/product-renders/ruby-wing-coupe",
  "web/product-pages/color-block-beetle-specimens", "device-screens/smart-displays/amber-glass-tube-clock",
  "web/landing-pages/alpine-destination-carousel", "ui/segmented-controls/liquid-focus-controls",
  "print/posters/think-freely-crowd", "games/board-games/turning-color-cube",
  "web/landing-pages/violet-sleep-sphere", "social/instagram-carousels/four-design-directions",
  "animations/animated-illustrations/cobalt-fan-peacock"
];
const sectionOrder = ["ui","dashboards","animations","web","3d","apps","app-screens","data","games","social","device-screens","mac","watch","print","video"];
const symbols = {ui:"grid", dashboards:"dashboard", animations:"motion", web:"web", "3d":"box",
  apps:"phone", "app-screens":"phone", data:"chart", games:"game", social:"sheets", "device-screens":"monitor",
  mac:"monitor", watch:"clock", print:"sheets", video:"play", backgrounds:"still", education:"book", merch:"box", seasonal:"spark"};
let sections, designs, guideData, designMap, ranked, sectionMap;
let pageCleanup, currentView, currentFilter, featureIndex = 0;
let lastLibrary = "#library", lastScroll = 0, emptySections = false;
const expanded = new Set();

function closeSidebar(returnFocus = false) {
  const wasOpen = document.body.classList.contains("sidebar-open");
  document.body.classList.remove("sidebar-open");
  shade.hidden = true;
  document.querySelectorAll(".browse-mobile").forEach(b => b.setAttribute("aria-expanded","false"));
  if (returnFocus && wasOpen) document.querySelector(".browse-mobile")?.focus();
}
function openSidebar() {
  document.body.classList.add("sidebar-open");
  shade.hidden = false;
  document.querySelector(".browse-mobile")?.setAttribute("aria-expanded","true");
  sidebar.querySelector(".drawer-close")?.focus();
}
function sidebarHeader(text) {
  return `<div class="rail-header"><span>${e(text)}</span><button type="button" class="icon-button drawer-close" aria-label="Close navigation">${icon("close")}</button></div>`;
}
function parseRoute() {
  const raw = location.hash.slice(1);
  const separator = raw.indexOf("?");
  const path = (separator === -1 ? raw : raw.slice(0,separator)) || "library";
  return {path, params:new URLSearchParams(separator === -1 ? "" : raw.slice(separator+1))};
}
function libraryFilter(params) {
  const value = Object.fromEntries(params);
  return {section:value.section || "", category:value.category || "", q:(value.q || "").slice(0,200),
    type:["animated","static"].includes(value.type) ? value.type : "",
    sort:["az","za"].includes(value.sort) ? value.sort : "", page:Math.min(10000,Math.max(1,parseInt(value.page,10)||1))};
}
function libraryHref(filter) {
  return routeLink("library",{...filter,page:filter.page > 1 ? filter.page : null});
}
function editFilter(changes, replace = false) {
  const filter = {...(currentView === "library" ? currentFilter : {}), page:1, ...changes};
  const url = libraryHref(filter);
  if (replace && currentView === "library") {
    history.replaceState(null,"",url);
    renderRoute(false);
  } else if (location.hash !== url) {
    location.hash = url;
  }
}
function sectionName(id) { return sectionMap.get(id)?.name || id; }
function categoryName(sec, cat) { return sectionMap.get(sec)?.categories.find(c => c[0] === cat)?.[1] || cat; }
function railLibrary(filter, revealSelected = true) {
  const listing = [...sections].sort((a,b) => {
    const order = item => sectionOrder.includes(item.id) ? sectionOrder.indexOf(item.id) : (item.count ? 80 : 100);
    return order(a)-order(b) || a.name.localeCompare(b.name);
  });
  if (filter.section && revealSelected) expanded.add(filter.section);
  const rows = listing.filter(s => s.count || emptySections || s.id === filter.section).map(s => {
    const open = expanded.has(s.id);
    const active = filter.section === s.id;
    const cats = s.categories.filter(c => s.counts.get(c[0]) || emptySections || c[0] === filter.category);
    const sectionUrl = libraryHref({...filter,section:s.id,category:"",page:1});
    const children = open && cats.length ? `<ul class="category-list">${cats.map(c => {
      const selected = active && filter.category === c[0];
      return `<li><a ${selected ? 'aria-current="page"' : ""} href="${e(libraryHref({...filter,section:s.id,category:c[0],page:1}))}"><span>${e(c[1])}</span><span>${s.counts.get(c[0]) || 0}</span></a></li>`;
    }).join("")}</ul>` : "";
    return `<li><div class="section-row ${active ? "active" : ""}"><a href="${e(sectionUrl)}" ${active && !filter.category?'aria-current="page"':""}>${icon(symbols[s.id]||"stack",17)}<span>${e(s.name)}</span><small>${s.count}</small></a><button class="disclose" type="button" data-expand="${s.id}" aria-label="${open ? "Collapse" : "Expand"} ${e(s.name)} categories" aria-expanded="${open}">${icon(open ? "chev-d" : "chev-r",13)}</button></div>${children}</li>`;
  }).join("");
  const hasSelection = Boolean(filter.section || filter.category);
  sidebar.innerHTML = `${sidebarHeader("Browse library")}<a class="rail-all ${!hasSelection?"active":""}" href="${e(libraryHref({...filter,section:"",category:"",page:1}))}" ${!hasSelection?'aria-current="page"':""}>${icon("grid",17)}<span>All designs</span><small>${designs.length}</small></a>
    <div class="rail-caption">Sections</div><ul class="section-list">${rows}</ul>
    <label class="empty-switch"><input type="checkbox" id="empty-sections" ${emptySections?"checked":""}> Include empty categories</label>`;
}
function card(d) {
  const [sec,cat] = d.id.split("/");
  const href = designLink(d.id);
  const sampled = [d.palettes[0], ...d.palettes.slice(4)].slice(0,3);
  return `<article class="card">
    <a class="card-main" href="${href}">
      <div class="card-image" style="--mat:${d.mat}"><img loading="lazy" decoding="async" src="./posters/${d.id}.webp" alt="" width="${d.width}" height="${d.height}">
      ${d.loop ? `<span class="motion-mark" title="Animated design">${icon("motion",15)}<span class="sr-only">Animated</span></span>`:""}</div>
      <h3>${e(d.name)}</h3></a>
    <div class="card-bottom"><span class="card-category">${e(categoryName(sec,cat))}</span>
    <div class="mini-palettes" aria-label="Colorways">${sampled.map(([name,color]) => `<a class="mini-swatch" href="${designLink(d.id,name)}" aria-label="${e(d.name)}, ${e(name)} colorway" title="${e(name)}" style="--swatch:${color}"></a>`).join("")}<a class="more-colors" href="${href}" aria-label="See all ${d.palettes.length} colorways for ${e(d.name)}">+${d.palettes.length-sampled.length}</a></div></div>
    </article>`;
}
function feature() {
  const eligible = features.filter(f=>designMap.has(f.id));
  if (!eligible.length) return "";
  featureIndex = (featureIndex+eligible.length)%eligible.length;
  const item = eligible[featureIndex], d = designMap.get(item.id), [sec,cat] = d.id.split("/");
  return `<section class="spotlight ${item.light?"light-cover":""}" aria-label="Collection spotlight" style="--cover:${item.background}">
    <div class="spotlight-art"><img src="./assets/${item.art}.webp" alt="" fetchpriority="high"></div>
    <div class="spotlight-copy"><span class="spotlight-label">${icon("spark",14)} Collection spotlight</span>
    <h2>${e(d.name)}</h2><p>${e(categoryName(sec,cat))}<span aria-hidden="true"> · </span>${d.palettes.length} colorways</p>
    <a class="cover-cta" href="${designLink(d.id)}">${icon("frame",15)}Explore design</a></div>
    <div class="feature-controls"><span class="feature-count" aria-live="polite">${String(featureIndex+1).padStart(2,"0")} / ${String(eligible.length).padStart(2,"0")}</span>
    <button type="button" data-feature="-1" aria-label="Previous spotlight">${icon("chev-l",16)}</button>
    <button type="button" data-feature="1" aria-label="Next spotlight">${icon("chev-r",16)}</button></div></section>`;
}
function foundDesigns(filter) {
  const terms = filter.q.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const list = ranked.filter(d => (!filter.section || d.section === filter.section) && (!filter.category || d.category === filter.category) &&
    (!filter.type || (filter.type === "animated" ? Boolean(d.loop) : !d.loop)) && terms.every(term => d.search.includes(term)));
  if (filter.sort) list.sort((a,b) => (filter.sort==="az"?1:-1)*a.name.localeCompare(b.name));
  return list;
}
function renderLibrary(params) {
  const filter = currentFilter = libraryFilter(params);
  lastLibrary = libraryHref(filter);
  if (search.value !== filter.q) search.value = filter.q;
  railLibrary(filter);
  const list = foundDesigns(filter);
  const unfiltered = !filter.q && !filter.section && !filter.category && !filter.type && !filter.sort;
  const section = sectionMap.get(filter.section);
  const category = section?.categories.find(c=>c[0]===filter.category);
  const heading = filter.q ? "Search results" : category?.[1] || section?.name || "Design library";
  const itemLabel = n => `${n} ${n===1?"design":"designs"}`;
  const sub = filter.q ? `${itemLabel(list.length)} matching “${filter.q}”` : category ? `${section.name} · ${itemLabel(list.length)}` :
    section ? `${itemLabel(section.count)} across ${section.counts.size} populated categories` :
    `${itemLabel(designs.length)} to explore, try and make your own.`;
  const shown = Math.min(filter.page*perPage,list.length);
  const noResults = `<div class="empty-state">${icon("search",27)}<h3>${filter.q?"No matching designs":"This shelf is empty"}</h3><p>${filter.q?"Try another search term or clear your filters.":"Browse another category or open its designer prompt."}</p><div><a href="#library" class="quiet-button">Browse all designs</a>${section?`<a class="quiet-button" href="#prompts/${matchingGuide(guideData,section.id,filter.category).id}">Designer prompt</a>`:""}</div></div>`;
  main.innerHTML = `<div class="page library-page">${mobileBrowse()}<div class="page-heading"><h1>${e(heading)}</h1><p>${e(sub)}</p></div>
    ${unfiltered?`<div id="feature-mount">${feature()}</div>`:""}
    <section class="collection"><div class="collection-tools"><h2>${unfiltered?"All designs":"Designs"} <span class="result-count">${list.length}</span></h2>
    <div class="filter-tools"><div class="segmented" aria-label="Design type">${[["","All"],["animated","Animated"],["static","Static"]].map(([key,label])=>`<button type="button" data-type="${key}" aria-pressed="${key===filter.type}">${label}</button>`).join("")}</div>
    <label class="select-wrap">${icon("sort",16)}<span class="sr-only">Sort designs</span><select id="sort-designs"><option value="">Curated</option><option value="az" ${filter.sort==="az"?"selected":""}>A–Z</option><option value="za" ${filter.sort==="za"?"selected":""}>Z–A</option></select>${icon("chev-d",12)}</label></div></div>
    ${list.length?`<div class="card-grid">${list.slice(0,shown).map(card).join("")}</div><div class="list-end"><span>${shown} of ${itemLabel(list.length)}</span>${shown<list.length?'<button type="button" class="quiet-button" id="load-more">Show more designs</button>':""}</div>`:noResults}
    </section></div>`;
  document.title = `${heading} · Motherlode`;
}
function notFound() {
  main.innerHTML = `<div class="page"><div class="empty-state"><h1>Page unavailable</h1><p>This library link does not match a current entry.</p><a class="quiet-button" href="#library">Browse the library</a></div></div>`;
  document.title="Page unavailable · Motherlode";
}
function renderRoute(scroll = true) {
  if (!designMap) return;
  const {path,params} = parseRoute();
  const previous = currentView;
  const returnTo = lastLibrary;
  const next = path.startsWith("design/") ? "design" : path === "prompts" || path.startsWith("prompts/") ? "prompts" : "library";
  if (previous === "library" && next !== "library") lastScroll = window.scrollY;
  pageCleanup?.(); pageCleanup = null;
  closeSidebar();
  currentView=next;
  sidebar.setAttribute("aria-label", next === "prompts" ? "Designer prompt navigation" : "Library sections");
  navPrompts.toggleAttribute("data-active",next==="prompts");
  navLibrary.toggleAttribute("data-active",next!=="prompts");
  for (const [link,active] of [[navPrompts,next==="prompts"],[navLibrary,next!=="prompts"]]) {
    if (active) link.setAttribute("aria-current","page"); else link.removeAttribute("aria-current");
  }
  if(next!=="library") search.value="";
  if(next==="library" && path==="library") renderLibrary(params);
  else if(next==="design") {
    const d=designMap.get(path.slice(7));
    if(d) {
      railLibrary({section:d.section,category:d.category});
      pageCleanup=showDesign(main,d,{params,lastLibrary,section:sectionName(d.section),category:categoryName(d.section,d.category),
        guide:matchingGuide(guideData,d.section,d.category)});
    } else {railLibrary({});notFound();}
  } else if(next==="prompts") {
    showPrompts(main,sidebar,guideData,path.slice(8),{sidebarHeader});
  } else {railLibrary({});notFound();}
  if(scroll) {
    const restore = previous==="design" && next==="library" && (location.hash || "#library")===returnTo;
    window.scrollTo({top:restore?lastScroll:0,behavior:"instant"});
  }
  if(scroll && previous !== undefined && previous !== next) main.focus({preventScroll:true});
}
function boot(catalog,prompts) {
  designs=catalog.designs; sections=catalog.sections; guideData=prompts;
  sectionMap=new Map(sections.map(s=>[s.id,{...s,count:0,counts:new Map()}]));
  sections=[...sectionMap.values()];
  designMap=new Map(designs.map(d=>[d.id,d]));
  for(const d of designs) {
    [d.section,d.category]=d.id.split("/");
    const s=sectionMap.get(d.section);
    s.count++;s.counts.set(d.category,(s.counts.get(d.category)||0)+1);
    d.search=[d.name,d.description,d.id.replace(/[-/]/g," "),s.name,categoryName(d.section,d.category),...d.palettes.map(v=>v[0])].join(" ").toLowerCase();
  }
  const order=new Map(opening.map((id,i)=>[id,i]));
  ranked=[...designs].sort((a,b)=>(order.get(a.id)??999)-(order.get(b.id)??999)||a.name.localeCompare(b.name));
  renderRoute();
}
document.addEventListener("click", ev=>{
  if(ev.target.closest(".browse-mobile")) openSidebar();
  if(ev.target.closest(".drawer-close")||ev.target===shade) closeSidebar(true);
  if (ev.target.closest("#sidebar a") && document.body.classList.contains("sidebar-open")) {
    closeSidebar();
    main.focus({preventScroll:true});
  }
  const expand=ev.target.closest("[data-expand]");
  if(expand) {
    const id=expand.dataset.expand;
    if(expanded.has(id)) expanded.delete(id); else expanded.add(id);
    railLibrary(sidebarSelection(), false);
    sidebar.querySelector(`[data-expand="${id}"]`)?.focus({preventScroll:true});
  }
  const typeButton=ev.target.closest("[data-type]");
  if(typeButton && currentView==="library") {
    const type = typeButton.dataset.type;
    editFilter({type},true);
    main.querySelector(`[data-type="${type}"]`)?.focus({preventScroll:true});
  }
  const featureButton=ev.target.closest("[data-feature]");
  if(featureButton) {
    featureIndex += Number(featureButton.dataset.feature);
    document.querySelector("#feature-mount").innerHTML=feature();
    document.querySelector(`[data-feature="${featureButton.dataset.feature}"]`)?.focus({preventScroll:true});
  }
  if (ev.target.closest("#load-more")) {
    const firstNew=currentFilter.page*perPage;
    editFilter({page:currentFilter.page+1},true);
    main.querySelectorAll(".card-main")[firstNew]?.focus({preventScroll:true});
  }
  if(ev.target.closest(".skip-link")) {ev.preventDefault();main.focus();main.scrollIntoView();}
});
function sidebarSelection() {
  if (currentView !== "design") return currentFilter || {};
  const design = designMap.get(parseRoute().path.slice(7));
  return design ? {section:design.section, category:design.category} : {};
}
document.addEventListener("change",ev=>{
  if(ev.target.id==="sort-designs") {
    editFilter({sort:ev.target.value},true);
    main.querySelector("#sort-designs")?.focus({preventScroll:true});
  }
  if(ev.target.id==="empty-sections") {
    emptySections=ev.target.checked;
    railLibrary(sidebarSelection(), false);
    document.querySelector("#empty-sections").focus({preventScroll:true});
  }
});
document.querySelector("#search-form").addEventListener("submit",ev=>{
  ev.preventDefault();editFilter({q:search.value.trim()},currentView==="library");search.blur();closeSidebar();
});
search.addEventListener("input",()=>{if(currentView==="library") editFilter({q:search.value},true);});
document.addEventListener("keydown",ev=>{
  if(ev.key==="/" && !ev.ctrlKey && !ev.metaKey && !ev.altKey && !ev.target.closest("input,textarea,select,[contenteditable]")) {
    ev.preventDefault();search.focus();search.select();
  }
  if(ev.key==="Escape"&&document.body.classList.contains("sidebar-open")) closeSidebar(true);
  if(ev.key==="Tab"&&document.body.classList.contains("sidebar-open")) {
    const elements=[...sidebar.querySelectorAll('a[href],button,input')].filter(el=>el.offsetParent!==null);
    const first=elements[0],last=elements.at(-1);
    if(ev.shiftKey&&document.activeElement===first){ev.preventDefault();last?.focus();}
    if(!ev.shiftKey&&document.activeElement===last){ev.preventDefault();first?.focus();}
  }
});
window.addEventListener("hashchange",()=>renderRoute());
window.matchMedia("(min-width: 901px)").addEventListener("change",ev=>{if(ev.matches)closeSidebar();});
async function loadJSON(name) {
  const response=await fetch("./"+name,{cache:"no-cache"});
  if(!response.ok) throw new Error(`Could not load ${name}`);
  return response.json();
}
Promise.all([loadJSON("catalog.json"),loadJSON("prompts.json")]).then(([catalog,prompts])=>boot(catalog,prompts)).catch(()=>{
  main.innerHTML=`<div class="page"><h1>Library unavailable</h1><p>The catalog could not load. Refresh the page or browse the repository.</p><a class="quiet-button" href="${repo}">Open GitHub</a></div>`;
});
