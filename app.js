const state = {
  progress: 0,
  targetProgress: 0,
  reduceMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  rafId: null,
  config: {}
};

const SCENES = [
  {
    range: [0.0, 0.2],
    eyebrow: 'Interior Visualisierung',
    headline: 'Innenräume sichtbar machen. In 4 Stunden.',
    description:
      'Laden Sie Ihr Ausgangsbild hoch. Wir erstellen daraus eine hochwertige Visualisierung — bezahlt wird erst, wenn das Ergebnis überzeugt.',
    primaryCta: 'Projekt starten',
    secondaryCta: ''
  },
  {
    range: [0.2, 0.4],
    eyebrow: 'Workflow',
    headline: '1. Bild hochladen',
    description:
      'Sie laden Ihr Ausgangsbild, Ihren Grundriss oder ein 2D-Rendering über die Plattform hoch.',
    primaryCta: 'Projekt starten',
    secondaryCta: ''
  },
  {
    range: [0.4, 0.6],
    eyebrow: 'Workflow',
    headline: '2. Raumidee entwickeln',
    description:
      'Aus der Vorlage entsteht eine konzeptionelle Interpretation mit Stimmung, Materialität, Licht und Raumgefühl.',
    primaryCta: 'Projekt starten',
    secondaryCta: ''
  },
  {
    range: [0.6, 0.8],
    eyebrow: 'Workflow',
    headline: '3. Visualisierung erhalten',
    description:
      'Innerhalb von 4 Stunden erhalten Sie das fertige Rendering — bereit für Präsentation, Verkauf, Vermietung oder Entscheidungsfindung.',
    primaryCta: 'Projekt starten',
    secondaryCta: ''
  },
  {
    range: [0.8, 1.0],
    eyebrow: 'Qualitätsversprechen',
    headline: 'Zahlen Sie erst, wenn es überzeugt.',
    description: 'Sie erhalten zuerst das Ergebnis. Erst wenn Sie zufrieden sind, wird bezahlt.',
    primaryCta: 'Erstes Projekt starten',
    secondaryCta: 'Onboarding anfragen'
  }
];

const els = {
  scrollRoot: document.getElementById('documentScroll'),
  page: document.getElementById('a4Page'),
  eyebrow: document.getElementById('sceneEyebrow'),
  headline: document.getElementById('sceneHeadline'),
  description: document.getElementById('sceneDescription'),
  microUi: document.getElementById('sceneMicroUi'),
  sceneList: document.getElementById('sceneList'),
  ctas: document.getElementById('sceneCtas'),
  ctaPrimary: document.getElementById('ctaPrimary'),
  ctaSecondary: document.getElementById('ctaSecondary'),
  pills: Array.from(document.querySelectorAll('.workflow-pill')),
  layers: {
    hero: document.querySelector('[data-layer="hero"]'),
    source: document.querySelector('[data-layer="source"]'),
    abstract: document.querySelector('[data-layer="abstract"]'),
    render: document.querySelector('[data-layer="render"]')
  },
  images: Array.from(document.querySelectorAll('[data-image-key]'))
};

init();

