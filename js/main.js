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

const inputTypeIcons = {
  image: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v14H4zM8 10l2.8 3.5 2.2-2.6L17 16M8 8h.01"/></svg>',
  text: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 6h14M5 10h14M5 14h10M5 18h7"/></svg>',
  model: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9zM12 12l8-4.5M12 12v9M12 12L4 7.5"/></svg>'
};

const slidesData = [
  { type: 'overview', title: 'Mehr Wirkung', claim: 'Hochwertige Immobilienvisualisierungen für Architektur, Vermarktung und Verkauf.', promises: ['Alle Visualisierungen, die Sie bis 15:00 Uhr anfragen, erhalten Sie am nächsten Arbeitstag um 7:00 Uhr.', 'Jetzt bezahlen, wenn Sie zufrieden sind.', 'Zwei Anpassungen inklusive.'], bg: 'overviewBg', services: [{ name: 'Außenvisualisierung', category: 'Außenvisualisierungen', price: 'ab CHF XXX' }, { name: '2D-Plan zu Raum', category: 'Innenvisualisierungen', price: 'ab CHF XXX' }, { name: 'Rendering veredeln', category: 'Innenvisualisierungen', price: 'ab CHF XXX' }, { name: 'Rohbau zu Innenraum', category: 'Innenvisualisierungen', price: 'ab CHF XXX' }, { name: 'Virtual Staging', category: 'Virtual Stacking', price: 'ab CHF XXX' }, { name: 'Möbel entfernen', category: 'Virtual Stacking', price: 'ab CHF XXX' }, { name: 'Virtuelle Renovation', category: 'Virtual Stacking', price: 'ab CHF XXX' }] },
  { title: 'Außenvisualisierung', text: 'Realistische Außenrenderings für Architektur, Vermarktung und Projektpräsentation.', bg: 'serviceExteriorResult', input: 'serviceExteriorSource', inputLabel: 'Ausgangsbild', requiredInputs: [{ title: 'Ausgangsbild / Referenzbild', description: 'Ein Bild, eine Skizze oder eine Referenz, die zeigt, welche Perspektive oder Stimmung gewünscht ist.', type: 'image', required: true }, { title: '3D-Modell', description: 'Ein vorhandenes 3D-Modell oder eine Datei, die als Grundlage für die Außenvisualisierung dient.', type: 'model', required: true }, { title: 'Projektbeschreibung', description: 'Kurze Angaben zu gewünschter Perspektive, Materialien, Umgebung, Stil, Lichtstimmung oder besonderen Anforderungen.', type: 'text', required: true }] },
  { title: '2D-Plan zu Raum', text: 'Aus Grundrissen entstehen realistische Innenräume mit Licht, Materialien und Atmosphäre.', bg: 'serviceInteriorPlanResult', input: 'serviceInteriorPlanSource', inputLabel: 'Ausgangsbild', requiredInputs: [{ title: '2D-Plan / Grundriss als Ausgangsbild', description: 'Bitte senden Sie den Grundriss oder Plan als klare Vorlage für die Raumerstellung.', type: 'image', required: true }, { title: 'Projektbeschreibung', description: 'Beschreiben Sie kurz Stil, Materialien, Lichtstimmung und gewünschte Perspektive.', type: 'text', required: true }, { title: 'Referenzbild für Stil / Einrichtung', description: 'Optional: Ein zusätzliches Bild für den gewünschten Einrichtungsstil oder Look.', type: 'image', required: false }] },
  { title: 'Rendering veredeln', text: 'Bestehende 3D-Renderings werden zu fotorealistischen Bildern für Präsentation und Vermarktung.', bg: 'serviceInteriorRenderResult', input: 'serviceInteriorRenderSource', inputLabel: 'Ausgangsbild', requiredInputs: [{ title: 'Bestehendes 3D-Rendering als Ausgangsbild', description: 'Das Ausgangsrendering dient als Basis für die fotorealistische Veredelung.', type: 'image', required: true }, { title: 'Projektbeschreibung', description: 'Nennen Sie gewünschte Qualität, Lichtstimmung und Materialien für das finale Ergebnis.', type: 'text', required: true }, { title: 'Referenzbild für Qualität / Stimmung', description: 'Optional: Referenz für gewünschte Farbwelt, Kontrast oder Atmosphäre.', type: 'image', required: false }] },
  { title: 'Rohbau zu Innenraum', text: 'Unfertige Räume werden sichtbar – mit Böden, Wänden, Möbeln, Licht und Atmosphäre.', bg: 'serviceRawResult', input: 'serviceRawSource', inputLabel: 'Ausgangsbild', requiredInputs: [{ title: 'Rohbau-Foto als Ausgangsbild', description: 'Ein Foto des aktuellen Zustands als Basis für die Visualisierung des fertigen Innenraums.', type: 'image', required: true }, { title: 'Projektbeschreibung', description: 'Kurze Angaben zu Materialien, Stilrichtung, Möblierung und Lichtstimmung.', type: 'text', required: true }, { title: 'Referenzbild für Einrichtungsstil', description: 'Optional: Ein zusätzliches Bild, das den gewünschten Stil zeigt.', type: 'image', required: false }] },
  { title: 'Virtual Staging', text: 'Leere Räume werden digital möbliert und verkaufsstark inszeniert.', bg: 'serviceStagingResult', input: 'serviceStagingSource', inputLabel: 'Ausgangsbild', requiredInputs: [{ title: 'Foto des leeren Raums als Ausgangsbild', description: 'Das Foto des leeren Raums wird als Basis digital möbliert.', type: 'image', required: true }, { title: 'Projektbeschreibung', description: 'Nennen Sie Zielgruppe, Stilrichtung und gewünschte Wirkung der Möblierung.', type: 'text', required: true }, { title: 'Referenzbild für Möblierungsstil', description: 'Optional: Ein weiteres Bild zur Stilorientierung.', type: 'image', required: false }] },
  { title: 'Möbel entfernen', text: 'Überladene Räume werden neutralisiert und als klare, leere Flächen dargestellt.', bg: 'serviceRemoveResult', input: 'serviceRemoveSource', inputLabel: 'Ausgangsbild', requiredInputs: [{ title: 'Foto des möblierten Raums als Ausgangsbild', description: 'Das Ausgangsbild zeigt den Raum mit bestehenden Möbeln.', type: 'image', required: true }, { title: 'Projektbeschreibung', description: 'Kurze Hinweise zu Bereichen, die entfernt oder unverändert bleiben sollen.', type: 'text', required: true }] },
  { title: 'Virtuelle Renovation', text: 'Renovationsideen werden sichtbar – mit neuen Materialien, Farben, Fliesen oder Ausstattung.', bg: 'serviceRenovationResult', input: 'serviceRenovationSource', inputLabel: 'Ausgangsbild', requiredInputs: [{ title: 'Foto des bestehenden Raums als Ausgangsbild', description: 'Das Foto dient als Basis, um neue Materialien und Oberflächen sichtbar zu machen.', type: 'image', required: true }, { title: 'Projektbeschreibung', description: 'Beschreiben Sie gewünschte Änderungen wie Fliesen, Boden, Wandfarbe oder Ausstattung.', type: 'text', required: true }, { title: 'Referenzbild für Renovationsstil', description: 'Optional: Referenz für Stilrichtung, Materialien oder Farbwelt.', type: 'image', required: false }] },
  { type: 'contact', title: 'Anfrage', text: 'Nutzen Sie das Formular für den Erstkontakt – wir melden uns für ein kurzes Gespräch.', bg: 'contactSlideBg' }
];

