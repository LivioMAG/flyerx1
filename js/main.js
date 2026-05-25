const slidesData = [
  {
    type: 'overview',
    title: 'Visual Estate',
    claim: 'Hochwertige Immobilienvisualisierungen für Architektur, Vermarktung und Verkauf.',
    text: 'Klare Leistungen, transparente Preisstruktur und professionelles Finishing für einen überzeugenden Marktauftritt.',
    cta: 'Projekt anfragen',
    ctaTarget: 'Anfrage',
    bg: 'overviewBg',
    services: [
      {
        group: 'Außenvisualisierungen',
        items: [{ name: 'Außenvisualisierung', price: 'ab CHF XXX' }]
      },
      {
        group: 'Innenvisualisierungen',
        items: [
          { name: '2D-Plan zu Raum', price: 'ab CHF XXX' },
          { name: 'Rendering veredeln', price: 'ab CHF XXX' },
          { name: 'Rohbau zu Innenraum', price: 'ab CHF XXX' }
        ]
      },
      {
        group: 'Virtual Stacking',
        items: [
          { name: 'Virtual Staging', price: 'ab CHF XXX' },
          { name: 'Möbel entfernen', price: 'ab CHF XXX' },
          { name: 'Virtuelle Renovation', price: 'ab CHF XXX' }
        ]
      }
    ],
    includeText: 'Inklusive kurzer Projektabstimmung, hochwertiger Ausarbeitung und finalem Ergebnisbild je Visualisierung.'
  },
  { title: 'Außenvisualisierung', text: 'Realistische Außenrenderings für Architektur, Vermarktung und Projektpräsentation.', bg: 'serviceExteriorResult', input: 'serviceExteriorSource', inputLabel: 'Kundenmaterial' },
  { title: '2D-Plan zu Raum', text: 'Aus Grundrissen entstehen realistische Innenräume mit Licht, Materialien und Atmosphäre.', bg: 'serviceInteriorPlanResult', input: 'serviceInteriorPlanSource', inputLabel: 'Input' },
  { title: 'Rendering veredeln', text: 'Bestehende 3D-Renderings werden zu fotorealistischen Bildern für Präsentation und Vermarktung.', bg: 'serviceInteriorRenderResult', input: 'serviceInteriorRenderSource', inputLabel: 'Input' },
  { title: 'Rohbau zu Innenraum', text: 'Unfertige Räume werden sichtbar – mit Böden, Wänden, Möbeln, Licht und Atmosphäre.', bg: 'serviceRawResult', input: 'serviceRawSource', inputLabel: 'Kundenmaterial' },
  { title: 'Virtual Staging', text: 'Leere Räume werden digital möbliert und verkaufsstark inszeniert.', bg: 'serviceStagingResult', input: 'serviceStagingSource', inputLabel: 'Input' },
  { title: 'Möbel entfernen', text: 'Überladene Räume werden neutralisiert und als klare, leere Flächen dargestellt.', bg: 'serviceRemoveResult', input: 'serviceRemoveSource', inputLabel: 'Input' },
  { title: 'Virtuelle Renovation', text: 'Renovationsideen werden sichtbar – mit neuen Materialien, Farben, Fliesen oder Ausstattung.', bg: 'serviceRenovationResult', input: 'serviceRenovationSource', inputLabel: 'Kundenmaterial' },
  { title: 'Anfrage', text: 'Senden Sie Ihr Material und wir liefern eine hochwertige Visualisierung für Ihr nächstes Projekt.', bg: 'contactSlideBg', input: 'contactSlideInput', inputLabel: 'Startpunkt' }
];

const navItems = [
  { label: 'Visual Estate', index: 0 },
  { label: 'Außenvisualisierungen', index: 1 },
  { label: 'Innenvisualisierungen', index: 2 },
  { label: 'Virtual Stacking', index: 5 }
];

let activeIndex = 0;
let deltaAccumulator = 0;
let isTransitioning = false;
let touchStartY = null;
const threshold = 120;

async function init() {
  const [texts, assets] = await Promise.all([
    fetch('text.json').then((r) => r.json()),
    fetch('assets.json').then((r) => r.json())
  ]);

  document.querySelectorAll('[data-text]').forEach((element) => {
    const key = element.dataset.text;
    if (texts[key]) element.textContent = texts[key];
  });

  renderNav();
  renderSlides(assets);
  updateCounter();
  updateActiveNav();
  bindInteractions();
}

