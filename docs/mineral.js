import {icon} from "./ui.js";

const vertex = `
  attribute vec2 corner;
  varying vec2 position;
  void main() {
    position = vec2(corner.x * 0.5 + 0.5, 0.5 - corner.y * 0.5);
    gl_Position = vec4(corner, 0.0, 1.0);
  }
`;

// The cut stone acts as a refractive surface. All distances are measured in
// viewport heights so a touch leaves a round wave on any aspect ratio.
const fragment = `
  #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
  #else
    precision mediump float;
  #endif
  varying vec2 position;
  uniform sampler2D stone;
  uniform vec4 crop;
  uniform float aspect, clock;
  uniform vec3 pointer, palette;
  uniform vec2 pull;
  uniform vec4 wave;

  void main() {
    vec2 plane = vec2(aspect, 1.0);
    vec2 delta = (position - pointer.xy) * plane;
    float radius = length(delta);
    float lens = exp(-dot(delta, delta) * 9.0) * pointer.z;
    vec2 surface = position - (delta / plane * 0.49 + pull * 0.14) * lens;
    vec2 front = (position - wave.xy) * plane;
    float distanceToTap = length(front);
    float ring = distanceToTap - wave.z * 0.69;
    float pulse = sin(ring * 43.0) * exp(-abs(ring) * 17.0 - wave.z * 1.75) * wave.w;
    surface -= front / max(distanceToTap, 0.001) / plane * (0.070 * pulse);
    surface += vec2(sin(position.y * 5.1 + clock * .39) + .4 * sin(position.x * 7.7 - clock * .33),
                    cos(position.x * 4.8 - clock * .34) + .5 * sin(position.y * 5.9 + clock * .31))
               * vec2(.006, .010);
    vec2 uv = crop.zw + crop.xy * (0.5 + (surface - 0.5) * .974);
    vec3 mineral = texture2D(stone, clamp(uv, 0.001, 0.999)).rgb;
    vec3 malachite = vec3(dot(mineral, vec3(.035,.41,.555)),dot(mineral,vec3(.76,.22,.02)),
                           dot(mineral,vec3(.44,.43,.13)));
    vec3 lapis = vec3(dot(mineral,vec3(.17,.14,.69)),dot(mineral,vec3(.29,.55,.16)),
                        dot(mineral,vec3(.97,.02,.01)));
    vec3 color = mineral * palette.x + malachite * palette.y + lapis * palette.z;
    float glint = (lens * .09 + max(0.0, pulse) * .11) * smoothstep(.16,.9,mineral.r);
    gl_FragColor = vec4(color + (1.0 - color) * glint, 1.0);
  }
`;

function stoneRenderer(canvas, image) {
  const gl = canvas.getContext("webgl", {alpha:false, antialias:false, depth:false, stencil:false, powerPreference:"low-power"});
  if (!gl) return null;
  function shader(kind, source) {
    const object = gl.createShader(kind);
    gl.shaderSource(object,source);
    gl.compileShader(object);
    if (!gl.getShaderParameter(object,gl.COMPILE_STATUS)) throw new Error("Mineral shader unavailable");
    return object;
  }
  const program = gl.createProgram();
  for (const [type,source] of [[gl.VERTEX_SHADER,vertex],[gl.FRAGMENT_SHADER,fragment]]) {
    const object = shader(type,source);
    gl.attachShader(program,object);
    gl.deleteShader(object);
  }
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program,gl.LINK_STATUS)) return null;
  gl.useProgram(program);
  const corner = gl.getAttribLocation(program,"corner");
  gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
  gl.enableVertexAttribArray(corner);
  gl.vertexAttribPointer(corner,2,gl.FLOAT,false,0,0);
  gl.bindTexture(gl.TEXTURE_2D,gl.createTexture());
  for (const axis of [gl.TEXTURE_WRAP_S,gl.TEXTURE_WRAP_T]) gl.texParameteri(gl.TEXTURE_2D,axis,gl.CLAMP_TO_EDGE);
  for (const filter of [gl.TEXTURE_MIN_FILTER,gl.TEXTURE_MAG_FILTER]) gl.texParameteri(gl.TEXTURE_2D,filter,gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,image);
  const location = Object.fromEntries(["crop","aspect","clock","pointer","palette","pull","wave"].map(key => [key,gl.getUniformLocation(program,key)]));
  return {
    resize(w,h,anchor) {
      const ratio = Math.min(window.devicePixelRatio || 1,1.5,2048 / w,1400 / h);
      canvas.width = Math.max(1,Math.round(w*ratio));
      canvas.height = Math.max(1,Math.round(h*ratio));
      gl.viewport(0,0,canvas.width,canvas.height);
      const textureRatio = image.naturalWidth / image.naturalHeight;
      const sx = Math.min(1,w/h/textureRatio);
      const sy = Math.min(1,textureRatio*h/w);
      gl.uniform1f(location.aspect,w/h);
      gl.uniform4f(location.crop,sx,sy,(1-sx)*anchor,(1-sy)*.52);
    },
    draw(time, point, drag, wave, weights) {
      gl.uniform1f(location.clock,time);
      gl.uniform3f(location.pointer,point.x,point.y,point.strength);
      gl.uniform2f(location.pull,drag.x,drag.y);
      gl.uniform4f(location.wave,wave.x,wave.y,Math.min(5,time-wave.start),wave.strength);
      gl.uniform3fv(location.palette,weights);
      gl.drawArrays(gl.TRIANGLES,0,3);
    }
  };
}

