const serviceRouteMap = {
  'Außenvisualisierung': 1,
  '2D-Plan zu Raum': 2,
  'Rendering veredeln': 3,
  'Rohbau zu Innenraum': 4,
  'Virtual Staging': 5,
  'Möbel entfernen': 6,
  'Virtuelle Renovation': 7
};

const serviceIcons = {
  'Außenvisualisierung': '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 20h18M5 20V9l7-5 7 5v11M9 20v-5h6v5"/></svg>',
  '2D-Plan zu Raum': '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v16H4zM9 4v16M4 11h16M14 11v9"/></svg>',
  'Rendering veredeln': '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.4l-5.5 2.8 1-6.2L3 9.6l6.2-.9z"/></svg>',
  'Rohbau zu Innenraum': '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12l9-8 9 8M5 10v10h14V10M9 20v-6h6v6"/></svg>',
  'Virtual Staging': '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16v10H4zM8 17v3M16 17v3M8 11h8"/></svg>',
  'Möbel entfernen': '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16v10H4zM3 3l18 18M8 17v3M16 17v3"/></svg>',
  'Virtuelle Renovation': '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4l6 6-8.5 8.5H5.5V13zM12 6l6 6"/></svg>'
};

const slidesData = [
  {
    type: 'overview',
    title: 'Visual Estate',
    claim: 'Hochwertige Immobilienvisualisierungen für Architektur, Vermarktung und Verkauf.',
    promise: 'Alle Visualisierungen, die Sie bis 15:00 Uhr anfragen, erhalten Sie am nächsten Arbeitstag um 7:00 Uhr.',
    bg: 'overviewBg',
    services: [
      { name: 'Außenvisualisierung', category: 'Außenvisualisierungen', price: 'ab CHF XXX' },
      { name: '2D-Plan zu Raum', category: 'Innenvisualisierungen', price: 'ab CHF XXX' },
      { name: 'Rendering veredeln', category: 'Innenvisualisierungen', price: 'ab CHF XXX' },
      { name: 'Rohbau zu Innenraum', category: 'Innenvisualisierungen', price: 'ab CHF XXX' },
      { name: 'Virtual Staging', category: 'Virtual Stacking', price: 'ab CHF XXX' },
      { name: 'Möbel entfernen', category: 'Virtual Stacking', price: 'ab CHF XXX' },
      { name: 'Virtuelle Renovation', category: 'Virtual Stacking', price: 'ab CHF XXX' }
    ]
  },
  { title: 'Außenvisualisierung', text: 'Realistische Außenrenderings für Architektur, Vermarktung und Projektpräsentation.', bg: 'serviceExteriorResult', input: 'serviceExteriorSource', inputLabel: 'Kundenmaterial' },
  { title: '2D-Plan zu Raum', text: 'Aus Grundrissen entstehen realistische Innenräume mit Licht, Materialien und Atmosphäre.', bg: 'serviceInteriorPlanResult', input: 'serviceInteriorPlanSource', inputLabel: 'Input' },
  { title: 'Rendering veredeln', text: 'Bestehende 3D-Renderings werden zu fotorealistischen Bildern für Präsentation und Vermarktung.', bg: 'serviceInteriorRenderResult', input: 'serviceInteriorRenderSource', inputLabel: 'Input' },
  { title: 'Rohbau zu Innenraum', text: 'Unfertige Räume werden sichtbar – mit Böden, Wänden, Möbeln, Licht und Atmosphäre.', bg: 'serviceRawResult', input: 'serviceRawSource', inputLabel: 'Kundenmaterial' },
  { title: 'Virtual Staging', text: 'Leere Räume werden digital möbliert und verkaufsstark inszeniert.', bg: 'serviceStagingResult', input: 'serviceStagingSource', inputLabel: 'Input' },
  { title: 'Möbel entfernen', text: 'Überladene Räume werden neutralisiert und als klare, leere Flächen dargestellt.', bg: 'serviceRemoveResult', input: 'serviceRemoveSource', inputLabel: 'Input' },
  { title: 'Virtuelle Renovation', text: 'Renovationsideen werden sichtbar – mit neuen Materialien, Farben, Fliesen oder Ausstattung.', bg: 'serviceRenovationResult', input: 'serviceRenovationSource', inputLabel: 'Kundenmaterial' },
  { type: 'contact', title: 'Anfrage', text: 'Erzählen Sie uns kurz, was Sie visualisieren möchten.', bg: 'contactSlideBg' }
];

const navItems = [
  { label: 'Visual Estate', index: 0 },
  { label: 'Außenvisualisierungen', index: 1 },
  { label: 'Innenvisualisierungen', index: 2 },
  { label: 'Virtual Stacking', index: 5 },
  { label: 'Anfrage', index: 8 }
];
const serviceOptions = Object.keys(serviceRouteMap);
let activeIndex = 0; let deltaAccumulator = 0; let isTransitioning = false; let touchStartY = null;
const threshold = 120;

async function init() { const [texts, assets] = await Promise.all([fetch('text.json').then((r) => r.json()), fetch('assets.json').then((r) => r.json())]);
  document.querySelectorAll('[data-text]').forEach((e) => { const k = e.dataset.text; if (texts[k]) e.textContent = texts[k]; });
  renderNav(); renderSlides(assets, texts); updateCounter(); updateActiveNav(); bindInteractions(); bindInquiryForm(texts); }

function renderNav() { const nav = document.getElementById('topNav'); nav.innerHTML = navItems.map((item) => `<button class="nav-btn" data-index="${item.index}">${item.label}</button>`).join(''); nav.querySelectorAll('.nav-btn').forEach((b) => b.addEventListener('click', () => goTo(Number(b.dataset.index)))); }