const navItems = [{ label: 'Visual Estate', index: 0 }, { label: 'Außenvisualisierungen', index: 1 }, { label: 'Innenvisualisierungen', index: 2 }, { label: 'Virtual Stacking', index: 5 }, { label: 'Anfrage', index: 8 }];
const serviceOptions = Object.keys(serviceRouteMap);
let activeIndex = 0; let deltaAccumulator = 0; let isTransitioning = false; let touchStartY = null;
const threshold = 120;

async function init() {
  const [texts, assets] = await Promise.all([fetch('text.json').then((r) => r.json()), fetch('assets.json').then((r) => r.json())]);
  document.querySelectorAll('[data-text]').forEach((e) => { const k = e.dataset.text; if (texts[k]) e.textContent = texts[k]; });
  renderNav(); renderSlides(assets, texts); updateCounter(); updateActiveNav(); bindInteractions(); bindMobileMenu(); bindInquiryForm(texts);
}

function renderNav() { const nav = document.getElementById('topNav'); nav.innerHTML = navItems.map((item) => `<button class="nav-btn" data-index="${item.index}">${item.label}</button>`).join(''); nav.querySelectorAll('.nav-btn').forEach((b) => b.addEventListener('click', () => goTo(Number(b.dataset.index)))); }
function renderInputItem(item) { return `<article class="required-item"><span class="required-item-icon">${inputTypeIcons[item.type] || inputTypeIcons.text}</span><div><h4>${item.title}</h4><p>${item.description}</p></div><span class="required-badge ${item.required ? 'is-required' : ''}">${item.required ? 'Erforderlich' : 'Optional'}</span></article>`; }