function renderNav() {
  const nav = document.getElementById('topNav');
  nav.innerHTML = navItems
    .map((item) => `<button class="nav-btn" data-index="${item.index}">${item.label}</button>`)
    .join('');

  nav.querySelectorAll('.nav-btn').forEach((button) => {
    button.addEventListener('click', () => goTo(Number(button.dataset.index)));
  });
}

function renderSlides(assets) {
  const viewport = document.getElementById('slideViewport');
  viewport.innerHTML = slidesData.map((slide, index) => {
    if (slide.type === 'overview') {
      return `
        <article class="slide slide-overview ${index === 0 ? 'is-active' : ''}" data-index="${index}">
          <img class="bg" src="${assets[slide.bg]}" alt="${slide.title}" />
          <div class="overlay"></div>
          <div class="overview-content">
            <h1 class="overview-title">${slide.title}</h1>
            <p class="overview-claim">${slide.claim}</p>
            <p class="overview-desc">${slide.text}</p>
            <div class="price-grid">
              ${slide.services.map((group) => `
                <section class="price-group">
                  <h2>${group.group}</h2>
                  ${group.items.map((item) => `<div class="price-item"><span>${item.name}</span><strong>${item.price}</strong></div>`).join('')}
                </section>
              `).join('')}
            </div>
            <p class="include-note">${slide.includeText}</p>
            <button class="cta-link" data-target-title="${slide.ctaTarget}">${slide.cta}</button>
          </div>
        </article>
      `;
    }

    return `
      <article class="slide ${index === 0 ? 'is-active' : ''}" data-index="${index}">
        <img class="bg" src="${assets[slide.bg]}" alt="${slide.title}" />
        <div class="overlay"></div>
        <h1 class="title">${slide.title}</h1>
        <p class="desc">${slide.text}</p>
        <figure class="input-wrap">
          <img src="${assets[slide.input]}" alt="${slide.inputLabel}" />
          <span>${slide.inputLabel}</span>
        </figure>
      </article>
    `;
  }).join('');

  const cta = viewport.querySelector('.cta-link');
  if (cta) cta.addEventListener('click', () => goTo(slidesData.findIndex((slide) => slide.title === 'Anfrage')));
}

function bindInteractions() {
  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('touchstart', (e) => { touchStartY = e.touches[0].clientY; }, { passive: true });
  window.addEventListener('touchmove', onTouchMove, { passive: false });
}

function onWheel(event) {
  event.preventDefault();
  if (isTransitioning) return;
  deltaAccumulator += event.deltaY;
  if (Math.abs(deltaAccumulator) < threshold) return;
  goTo(activeIndex + (deltaAccumulator > 0 ? 1 : -1));
  deltaAccumulator = 0;
}

function onTouchMove(event) {
  if (touchStartY === null || isTransitioning) return;
  const delta = touchStartY - event.touches[0].clientY;
  if (Math.abs(delta) < 45) return;
  event.preventDefault();
  goTo(activeIndex + (delta > 0 ? 1 : -1));
  touchStartY = null;
}

function onKeyDown(event) {
  if (isTransitioning) return;
  if (event.key === 'ArrowDown') goTo(activeIndex + 1);
  if (event.key === 'ArrowUp') goTo(activeIndex - 1);
}

function goTo(index) {
  if (index < 0 || index >= slidesData.length || index === activeIndex) return;
  const slides = [...document.querySelectorAll('.slide')];
  isTransitioning = true;
  slides[activeIndex].classList.remove('is-active');
  slides[index].classList.add('is-active');
  activeIndex = index;
  updateCounter();
  updateActiveNav();
  setTimeout(() => { isTransitioning = false; }, 900);
}

function updateActiveNav() {
  const nav = document.querySelectorAll('.nav-btn');
  let groupIndex = 0;
  if (activeIndex >= 5 && activeIndex <= 7) groupIndex = 3;
  else if (activeIndex >= 2 && activeIndex <= 4) groupIndex = 2;
  else if (activeIndex === 1) groupIndex = 1;

  nav.forEach((btn, idx) => btn.classList.toggle('is-active', idx === groupIndex));
}

function updateCounter() {
  const current = String(activeIndex + 1).padStart(2, '0');
  const total = String(slidesData.length).padStart(2, '0');
  document.getElementById('slideCounter').textContent = `${current} / ${total}`;
}

init();