function renderSlides(assets, texts) {
  const viewport = document.getElementById('slideViewport');
  viewport.innerHTML = slidesData.map((slide, index) => {
    if (slide.type === 'overview') {
      return `<article class="slide slide-overview ${index === 0 ? 'is-active' : ''}" data-index="${index}"><img class="bg" src="${assets[slide.bg]}" alt="${slide.title}" /><div class="overlay"></div><div class="overview-content"><div class="overview-brand"><h1 class="overview-title">${slide.title}</h1><p class="overview-claim">${slide.claim}</p><p class="service-promise">${slide.promise}</p></div><div class="overview-list" role="list">${slide.services.map((item) => `<button class="service-item" data-target="${serviceRouteMap[item.name]}" role="listitem"><span class="service-item-icon">${serviceIcons[item.name] || ''}</span><span class="service-item-copy"><span class="service-item-title">${item.name}</span><span class="service-item-meta">${item.category}</span></span><strong>${item.price}</strong></button>`).join('')}</div></div></article>`;
    }
    if (slide.type === 'contact') {
      return `<article class="slide slide-contact" data-index="${index}"><img class="bg" src="${assets[slide.bg]}" alt="${slide.title}" /><div class="overlay"></div><section class="contact-content"><h1 class="service-title">${slide.title}</h1><p class="service-subtext">${slide.text}</p><form id="inquiryForm" class="inquiry-form" novalidate><label><span>${texts.formNameShort || 'Name oder Vorname'}</span><input name="name" type="text" autocomplete="name" required /></label><label><span>${texts.formEmailShort || 'E-Mail'}</span><input name="email" type="email" autocomplete="email" required /></label><label><span>${texts.formServiceShort || 'Interesse / Dienstleistung'}</span><select name="service" required><option value="">Bitte auswählen</option>${serviceOptions.map((option) => `<option value="${option}">${option}</option>`).join('')}</select></label><label><span>${texts.formMessageShort || 'Nachricht (optional)'}</span><textarea name="message" rows="3"></textarea></label><button type="submit">${texts.formSubmit || 'Anfrage senden'}</button><p class="form-feedback" id="formFeedback" role="status" aria-live="polite"></p></form></section></article>`;
    }
    return `<article class="slide" data-index="${index}"><img class="bg" src="${assets[slide.bg]}" alt="${slide.title}" /><div class="overlay"></div><div class="service-copy"><h1 class="service-title">${slide.title}</h1><p class="service-subtext">${slide.text}</p></div><figure class="input-wrap"><img src="${assets[slide.input]}" alt="${slide.inputLabel}" /><span>${slide.inputLabel}</span></figure></article>`;
  }).join('');
  viewport.querySelectorAll('.service-item').forEach((item) => item.addEventListener('click', () => goTo(Number(item.dataset.target))));
}

function bindInquiryForm(texts) { const form = document.getElementById('inquiryForm'); const feedback = document.getElementById('formFeedback'); if (!form || !feedback) return; form.addEventListener('submit', (event) => { event.preventDefault(); const name = form.elements.name.value.trim(); const email = form.elements.email.value.trim(); const service = form.elements.service.value.trim(); const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); if (!name || !validEmail || !service) { feedback.textContent = texts.formError || 'Bitte Name, gültige E-Mail und Dienstleistung ausfüllen.'; feedback.classList.remove('is-success'); return; } feedback.textContent = texts.contactSuccess || 'Danke, wir melden uns zeitnah mit den nächsten Schritten.'; feedback.classList.add('is-success'); form.reset(); }); }
function bindInteractions() { window.addEventListener('wheel', onWheel, { passive: false }); window.addEventListener('keydown', onKeyDown); window.addEventListener('touchstart', (e) => { touchStartY = e.touches[0].clientY; }, { passive: true }); window.addEventListener('touchmove', onTouchMove, { passive: false }); }
function onWheel(event) { event.preventDefault(); if (isTransitioning) return; deltaAccumulator += event.deltaY; if (Math.abs(deltaAccumulator) < threshold) return; goTo(activeIndex + (deltaAccumulator > 0 ? 1 : -1)); deltaAccumulator = 0; }
function onTouchMove(event) { if (touchStartY === null || isTransitioning) return; const delta = touchStartY - event.touches[0].clientY; if (Math.abs(delta) < 45) return; event.preventDefault(); goTo(activeIndex + (delta > 0 ? 1 : -1)); touchStartY = null; }
function onKeyDown(event) { if (isTransitioning) return; if (event.key === 'ArrowDown') goTo(activeIndex + 1); if (event.key === 'ArrowUp') goTo(activeIndex - 1); }
function goTo(index) { if (index < 0 || index >= slidesData.length || index === activeIndex) return; const slides = [...document.querySelectorAll('.slide')]; isTransitioning = true; slides[activeIndex].classList.remove('is-active'); slides[index].classList.add('is-active'); activeIndex = index; updateCounter(); updateActiveNav(); setTimeout(() => { isTransitioning = false; }, 900); }
function updateActiveNav() { const nav = document.querySelectorAll('.nav-btn'); let groupIndex = 0; if (activeIndex === 8) groupIndex = 4; else if (activeIndex >= 5 && activeIndex <= 7) groupIndex = 3; else if (activeIndex >= 2 && activeIndex <= 4) groupIndex = 2; else if (activeIndex === 1) groupIndex = 1; nav.forEach((btn, idx) => btn.classList.toggle('is-active', idx === groupIndex)); }
function updateCounter() { const current = String(activeIndex + 1).padStart(2, '0'); const total = String(slidesData.length).padStart(2, '0'); document.getElementById('slideCounter').textContent = `${current} / ${total}`; }
init();