function renderSlides(assets, texts) {
  const viewport = document.getElementById('slideViewport');
  viewport.innerHTML = slidesData.map((slide, index) => {
    if (slide.type === 'overview') return `<article class="slide slide-overview ${index === 0 ? 'is-active' : ''}" data-index="${index}"><img class="bg" src="${assets[slide.bg]}" alt="Visual Estate Übersicht" /><div class="overlay"></div><div class="overview-content"><section class="overview-intro"><h1 class="overview-title reveal-item reveal-title">${slide.title}</h1><p class="overview-claim reveal-item reveal-claim">${slide.claim}</p><div class="promise-list">${slide.promises.map((promise, i) => `<p class="service-promise reveal-item reveal-promise" style="--reveal-order:${i};"><span class="promise-dot"></span><span>${promise}</span></p>`).join('')}</div></section><section class="overview-panel reveal-item reveal-panel"><div class="overview-toggle" role="tablist" aria-label="Übersicht umschalten"><button class="overview-toggle-btn is-active" type="button" data-target-view="flow">So funktioniert's</button><button class="overview-toggle-btn" type="button" data-target-view="pricing">Preisliste</button></div><div class="overview-view"><div class="overview-flow is-active" data-view="flow"><article class="flow-step reveal-step" style="--step-order:0;"><span class="flow-index">01</span><div><h3>Anfrage senden</h3><p>Sie senden uns Ihre Anfrage über das Kontaktformular.</p></div></article><article class="flow-step reveal-step" style="--step-order:1;"><span class="flow-index">02</span><div><h3>Erstgespräch</h3><p>In einem kurzen Gespräch erklären wir Ihnen den Ablauf und klären, welche Unterlagen wir benötigen.</p></div></article><article class="flow-step reveal-step" style="--step-order:2;"><span class="flow-index">03</span><div><h3>Zugang zur Plattform</h3><p>Sie erhalten Zugang zu unserer Plattform und können Ihre Ausgangsbilder und Unterlagen dort einreichen.</p><p class="flow-substep"><strong>Alternativ per E-Mail:</strong> Auf Wunsch können Sie Ihre Ausgangsbilder und Unterlagen auch per E-Mail einreichen.</p></div></article><article class="flow-step reveal-step" style="--step-order:3;"><span class="flow-index">04</span><div><h3>Resultat erhalten</h3><p>Sie erhalten Ihre fertigen Visualisierungen spätestens am nächsten Arbeitstag um 7:00 Uhr.</p></div></article></div><div class="overview-list" data-view="pricing">${slide.services.map((service, i) => `<button class="service-item reveal-service" type="button" data-service="${service.name}" style="--service-order:${i};"><span class="service-item-icon">${serviceIcons[service.name] || ''}</span><span><span class="service-item-title">${service.name}</span><span class="service-item-meta">${service.category}</span></span><strong>${service.price}</strong></button>`).join('')}</div></div></section></div></article>`;
    if (slide.type === 'contact') return `<article class="slide slide-contact" data-index="${index}"><img class="bg" src="${assets[slide.bg]}" alt="${slide.title}" /><div class="overlay"></div><section class="contact-content" id="contactFormSection"><h1 class="service-title">${slide.title}</h1><p class="service-subtext">${slide.text}</p><form id="inquiryForm" class="inquiry-form" novalidate><label><span>${texts.formNameShort || 'Name oder Vorname'}</span><input name="name" type="text" autocomplete="name" required /></label><label><span>${texts.formEmailShort || 'E-Mail'}</span><input name="email" type="email" autocomplete="email" required /></label><label><span>${texts.formServiceShort || 'Interesse / Dienstleistung'}</span><select name="service" required><option value="">Bitte auswählen</option>${serviceOptions.map((option) => `<option value="${option}">${option}</option>`).join('')}</select></label><p class="upload-feedback" id="uploadFeedback">${texts.formContactOnly || 'Hinweis: Über diese Webseite können keine Bilder eingereicht werden. Das Formular dient nur dem Erstkontakt.'}</p><label><span>${texts.formProjectDescription || 'Projektbeschreibung'}</span><textarea name="message" rows="4" required></textarea></label><button type="submit">${texts.formSubmit || 'Anfrage senden'}</button><p class="form-feedback" id="formFeedback" role="status" aria-live="polite"></p></form><div class="legal-links legal-links--contact"><a href="impressum.html" data-text="footerImprint"></a><a href="datenschutz.html" data-text="footerPrivacy"></a></div></section></article>`;

    const panelId = `required-panel-${index}`;
    return `<article class="slide" data-index="${index}"><img class="bg" src="${assets[slide.bg]}" alt="${slide.title}" /><div class="overlay"></div><div class="service-copy"><h1 class="service-title">${slide.title}</h1><p class="service-subtext">${slide.text}</p></div><figure class="input-wrap"><button class="input-trigger" type="button" aria-label="Was wir benötigen anzeigen" aria-expanded="false" aria-controls="${panelId}" data-slide-index="${index}"><img src="${assets[slide.input]}" alt="${slide.inputLabel}" /><span>${slide.inputLabel}</span><span class="input-hover-hint">Was wir benötigen</span></button></figure><aside class="required-panel" id="${panelId}" aria-hidden="true"><div class="required-panel-inner"><button class="required-close" type="button" aria-label="Panel schließen">×</button><h3>Was wir für diese Visualisierung benötigen</h3><div class="required-items">${slide.requiredInputs.map(renderInputItem).join('')}</div><button class="required-cta" type="button" data-service="${slide.title}">Ich bin interessiert</button></div></aside></article>`;
  }).join('');

  bindOverviewToggle(viewport);
  bindInputPanels(viewport);
}

