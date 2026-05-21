const state = {
  reduceMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  current: 0,
  target: 0,
  config: {}
};

const scenesTimeline = [
  { key: 'service', holdStart: 0.00, holdEnd: 0.12, outStart: 0.12, outEnd: 0.22, target: 0.04 },
  { key: 'platform', inStart: 0.12, inEnd: 0.22, holdStart: 0.22, holdEnd: 0.34, outStart: 0.34, outEnd: 0.44, target: 0.26 },
  { key: 'input', inStart: 0.34, inEnd: 0.44, holdStart: 0.44, holdEnd: 0.56, outStart: 0.56, outEnd: 0.66, target: 0.48 },
  { key: 'results', inStart: 0.56, inEnd: 0.66, holdStart: 0.66, holdEnd: 0.78, outStart: 0.78, outEnd: 0.88, target: 0.70 },
  { key: 'booking', inStart: 0.78, inEnd: 0.88, holdStart: 0.88, holdEnd: 1.00, target: 0.92 }
];

const els = {
  scrollRoot: document.getElementById('documentScroll'),
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
  render(0);

  if (state.reduceMotion) {
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
  state.current = lerp(state.current, state.target, 0.1);
  if (Math.abs(state.current - state.target) < 0.0004) state.current = state.target;
  render(state.current);
  requestAnimationFrame(tick);
}

function render(progress) {
  const p = clamp(progress, 0, 1);

  els.scenes.forEach((sceneEl, index) => {
    const style = computeSceneStyles(p, index);
    sceneEl.style.setProperty('--scene-opacity', style.sceneOpacity.toFixed(4));
    sceneEl.style.setProperty('--scene-y', `${style.sceneTranslateY.toFixed(2)}px`);
    sceneEl.style.setProperty('--scene-scale', style.sceneScale.toFixed(4));
    sceneEl.style.setProperty('--scene-blur', `${style.sceneBlur.toFixed(2)}px`);
    sceneEl.style.setProperty('--visual-shift-y', `${style.visualTranslateY.toFixed(2)}px`);
    sceneEl.style.setProperty('--visual-shift-x', `${style.visualTranslateX.toFixed(2)}px`);
    sceneEl.style.setProperty('--visual-scale', style.visualScale.toFixed(4));
    sceneEl.style.setProperty('--visual-opacity', style.visualOpacity.toFixed(4));
    sceneEl.classList.toggle('is-active', style.sceneOpacity > 0.5);
  });

  updateResultsBlend(p);
  updateGlow(p);
  updatePills(p);
}

function computeSceneStyles(progress, sceneIndex) {
  const scene = scenesTimeline[sceneIndex];
  const holdBreath = mapRange(progress, scene.holdStart, scene.holdEnd, -1, 1);

  const base = {
    sceneOpacity: 0,
    sceneTranslateY: 40,
    sceneScale: 0.975,
    sceneBlur: 16,
    visualTranslateY: 12,
    visualTranslateX: 0,
    visualScale: 0.99,
    visualOpacity: 0
  };

  if (sceneIndex === 0 && progress <= scene.holdEnd) {
    return {
      sceneOpacity: 1,
      sceneTranslateY: 0,
      sceneScale: 1,
      sceneBlur: 0,
      visualTranslateY: holdBreath * 4,
      visualTranslateX: holdBreath * 1.2,
      visualScale: 1,
      visualOpacity: 1
    };
  }

  if (progress >= scene.holdStart && progress <= scene.holdEnd) {
    return {
      sceneOpacity: 1,
      sceneTranslateY: 0,
      sceneScale: 1,
      sceneBlur: 0,
      visualTranslateY: holdBreath * 4,
      visualTranslateX: holdBreath * 1.2,
      visualScale: 1,
      visualOpacity: 1
    };
  }

  if (scene.inStart != null && progress >= scene.inStart && progress < scene.inEnd) {
    const t = smoothstep(0, 1, mapRange(progress, scene.inStart, scene.inEnd, 0, 1));
    const visualT = smoothstep(0, 1, mapRange(progress, scene.inStart + (scene.inEnd - scene.inStart) * 0.12, scene.inEnd, 0, 1));
    return {
      sceneOpacity: lerp(0, 1, t),
      sceneTranslateY: lerp(40, 0, t),
      sceneScale: lerp(0.975, 1, t),
      sceneBlur: lerp(16, 0, t),
      visualTranslateY: lerp(26, 0, visualT),
      visualTranslateX: lerp(-8, 0, visualT),
      visualScale: lerp(0.985, 1, visualT),
      visualOpacity: lerp(0.75, 1, visualT)
    };
  }

  if (scene.outStart != null && progress > scene.outStart && progress <= scene.outEnd) {
    const t = smoothstep(0, 1, mapRange(progress, scene.outStart, scene.outEnd, 0, 1));
    const visualT = smoothstep(0, 1, mapRange(progress, scene.outStart, scene.outEnd - (scene.outEnd - scene.outStart) * 0.12, 0, 1));
    return {
      sceneOpacity: lerp(1, 0, t),
      sceneTranslateY: lerp(0, -24, t),
      sceneScale: lerp(1, 0.985, t),
      sceneBlur: lerp(0, 10, t),
      visualTranslateY: lerp(0, -10, visualT),
      visualTranslateX: lerp(0, 6, visualT),
      visualScale: lerp(1, 0.988, visualT),
      visualOpacity: lerp(1, 0.8, visualT)
    };
  }

  if (sceneIndex === scenesTimeline.length - 1 && progress >= scene.holdStart) {
    return {
      sceneOpacity: 1,
      sceneTranslateY: 0,
      sceneScale: 1,
      sceneBlur: 0,
      visualTranslateY: holdBreath * 4,
      visualTranslateX: holdBreath * 1.2,
      visualScale: 1,
      visualOpacity: 1
    };
  }

  return base;
}

function updateResultsBlend(progress) {
  const local = clamp(mapRange(progress, 0.66, 0.88, 0, 1), 0, 1);
  const concept = document.querySelector('.concept-card');
  const realistic = document.querySelector('.realistic-card');
  if (!concept || !realistic) return;

  concept.style.opacity = String(lerp(1, 0.78, local));
  realistic.style.opacity = String(lerp(0.72, 1, local));
  concept.style.transform = `translateY(${lerp(0, -10, local)}px) rotate(${lerp(-2, -1, local)}deg)`;
  realistic.style.transform = `translateY(${lerp(14, 0, local)}px) rotate(${lerp(3, 1.2, local)}deg)`;
}

function updateGlow(progress) {
  const sceneIndex = getActiveSceneIndex(progress);
  const scene = scenesTimeline[sceneIndex];
  const holdStrength = clamp(mapRange(progress, scene.holdStart, scene.holdEnd, 0, 1), 0, 1);
  const transitionStrength = getTransitionStrength(progress);

  const hue = lerp(0, 22, progress) + lerp(-1.5, 1.5, holdStrength) + transitionStrength * 4;
  const sat = lerp(100, 112, progress) + transitionStrength * 8;
  const brightness = 1 + transitionStrength * 0.06;
  els.glow.style.filter = `blur(42px) hue-rotate(${hue.toFixed(2)}deg) saturate(${sat.toFixed(1)}%) brightness(${brightness.toFixed(3)})`;
}

function getTransitionStrength(progress) {
  for (const scene of scenesTimeline) {
    if (scene.outStart != null && progress >= scene.outStart && progress <= scene.outEnd) {
      return smoothstep(0, 1, mapRange(progress, scene.outStart, scene.outEnd, 0, 1));
    }
  }
  return 0;
}

function updatePills(progress) {
  const active = getActiveSceneIndex(progress);
  els.progressButtons.forEach((btn, idx) => btn.classList.toggle('is-active', idx === active));
}

function getActiveSceneIndex(progress) {
  for (let i = 0; i < scenesTimeline.length - 1; i++) {
    const scene = scenesTimeline[i];
    if (progress >= scene.holdStart && progress <= scene.holdEnd) return i;
    if (scene.outStart != null && progress > scene.outStart && progress < scene.outEnd) {
      const t = mapRange(progress, scene.outStart, scene.outEnd, 0, 1);
      return t < 0.5 ? i : i + 1;
    }
  }
  return scenesTimeline.length - 1;
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
      } catch {}
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