const hero = document.querySelector("#masthead");
const shell = document.querySelector(".shell");
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
const minerals = ["carnelian","malachite","lapis"];
let visible = false;
let refresh;
export function showMasthead(show, count) {
  visible = show;
  hero.hidden = !show;
  if (show) {
    if (!hero.isConnected) shell.before(hero);
    document.querySelector("#archive-total").textContent = String(count);
    if (!refresh) refresh = mountMineral();
  } else hero.remove();
  refresh?.();
}

function mountMineral() {
  const scene = hero.querySelector(".mineral-scene");
  const image = hero.querySelector("#mineral-image");
  const canvas = hero.querySelector("canvas");
  const surface = hero.querySelector(".mineral-surface");
  const toggle = hero.querySelector("#mineral-motion");
  const point = {x:.70,y:.52,strength:0};
  const target = {...point};
  const drag = {x:0,y:0};
  const wave = {x:.7,y:.5,start:-5,strength:0};
  const weights = new Float32Array([1,0,0]);
  let material = 0, paused = reduced.matches, manualMotion = false, inView = true;
  let renderer = null, frame = 0, last = 0, time = 0;
  let bounds;
  const updateMotion = () => {
    const label = paused ? "Play background motion" : "Pause background motion";
    toggle.setAttribute("aria-label",label);
    toggle.title = label;
    toggle.innerHTML = icon(paused ? "play" : "pause",15);
    hero.classList.toggle("still-mineral",paused);
  };
  function draw() {
    if (renderer) {
      renderer.draw(time,point,drag,wave,weights);
      canvas.classList.add("ready");
    } else {
      // Keep the print interactive on devices without a WebGL context.
      const age = time-wave.start;
      const pulse = age < 2 ? Math.sin(age*8)*Math.exp(-age*2)*wave.strength : 0;
      const x = (point.x-.5)*point.strength*16 + Math.sin(time*.4)*2;
      const y = (point.y-.5)*point.strength*13 + Math.cos(time*.4)*1.5;
      image.style.transform = `translate(${x.toFixed(2)}px,${y.toFixed(2)}px) scale(${(1.045+.023*point.strength+.018*pulse).toFixed(4)})`;
    }
  }
  function animate(now) {
    frame = 0;
    if (!visible || !inView || paused || document.hidden) return;
    const delta = (now-last)/1000;
    if (delta >= 1/31) {
      const step = Math.min(delta,.075);
      time += step;
      last = now;
      const follow = 1-Math.exp(-step*10);
      const dx = target.x-point.x, dy = target.y-point.y;
      drag.x += (dx-drag.x)*follow;
      drag.y += (dy-drag.y)*follow;
      point.x += dx*follow;
      point.y += dy*follow;
      point.strength += (target.strength-point.strength)*follow;
      for (let i=0;i<weights.length;i++) weights[i] += ((i===material?1:0)-weights[i])*follow;
      draw();
    }
    frame = requestAnimationFrame(animate);
  }
  function run() {
    cancelAnimationFrame(frame);
    frame = 0;
    if (!visible || !inView || document.hidden) return;
    if (paused) { draw(); return; }
    last = performance.now()-35;
    frame = requestAnimationFrame(animate);
  }
  function resize() {
    if (!visible) return;
    bounds = scene.getBoundingClientRect();
    if (bounds.width < 1 || bounds.height < 1) return;
    const anchor = Number(getComputedStyle(scene).getPropertyValue("--anchor-x")) || .5;
    renderer?.resize(bounds.width,bounds.height,anchor);
    draw();
  }
  function useImage() {
    try { renderer = stoneRenderer(canvas,image); } catch { renderer = null; }
    resize();
    run();
  }
  image.addEventListener("load",useImage,{once:true});
  canvas.addEventListener("webglcontextlost",event=>{
    event.preventDefault();
    renderer = null;
    canvas.classList.remove("ready");
    draw();
  });
  canvas.addEventListener("webglcontextrestored",useImage);
  image.src = image.dataset.src;

  function aim(event) {
    if (paused || event.target.closest(".mineral-dock, .browse-archive")) return;
    bounds = scene.getBoundingClientRect();
    target.x = Math.max(0,Math.min(1,(event.clientX-bounds.left)/bounds.width));
    target.y = Math.max(0,Math.min(1,(event.clientY-bounds.top)/bounds.height));
    target.strength = 1;
  }
  function ripple() {
    if (paused) return;
    wave.x = target.x;
    wave.y = target.y;
    wave.start = time;
    wave.strength = 1;
  }
  hero.addEventListener("pointermove",aim,{passive:true});
  hero.addEventListener("pointerleave",()=>{target.strength=0;});
  surface.addEventListener("pointerdown",event=>{aim(event);ripple();},{passive:true});
  surface.addEventListener("pointerup",event=>{if (event.pointerType==="touch") target.strength=0;},{passive:true});
  surface.addEventListener("pointercancel",()=>{target.strength=0;});
  surface.addEventListener("click",event=>{if (!event.detail) ripple();});
  surface.addEventListener("keydown",event=>{
    const direction = {ArrowLeft:[-.10,0],ArrowRight:[.10,0],ArrowUp:[0,-.12],ArrowDown:[0,.12]}[event.key];
    if (!direction || paused) return;
    event.preventDefault();
    target.x = Math.max(.10,Math.min(.92,target.x+direction[0]));
    target.y = Math.max(.10,Math.min(.90,target.y+direction[1]));
    target.strength = 1;
    ripple();
  });
  surface.addEventListener("blur",()=>{target.strength=0;});
  hero.querySelector(".material-choices").addEventListener("click",event=>{
    const button = event.target.closest("[data-stone]");
    if (!button) return;
    material = minerals.indexOf(button.dataset.stone);
    hero.dataset.mineral = minerals[material];
    hero.querySelector("#material-name").textContent = button.title;
    for (const item of hero.querySelectorAll("[data-stone]")) item.setAttribute("aria-pressed",String(item===button));
    if (paused) {weights.fill(0);weights[material]=1;draw();}
  });
  toggle.addEventListener("click",()=>{manualMotion=true;paused=!paused;updateMotion();run();});
  reduced.addEventListener("change",()=>{if(!manualMotion){paused=reduced.matches;updateMotion();run();}});
  new IntersectionObserver(([entry])=>{inView=entry.isIntersecting;run();}).observe(hero);
  new ResizeObserver(resize).observe(scene);
  document.addEventListener("visibilitychange",run);
  hero.querySelector("#browse-archive").addEventListener("click",()=>{
    const collection = document.querySelector(".collection");
    if (!collection) return;
    collection.focus({preventScroll:true});
    const browse = document.querySelector(".browse-mobile");
    const start = browse?.getClientRects().length ? browse : collection;
    start.scrollIntoView({behavior:reduced.matches?"instant":"smooth", block:"start"});
  });
  updateMotion();
  return () => { if (visible) resize(); run(); };
}
