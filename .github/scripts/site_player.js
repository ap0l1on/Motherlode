// The library controls its sandboxed preview through messages. Standalone pages
// manage their own interactions. The clipboard and download omit this bridge.
(() => {
  if (window.parent === window) return;
  let running = null;
  let lastPage = "";
  function reportSlide() {
    const page = new URLSearchParams(location.search).get("slide") || "1";
    if (page === lastPage) return;
    lastPage = page;
    window.parent.postMessage({type:"motherlode-slide", slide:Number(page)}, "*");
  }
  window.addEventListener("message", event => {
    if (event.source !== window.parent || event.data?.type !== "motherlode-player") return;
    const {action, value} = event.data;
    if (action === "pause" && running === null) {
      running = document.getAnimations().filter(track => track.playState === "running" || track.pending);
      running.forEach(track => track.pause());
    } else if (action === "resume" && running !== null) {
      running.forEach(track => { if (track.playState === "paused") track.play(); });
      running = null;
    } else if (action === "palette" && /^[a-z0-9-]+$/.test(value) && location.hash.slice(1) !== value) {
      window.location.replace("#" + value);
    }
  });
  window.addEventListener("load", reportSlide);
  window.addEventListener("popstate", reportSlide);
  for (const event of ["click","keydown"]) {
    window.addEventListener(event, () => setTimeout(reportSlide, 0));
  }
})();