function bindOverviewToggle(viewport) { viewport.querySelectorAll('.overview-toggle-btn').forEach((btn) => { btn.addEventListener('click', () => { const target = btn.dataset.targetView; const container = btn.closest('.overview-panel'); if (!container) return; container.querySelectorAll('.overview-toggle-btn').forEach((item) => item.classList.toggle('is-active', item === btn)); container.querySelectorAll('[data-view]').forEach((view) => view.classList.toggle('is-active', view.dataset.view === target)); }); }); viewport.querySelectorAll('.service-item').forEach((item) => item.addEventListener('click', () => openContactWithService(item.dataset.service))); }

function bindInputPanels(viewport) {
  viewport.querySelectorAll('.input-trigger').forEach((trigger) => {
    trigger.addEventListener('click', () => togglePanel(trigger, true));
  });
  viewport.querySelectorAll('.required-close').forEach((btn) => {
    btn.addEventListener('click', () => closeOpenPanel(btn.closest('.slide')));
  });
  viewport.querySelectorAll('.required-cta').forEach((cta) => cta.addEventListener('click', () => openContactWithService(cta.dataset.service)));
}
function togglePanel(trigger, open) { const slide = trigger.closest('.slide'); const panel = slide.querySelector('.required-panel'); panel.classList.toggle('is-open', open); panel.setAttribute('aria-hidden', String(!open)); trigger.setAttribute('aria-expanded', String(open)); }
function closeOpenPanel(slide) { const panel = slide?.querySelector('.required-panel.is-open'); const trigger = slide?.querySelector('.input-trigger'); if (!panel || !trigger) return; panel.classList.remove('is-open'); panel.setAttribute('aria-hidden', 'true'); trigger.setAttribute('aria-expanded', 'false'); }
function closeAllPanels() { document.querySelectorAll('.slide').forEach((slide) => closeOpenPanel(slide)); }
function openContactWithService(service) { goTo(8); requestAnimationFrame(() => { const select = document.querySelector('#inquiryForm select[name="service"]'); if (select && service) select.value = service;  }); }

