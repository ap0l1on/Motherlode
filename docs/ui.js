export const repo = "https://github.com/ap0l1on/Motherlode";
export const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, ch =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);

export function icon(name, size = 18) {
  return '<svg aria-hidden="true" class="icon" width="' + size + '" height="' + size +
    '"><use href="./assets/icons.svg#' + name + '"></use></svg>';
}

export function routeLink(path, values = {}) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) {
    if (value !== undefined && value !== null && value !== "" && value !== false) query.set(key, String(value));
  }
  return "#" + path + (query.size ? "?" + query.toString() : "");
}

export function designLink(id, color = "original", slide = 1) {
  return routeLink("design/" + id, {color: color === "original" ? null : color, slide: slide > 1 ? slide : null});
}

let noticeTimer;
export function notify(message) {
  const box = document.querySelector("#notice");
  clearTimeout(noticeTimer);
  box.textContent = message;
  box.classList.add("visible");
  noticeTimer = setTimeout(() => box.classList.remove("visible"), 2700);
}

export async function copyText(text, name) {
  try {
    if (!navigator.clipboard?.writeText) throw new Error();
    await navigator.clipboard.writeText(text);
  } catch {
    const previous = document.activeElement;
    const area = document.createElement("textarea");
    area.className = "clipboard-helper";
    area.value = text;
    document.body.append(area);
    area.focus();
    area.select();
    let copied = false;
    try { copied = document.execCommand("copy"); } catch { /* The browser can require a manual copy. */ }
    if (!copied) {
      const dialog = document.createElement("dialog");
      dialog.className = "copy-dialog";
      dialog.innerHTML = '<form method="dialog"><h2>Copy ' + escapeHTML(name.toLowerCase()) +
        '</h2><button class="icon-button" aria-label="Close">' + icon("close") + '</button></form><p>Select the text and use your browser’s Copy command.</p>';
      document.body.append(dialog);
      area.className = "";
      area.setAttribute("aria-label", name);
      dialog.append(area);
      dialog.addEventListener("close", () => { dialog.remove(); previous?.focus(); }, {once: true});
      dialog.showModal();
      area.focus();
      area.select();
      return false;
    }
    area.remove();
    previous?.focus();
  }
  notify(name + " copied");
  return true;
}

export function mobileBrowse(label = "Browse sections") {
  return '<button type="button" class="browse-mobile quiet-button" aria-controls="sidebar" aria-expanded="false">' +
    icon("sliders", 16) + escapeHTML(label) + '</button>';
}