async function init() {
  state.config = await loadConfig();
  await hydrateImages(state.config);

  if (state.reduceMotion) {
    state.progress = getScrollProgress();
    render(state.progress);
    window.addEventListener('scroll', () => render(getScrollProgress()), { passive: true });
    return;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();
  animate();
}

function onScroll() {
  state.targetProgress = getScrollProgress();
}

function animate() {
  state.progress = lerp(state.progress, state.targetProgress, 0.12);
  if (Math.abs(state.progress - state.targetProgress) < 0.0005) {
    state.progress = state.targetProgress;
  }
  render(state.progress);
  state.rafId = requestAnimationFrame(animate);
}

function render(progress) {
  const p = clamp(progress, 0, 1);
  const sceneIndex = getSceneIndex(p);
  const scene = SCENES[sceneIndex];

  els.eyebrow.textContent = scene.eyebrow;
  els.headline.textContent = scene.headline;
  els.description.textContent = scene.description;
  els.ctaPrimary.textContent = scene.primaryCta;

  const showSecond = Boolean(scene.secondaryCta);
  els.ctaSecondary.textContent = scene.secondaryCta || '';
  els.ctaSecondary.style.display = showSecond ? 'inline-flex' : 'none';

  els.microUi.style.opacity = sceneIndex === 1 ? '1' : '0';
  els.sceneList.style.opacity = sceneIndex === 4 ? '1' : '0';

  const textLift = 18 - p * 24;
  els.eyebrow.style.transform = `translateY(${textLift * 0.3}px)`;
  els.headline.style.transform = `translateY(${textLift * 0.5}px)`;
  els.description.style.transform = `translateY(${textLift * 0.7}px)`;
  els.sceneList.style.transform = `translateY(${14 - p * 10}px)`;

  const p12 = smoothWindow(p, 0.2, 0.6);
  const p23 = smoothWindow(p, 0.4, 0.8);
  const p34 = smoothWindow(p, 0.6, 1.0);

  paintLayer(els.layers.hero, {
    opacity: 1 - smoothWindow(p, 0.12, 0.35),
    scale: 1.03 - p * 0.06,
    y: -8 + p * 8,
    blur: smoothWindow(p, 0.16, 0.36) * 6,
    rotate: -1 + p * 0.8
  });

  paintLayer(els.layers.source, {
    opacity: clamp(0.3 + (1 - p23) * 0.8, 0, 1),
    scale: 1.02 - p12 * 0.06,
    y: 38 - p12 * 42,
    blur: p23 * 5,
    rotate: 1 - p12
  });

  paintLayer(els.layers.abstract, {
    opacity: smoothWindow(p, 0.38, 0.68),
    scale: 1.06 - p23 * 0.09,
    y: 16 - p23 * 24,
    blur: (1 - smoothWindow(p, 0.46, 0.62)) * 8,
    rotate: -0.8 + p23 * 1.1
  });

  paintLayer(els.layers.render, {
    opacity: smoothWindow(p, 0.58, 0.84) * 0.95,
    scale: 1.12 - p34 * 0.15,
    y: 24 - p34 * 30,
    blur: (1 - smoothWindow(p, 0.62, 0.8)) * 10,
    rotate: 1.2 - p34 * 1.4
  });

  updateWorkflow(sceneIndex);
}

function paintLayer(el, { opacity, scale, y, blur, rotate }) {
  if (!el) return;
  el.style.opacity = String(clamp(opacity, 0, 1));
  el.style.transform = `translate3d(0, ${y}px, 0) scale(${scale}) rotate(${rotate}deg)`;
  el.style.filter = `blur(${Math.max(0, blur)}px) saturate(1.02)`;
}

function updateWorkflow(sceneIndex) {
  const activeStep = sceneIndex === 0 ? 0 : Math.min(sceneIndex, 3);
  els.pills.forEach((pill, i) => pill.classList.toggle('is-active', i === activeStep));
}

function getSceneIndex(progress) {
  return SCENES.findIndex((scene) => progress >= scene.range[0] && progress <= scene.range[1]) || 0;
}

function getScrollProgress() {
  const rect = els.scrollRoot.getBoundingClientRect();
  const total = rect.height - window.innerHeight;
  return clamp(-rect.top / Math.max(total, 1), 0, 1);
}

async function loadConfig() {
  try {
    const response = await fetch('./config.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('config.json konnte nicht geladen werden');
    return response.json();
  } catch {
    return {};
  }
}

async function hydrateImages(config) {
  const tasks = els.images.map(async (imgEl) => {
    const key = imgEl.dataset.imageKey;
    const src = config[key];
    if (!src) {
      imgEl.src = createPlaceholder(key);
      return;
    }
    try {
      await preload(src);
      imgEl.src = src;
    } catch {
      imgEl.src = createPlaceholder(key);
    }
  });
  await Promise.all(tasks);
}

function createPlaceholder(label) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 1600'>
    <defs>
      <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0%' stop-color='#f6f8ff'/>
        <stop offset='100%' stop-color='#ebf2ff'/>
      </linearGradient>
    </defs>
    <rect width='1200' height='1600' fill='url(#g)'/>
    <text x='50%' y='48%' font-size='56' text-anchor='middle' fill='#5f77a0' font-family='Inter, Arial'>Pastell-Platzhalter</text>
    <text x='50%' y='54%' font-size='38' text-anchor='middle' fill='#6e84aa' font-family='Inter, Arial'>${label}</text>
  </svg>`)}`;
}

function preload(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = resolve;
    img.onerror = reject;
    img.src = src;
  });
}

function clamp(v, min, max) {
  return Math.min(Math.max(v, min), max);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function mapRange(v, inMin, inMax, outMin, outMax) {
  const t = clamp((v - inMin) / (inMax - inMin), 0, 1);
  return outMin + (outMax - outMin) * t;
}

function smoothWindow(value, start, end) {
  const x = mapRange(value, start, end, 0, 1);
  return x * x * (3 - 2 * x);
}