function bindInquiryForm(texts) {
  const form = document.getElementById('inquiryForm'); const feedback = document.getElementById('formFeedback');
  if (!form || !feedback) return;
    form.addEventListener('submit', (event) => { event.preventDefault(); const name = form.elements.name.value.trim(); const email = form.elements.email.value.trim(); const service = form.elements.service.value.trim(); const message = form.elements.message.value.trim(); const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); if (!name || !validEmail || !service || !message) { feedback.textContent = texts.formError || 'Bitte alle Pflichtfelder korrekt ausfüllen.'; feedback.classList.remove('is-success'); return; } feedback.textContent = texts.contactSuccess || 'Danke, wir melden uns zeitnah mit den nächsten Schritten.'; feedback.classList.add('is-success'); form.reset(); });
}

function bindInteractions() { window.addEventListener('wheel', onWheel, { passive: false }); window.addEventListener('keydown', onKeyDown); window.addEventListener('touchstart', (e) => { touchStartY = e.touches[0].clientY; }, { passive: true }); window.addEventListener('touchmove', onTouchMove, { passive: false }); document.addEventListener('click', (event) => { document.querySelectorAll('.required-panel.is-open').forEach((panel) => { if (!panel.contains(event.target) && !panel.closest('.slide').querySelector('.input-trigger').contains(event.target)) closeOpenPanel(panel.closest('.slide')); }); }); }
function onWheel(event) { event.preventDefault(); if (isTransitioning) return; deltaAccumulator += event.deltaY; if (Math.abs(deltaAccumulator) < threshold) return; goTo(activeIndex + (deltaAccumulator > 0 ? 1 : -1)); deltaAccumulator = 0; }
function onTouchMove(event) { if (touchStartY === null || isTransitioning) return; const delta = touchStartY - event.touches[0].clientY; if (Math.abs(delta) < 45) return; event.preventDefault(); goTo(activeIndex + (delta > 0 ? 1 : -1)); touchStartY = null; }
function onKeyDown(event) { if (event.key === 'Escape') { closeAllPanels(); return; } if (isTransitioning) return; if (event.key === 'ArrowDown') goTo(activeIndex + 1); if (event.key === 'ArrowUp') goTo(activeIndex - 1); }
function goTo(index) { if (index < 0 || index >= slidesData.length || index === activeIndex) return; closeAllPanels(); const slides = [...document.querySelectorAll('.slide')]; isTransitioning = true; slides[activeIndex].classList.remove('is-active'); slides[index].classList.add('is-active'); activeIndex = index; updateCounter(); updateActiveNav(); setTimeout(() => { isTransitioning = false; }, 900); }
function updateActiveNav() { const nav = document.querySelectorAll('.nav-btn'); let groupIndex = 0; if (activeIndex === 8) groupIndex = 4; else if (activeIndex >= 5 && activeIndex <= 7) groupIndex = 3; else if (activeIndex >= 2 && activeIndex <= 4) groupIndex = 2; else if (activeIndex === 1) groupIndex = 1; nav.forEach((btn, idx) => btn.classList.toggle('is-active', idx === groupIndex)); }
function updateCounter() { const current = String(activeIndex + 1).padStart(2, '0'); const total = String(slidesData.length).padStart(2, '0'); document.getElementById('slideCounter').textContent = `${current} / ${total}`; }

function bindMobileMenu() {
  const appBar = document.querySelector('.app-bar');
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('topNav');
  if (!appBar || !toggle || !nav) return;

  const closeMenu = () => {
    appBar.classList.remove('is-menu-open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', () => {
    const isOpen = appBar.classList.toggle('is-menu-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.addEventListener('click', (event) => {
    if (event.target.closest('.nav-btn') && window.matchMedia('(max-width: 980px)').matches) closeMenu();
  });

  window.addEventListener('resize', () => {
    if (!window.matchMedia('(max-width: 980px)').matches) closeMenu();
  });
}

init();
