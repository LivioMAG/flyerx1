const state = {
  reduceMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  current: 0,
  target: 0,
  config: {}
};

const SCENES = [
  { start: 0.0, end: 0.2 },
  { start: 0.2, end: 0.4 },
  { start: 0.4, end: 0.6 },
  { start: 0.6, end: 0.8 },
  { start: 0.8, end: 1.0 }
];

const els = {
  scrollRoot: document.getElementById('documentScroll'),
  page: document.getElementById('a4Page'),
  glow: document.getElementById('a4BackgroundGlow'),
  scenes: Array.from(document.querySelectorAll('.scene')),
  progressButtons: Array.from(document.querySelectorAll('.scene-progress button')),
  images: Array.from(document.querySelectorAll('img[data-config-image]'))
};

init();

async function init() {
  state.config = await loadConfig();
  await hydrateImages();
  bindProgressNav();

  if (state.reduceMotion) {
    render(getScrollProgress());
    window.addEventListener('scroll', () => render(getScrollProgress()), { passive: true });
    return;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();
  requestAnimationFrame(tick);
}

function onScroll() {
  state.target = getScrollProgress();
}

function tick() {
  state.current = lerp(state.current, state.target, 0.12);
  if (Math.abs(state.current - state.target) < 0.0004) state.current = state.target;
  render(state.current);
  requestAnimationFrame(tick);
}

function render(progress) {
  const p = clamp(progress, 0, 1);

  els.scenes.forEach((sceneEl, index) => {
    const local = sceneProgress(p, index);
    const focus = smoothstep(0, 1, local);
    const distance = Math.abs((index + 0.5) / 5 - p);
    const opacity = clamp(1 - distance * 5.2, 0, 1);
    const y = lerp(28, -8, focus);
    const scale = lerp(0.975, 1, focus);
    const blur = lerp(10, 0, focus);

    sceneEl.style.setProperty('--scene-opacity', opacity.toFixed(4));
    sceneEl.style.setProperty('--scene-y', `${y.toFixed(2)}px`);
    sceneEl.style.setProperty('--scene-scale', scale.toFixed(4));
    sceneEl.style.setProperty('--scene-blur', `${blur.toFixed(2)}px`);
    sceneEl.style.setProperty('--visual-shift-y', `${lerp(26, 0, focus).toFixed(2)}px`);
    sceneEl.style.setProperty('--visual-shift-x', `${lerp(-12, 0, focus).toFixed(2)}px`);
  });

  updateResultsBlend(p);
  updateGlow(p);
  updatePills(p);
}

function updateResultsBlend(progress) {
  const local = sceneProgress(progress, 3);
  const concept = document.querySelector('.concept-card');
  const realistic = document.querySelector('.realistic-card');
  if (!concept || !realistic) return;

  concept.style.opacity = String(lerp(1, 0.75, local));
  realistic.style.opacity = String(lerp(0.7, 1, local));
  concept.style.transform = `translateY(${lerp(0, -12, local)}px) rotate(${lerp(-2, -1, local)}deg)`;
  realistic.style.transform = `translateY(${lerp(16, 0, local)}px) rotate(${lerp(3, 1.2, local)}deg)`;
}

function updateGlow(progress) {
  const hue = lerp(0, 26, progress);
  const sat = lerp(100, 112, progress);
  els.glow.style.filter = `blur(42px) hue-rotate(${hue.toFixed(2)}deg) saturate(${sat.toFixed(1)}%)`;
}

function updatePills(progress) {
  const active = clamp(Math.floor(progress * 5), 0, 4);
  els.progressButtons.forEach((btn, idx) => btn.classList.toggle('is-active', idx === active));
}

function bindProgressNav() {
  els.progressButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetProgress = Number(btn.dataset.progressTarget ?? 0);
      const rect = els.scrollRoot.getBoundingClientRect();
      const absoluteTop = window.scrollY + rect.top;
      const maxScroll = Math.max(els.scrollRoot.offsetHeight - window.innerHeight, 1);
      window.scrollTo({ top: absoluteTop + maxScroll * clamp(targetProgress, 0, 1), behavior: state.reduceMotion ? 'auto' : 'smooth' });
    });
  });
}

async function loadConfig() {
  try {
    const response = await fetch('./config.json', { cache: 'no-store' });
    if (!response.ok) throw new Error();
    return await response.json();
  } catch {
    return {};
  }
}

async function hydrateImages() {
  const tasks = els.images.map(async (img) => {
    const primaryKey = img.dataset.configImage;
    const fallbackKey = img.dataset.fallbackKey;
    const candidates = [primaryKey, fallbackKey].map((k) => state.config[k]).filter(Boolean);

    for (const src of candidates) {
      try {
        await preload(src);
        img.src = src;
        markFallback(img, false);
        return;
      } catch {
        // noop
      }
    }

    img.src = placeholderSvg(primaryKey || 'image');
    markFallback(img, true);
  });

  await Promise.all(tasks);
}

function markFallback(img, isFallback) {
  const visual = img.closest('.scene-visual');
  if (!visual) return;
  visual.querySelectorAll('[data-fallback]').forEach((el) => {
    const key = el.getAttribute('data-fallback');
    el.style.display = isFallback && (!key || key === img.dataset.configImage) ? 'grid' : 'none';
  });
}

function placeholderSvg(label) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 1600'>
    <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0%' stop-color='#eef4ff'/><stop offset='100%' stop-color='#f4ecff'/>
    </linearGradient></defs>
    <rect width='1200' height='1600' fill='url(#g)'/>
    <text x='50%' y='48%' font-size='56' text-anchor='middle' fill='#556b93' font-family='Inter, Arial'>Pastell-Platzhalter</text>
    <text x='50%' y='54%' font-size='36' text-anchor='middle' fill='#7288af' font-family='Inter, Arial'>${label}</text>
  </svg>`)}`;
}

function preload(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = resolve;
    image.onerror = reject;
    image.src = src;
  });
}

function sceneProgress(progress, sceneIndex) {
  const { start, end } = SCENES[sceneIndex];
  return clamp(mapRange(progress, start, end, 0, 1), 0, 1);
}

function getScrollProgress() {
  const rect = els.scrollRoot.getBoundingClientRect();
  const total = rect.height - window.innerHeight;
  return clamp(-rect.top / Math.max(total, 1), 0, 1);
}

function clamp(v, min, max) { return Math.min(Math.max(v, min), max); }
function lerp(a, b, t) { return a + (b - a) * t; }
function mapRange(v, inMin, inMax, outMin, outMax) {
  const t = clamp((v - inMin) / Math.max(inMax - inMin, Number.EPSILON), 0, 1);
  return outMin + (outMax - outMin) * t;
}
function smoothstep(edge0, edge1, x) {
  const t = clamp((x - edge0) / Math.max(edge1 - edge0, Number.EPSILON), 0, 1);
  return t * t * (3 - 2 * t);
}
