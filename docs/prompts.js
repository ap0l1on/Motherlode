import {repo, escapeHTML as e, icon, mobileBrowse, copyText} from "./ui.js";

export function matchingGuide(data, section, category) {
  const key = section + "/" + category;
  return data.guides.find(g => g.categories?.includes(key)) ||
    data.guides.find(g => !g.categories && g.sections.includes(section)) || data.universal;
}

export function showPrompts(main, sidebar, data, id, {sidebarHeader}) {
  const records=[data.universal,...data.guides];
  const guide=records.find(g=>g.id===id)||data.universal;
  const universal=guide===data.universal;
  const groups=[...new Set(data.guides.map(g=>g.group))];
  const fullText=g=>g.paragraphs.join("\n\n");
  document.title=`${guide.title} · Motherlode`;
  const navLink=g=>`<a class="guide-nav-item ${guide===g?"active":""}" ${guide===g?'aria-current="page"':""} href="#prompts/${g.id}">${e(g.title)}</a>`;
  sidebar.innerHTML=`${sidebarHeader("Prompt library")}<label class="prompt-search">${icon("search",16)}<input type="search" id="guide-search" placeholder="Find a prompt…" aria-label="Find a designer prompt"></label><div id="guide-links"></div>`;
  const list=sidebar.querySelector("#guide-links");
  function filterGuides(value) {
    const term=value.toLowerCase().trim();
    const matches=g=>[g.title,g.summary,g.group,...g.sections,...(g.categories||[])].join(" ").toLowerCase().includes(term);
    const contents=groups.map(group=>{
      const guides=data.guides.filter(g=>g.group===group&&matches(g));
      return guides.length?`<div class="guide-nav-group"><div class="rail-caption">${e(group)}</div>${guides.map(navLink).join("")}</div>`:"";
    }).join("");
    list.innerHTML=(matches(data.universal)?`<div class="guide-nav-group">${navLink(data.universal)}</div>`:"")+contents;
    if(!list.textContent)list.innerHTML='<p class="rail-note">No matching prompts.</p>';
  }
  filterGuides("");
  sidebar.querySelector("#guide-search").addEventListener("input",ev=>filterGuides(ev.target.value));
  const options=groups.map(group=>`<optgroup label="${e(group)}">${data.guides.filter(g=>g.group===group).map(g=>`<option value="${g.id}" ${g===guide?"selected":""}>${e(g.title)}</option>`).join("")}</optgroup>`).join("");
  main.innerHTML=`<div class="page prompt-page">${mobileBrowse("Browse prompts")}
    <div class="page-heading"><h1>Designer prompts</h1><p>Start with the universal brief. Add a specialty for the work in front of you.</p></div>
    <div class="prompt-picker"><label for="guide-select">Choose a prompt</label><div class="select-wrap">${icon("book",17)}<select id="guide-select"><option value="universal" ${universal?"selected":""}>Universal design prompt</option>${options}</select>${icon("chev-d",14)}</div></div>
    <article class="prompt-document"><div class="prompt-heading"><div class="prompt-kind">${icon(universal?"book":"stack",16)}${e(universal?"Universal brief":guide.group)}</div>
    <h2>${e(guide.title)}</h2><p>${e(guide.summary)}</p><div class="prompt-actions">
    <button class="primary-button" id="copy-prompt">${icon("copy",16)}Copy ${universal?"prompt":"category prompt"}</button>
    ${universal?"":`<button class="quiet-button" id="copy-combined">${icon("stack",16)}Copy with universal brief</button>`}</div></div>
    <div class="prompt-body">${guide.paragraphs.map(p=>`<p>${e(p)}</p>`).join("")}</div>
    <footer class="prompt-footer"><span>${universal?"Applies across the library":e(guide.sections.map(s=>s.replaceAll("-"," ")).join(" · "))}</span>
    <a href="${repo}/edit/main/docs/prompts.json" target="_blank" rel="noopener">Edit prompts on GitHub ${icon("external",13)}</a></footer></article></div>`;
  main.querySelector("#guide-select").addEventListener("change",ev=>{location.hash="prompts/"+ev.target.value;});
  const copied=(button,text,label)=>{
    const content=button.innerHTML;
    let timer;
    return async()=>{
      if (await copyText(text,label)) {
        clearTimeout(timer);
        button.innerHTML=icon("check",16)+"Copied";
        timer=setTimeout(()=>{if(button.isConnected)button.innerHTML=content;},1800);
      }
    };
  };
  const copy=main.querySelector("#copy-prompt");
  copy.addEventListener("click",copied(copy,fullText(guide),"Prompt"));
  const together=main.querySelector("#copy-combined");
  together?.addEventListener("click",copied(together,`${data.universal.title}\n\n${fullText(data.universal)}\n\n${guide.title}\n\n${fullText(guide)}`,"Combined prompt"));
}
