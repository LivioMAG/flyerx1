const serviceRouteMap = {};
const serviceKeyMap = { service1Name: 1, service2Name: 2, service3Name: 3, service4Name: 4, service5Name: 5, service6Name: 6, service7Name: 7 };

const serviceIcons = {
  service1Name: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 20h18M5 20V9l7-5 7 5v11M9 20v-5h6v5"/></svg>',
  service2Name: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v16H4zM9 4v16M4 11h16M14 11v9"/></svg>',
  service3Name: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.4l-5.5 2.8 1-6.2L3 9.6l6.2-.9z"/></svg>',
  service4Name: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12l9-8 9 8M5 10v10h14V10M9 20v-6h6v6"/></svg>',
  service5Name: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16v10H4zM8 17v3M16 17v3M8 11h8"/></svg>',
  service6Name: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16v10H4zM3 3l18 18M8 17v3M16 17v3"/></svg>',
  service7Name: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4l6 6-8.5 8.5H5.5V13zM12 6l6 6"/></svg>'
};

const inputTypeIcons = {
  image: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v14H4zM8 10l2.8 3.5 2.2-2.6L17 16M8 8h.01"/></svg>',
  text: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 6h14M5 10h14M5 14h10M5 18h7"/></svg>',
  model: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9zM12 12l8-4.5M12 12v9M12 12L4 7.5"/></svg>'
};

const slidesBlueprint = [
  { type: 'overview', bg: 'overviewBg' },
  { type: 'service', serviceNumber: 1, bg: 'serviceExteriorResult', input: 'serviceExteriorSource' },
  { type: 'service', serviceNumber: 2, bg: 'serviceInteriorPlanResult', input: 'serviceInteriorPlanSource' },
  { type: 'service', serviceNumber: 3, bg: 'serviceInteriorRenderResult', input: 'serviceInteriorRenderSource' },
  { type: 'service', serviceNumber: 4, bg: 'serviceRawResult', input: 'serviceRawSource' },
  { type: 'service', serviceNumber: 5, bg: 'serviceStagingResult', input: 'serviceStagingSource' },
  { type: 'service', serviceNumber: 6, bg: 'serviceRemoveResult', input: 'serviceRemoveSource' },
  { type: 'service', serviceNumber: 7, bg: 'serviceRenovationResult', input: 'serviceRenovationSource' },
  { type: 'contact', bg: 'contactSlideBg' }
];

const t = (texts, key, fallback = '') => texts[key] || fallback;
const getServiceOptions = (texts) => Object.keys(serviceKeyMap).map((k) => t(texts, k, k));

let activeIndex = 0; let deltaAccumulator = 0; let isTransitioning = false; let touchStartY = null;
const threshold = 120;

async function init() {
  const [texts, assets] = await Promise.all([fetch('text.json').then((r) => r.json()), fetch('assets.json').then((r) => r.json())]);
  document.querySelectorAll('[data-text]').forEach((e) => { const k = e.dataset.text; if (texts[k]) e.textContent = texts[k]; });
  document.querySelectorAll('[data-aria-label]').forEach((e) => { const k = e.dataset.ariaLabel; if (texts[k]) e.setAttribute('aria-label', texts[k]); });
  Object.entries(serviceKeyMap).forEach(([k, v]) => { serviceRouteMap[t(texts, k, k)] = v; });
  renderNav(texts); renderSlides(assets, texts); updateCounter(); updateActiveNav(); bindInteractions(); bindMobileMenu(); bindInquiryForm(texts);
}

function renderNav(texts) { const nav = document.getElementById('topNav'); const items = [{ k: 'navOverview', index: 0 }, { k: 'navExteriorGroup', index: 1 }, { k: 'navInteriorGroup', index: 2 }, { k: 'navStagingGroup', index: 5 }, { k: 'navInquiry', index: 8 }]; nav.innerHTML = items.map((item) => `<button class=\"nav-btn\" data-index=\"${item.index}\">${t(texts, item.k, item.k)}</button>`).join(''); nav.querySelectorAll('.nav-btn').forEach((b) => b.addEventListener('click', () => goTo(Number(b.dataset.index)))); }
function renderInputItem(item, texts) { return `<article class="required-item"><span class="required-item-icon">${inputTypeIcons[item.type] || inputTypeIcons.text}</span><div><h4>${t(texts, item.titleKey, item.titleKey)}</h4><p>${t(texts, item.descriptionKey, item.descriptionKey)}</p></div><span class="required-badge ${item.required ? 'is-required' : ''}">${item.required ? t(texts, 'requiredLabel', 'Erforderlich') : t(texts, 'optionalLabel', 'Optional')}</span></article>`; }

function buildSlidesData(texts) {
  return slidesBlueprint.map((slide) => {
    if (slide.type === 'overview') {
      return {
        ...slide,
        title: t(texts, 'overviewTitle'), claim: t(texts, 'overviewClaim'), alt: t(texts, 'overviewImageAlt'),
        promises: [t(texts, 'overviewPromise1'), t(texts, 'overviewPromise2'), t(texts, 'overviewPromise3')],
        services: [1, 2, 3, 4, 5, 6, 7].map((n) => ({ name: t(texts, `service${n}Name`), category: t(texts, `service${n}Category`), price: t(texts, `service${n}Price`) }))
      };
    }
    if (slide.type === 'service') {
      const n = slide.serviceNumber;
      return {
        ...slide,
        title: t(texts, `service${n}Name`), category: t(texts, `service${n}Category`), text: t(texts, `service${n}Text`), inputLabel: t(texts, 'serviceInputLabel'),
        requiredInputs: [1, 2, 3].map((i) => ({ titleKey: `service${n}Input${i}Title`, descriptionKey: `service${n}Input${i}Description`, type: t(texts, `service${n}Input${i}Type`, 'text'), required: t(texts, `service${n}Input${i}Required`, 'false') === 'true' })).filter((x) => x.titleKey && texts[x.titleKey]),
      };
    }
    return { ...slide, title: t(texts, 'contactSlideTitle'), text: t(texts, 'contactSlideText') };
  });
}

function renderSlides(assets, texts) {
  const slidesData = buildSlidesData(texts);
  const viewport = document.getElementById('slideViewport');
  viewport.innerHTML = slidesData.map((slide, index) => {
    if (slide.type === 'overview') return `<article class="slide slide-overview ${index === 0 ? 'is-active' : ''}" data-index="${index}"><img class="bg" src="${assets[slide.bg]}" alt="${slide.alt}" /><div class="overlay"></div><div class="overview-content"><section class="overview-intro"><h1 class="overview-title reveal-item reveal-title">${slide.title}</h1><p class="overview-claim reveal-item reveal-claim">${slide.claim}</p><div class="promise-list">${slide.promises.map((promise, i) => `<p class="service-promise reveal-item reveal-promise" style="--reveal-order:${i};"><span>${promise}</span></p>`).join('')}</div></section><section class="overview-panel reveal-item reveal-panel"><div class="overview-toggle" role="tablist" aria-label="${t(texts, 'overviewToggleAria')}"><button class="overview-toggle-btn is-active" type="button" data-target-view="flow">${t(texts, 'overviewTabFlow')}</button><button class="overview-toggle-btn" type="button" data-target-view="pricing">${t(texts, 'overviewTabPricing')}</button></div><div class="overview-view"><div class="overview-flow is-active" data-view="flow"><article class="flow-step reveal-step" style="--step-order:0;"><span class="flow-index">01</span><div><h3>${t(texts, 'flowStep1Title')}</h3><p>${t(texts, 'flowStep1Text')}</p></div></article><article class="flow-step reveal-step" style="--step-order:1;"><span class="flow-index">02</span><div><h3>${t(texts, 'flowStep2Title')}</h3><p>${t(texts, 'flowStep2Text')}</p></div></article><article class="flow-step reveal-step" style="--step-order:2;"><span class="flow-index">03</span><div><h3>${t(texts, 'flowStep3Title')}</h3><p>${t(texts, 'flowStep3Text')}</p><p class="flow-substep"><strong>${t(texts, 'flowStep3AltPrefix')}</strong> ${t(texts, 'flowStep3AltText')}</p></div></article><article class="flow-step reveal-step" style="--step-order:3;"><span class="flow-index">04</span><div><h3>${t(texts, 'flowStep4Title')}</h3><p>${t(texts, 'flowStep4Text')}</p></div></article></div><div class="overview-list" data-view="pricing">${slide.services.map((service, i) => `<button class="service-item reveal-service" type="button" data-service="${service.name}" style="--service-order:${i};"><span class="service-item-icon">${serviceIcons[`service${i + 1}Name`] || ''}</span><span><span class="service-item-title">${service.name}</span><span class="service-item-meta">${service.category}</span></span><strong>${service.price}</strong></button>`).join('')}</div></div></section></div></article>`;
    if (slide.type === 'contact') return `<article class="slide slide-contact" data-index="${index}"><img class="bg" src="${assets[slide.bg]}" alt="${slide.title}" /><div class="overlay"></div><section class="contact-content" id="contactFormSection"><h1 class="service-title">${slide.title}</h1><p class="service-subtext">${slide.text}</p><form id="inquiryForm" class="inquiry-form" novalidate><label><span>${t(texts, 'formNameShort')}</span><input name="name" type="text" autocomplete="name" required /></label><label><span>${t(texts, 'formEmailShort')}</span><input name="email" type="email" autocomplete="email" required /></label><label><span>${t(texts, 'formPhoneShort')}</span><input name="phone" type="tel" autocomplete="tel" /></label><label><span>${t(texts, 'formServiceShort')}</span><select name="service" required><option value="">${t(texts, 'selectPlaceholder')}</option>${getServiceOptions(texts).map((option) => `<option value="${option}">${option}</option>`).join('')}</select></label><button type="submit">${t(texts, 'formSubmit')}</button><p class="form-feedback" id="formFeedback" role="status" aria-live="polite"></p></form><div class="legal-links legal-links--contact"><a href="impressum.html" data-text="footerImprint"></a><a href="datenschutz.html" data-text="footerPrivacy"></a></div></section></article>`;

    const panelId = `required-panel-${index}`;
    return `<article class="slide" data-index="${index}"><img class="bg" src="${assets[slide.bg]}" alt="${slide.title}" /><div class="overlay"></div><div class="service-copy"><h1 class="service-title">${slide.title}</h1><p class="service-category">${slide.category || ''}</p><p class="service-subtext">${slide.text}</p></div><figure class="input-wrap"><button class="input-trigger" type="button" aria-label="${t(texts, 'inputTriggerAria')}" aria-expanded="false" aria-controls="${panelId}" data-slide-index="${index}"><img src="${assets[slide.input]}" alt="${slide.inputLabel}" /><span>${slide.inputLabel}</span><span class="input-hover-hint">${t(texts, 'inputHint')}</span></button></figure><aside class="required-panel" id="${panelId}" aria-hidden="true"><div class="required-panel-inner"><button class="required-close" type="button" aria-label="${t(texts, 'panelCloseAria')}">×</button><h3>${t(texts, 'panelTitle')}</h3><div class="required-items">${slide.requiredInputs.map((item) => renderInputItem(item, texts)).join('')}</div><button class="required-cta" type="button" data-service="${slide.title}">${t(texts, 'panelCta')}</button><div class="required-panel-spacer" aria-hidden="true"></div></div></aside></article>`;
  }).join('');

  bindOverviewToggle(viewport);
  bindInputPanels(viewport);
}

function bindOverviewToggle(viewport) { viewport.querySelectorAll('.overview-toggle-btn').forEach((btn) => { btn.addEventListener('click', () => { const target = btn.dataset.targetView; const container = btn.closest('.overview-panel'); if (!container) return; container.querySelectorAll('.overview-toggle-btn').forEach((item) => item.classList.toggle('is-active', item === btn)); container.querySelectorAll('[data-view]').forEach((view) => view.classList.toggle('is-active', view.dataset.view === target)); }); }); viewport.querySelectorAll('.service-item').forEach((item) => item.addEventListener('click', () => openContactWithService(item.dataset.service))); }
function bindInputPanels(viewport) { viewport.querySelectorAll('.input-trigger').forEach((trigger) => trigger.addEventListener('click', () => togglePanel(trigger, true))); viewport.querySelectorAll('.required-close').forEach((btn) => btn.addEventListener('click', () => closeOpenPanel(btn.closest('.slide')))); viewport.querySelectorAll('.required-cta').forEach((cta) => cta.addEventListener('click', () => openContactWithService(cta.dataset.service))); }
function togglePanel(trigger, open) { const slide = trigger.closest('.slide'); const panel = slide.querySelector('.required-panel'); panel.classList.toggle('is-open', open); panel.setAttribute('aria-hidden', String(!open)); trigger.setAttribute('aria-expanded', String(open)); }
function closeOpenPanel(slide) { const panel = slide?.querySelector('.required-panel.is-open'); const trigger = slide?.querySelector('.input-trigger'); if (!panel || !trigger) return; panel.classList.remove('is-open'); panel.setAttribute('aria-hidden', 'true'); trigger.setAttribute('aria-expanded', 'false'); }
function closeAllPanels() { document.querySelectorAll('.slide').forEach((slide) => closeOpenPanel(slide)); }
function openContactWithService(service) { goTo(8); requestAnimationFrame(() => { const select = document.querySelector('#inquiryForm select[name="service"]'); if (select && service) select.value = service; }); }
function bindInquiryForm(texts) { const form = document.getElementById('inquiryForm'); const feedback = document.getElementById('formFeedback'); if (!form || !feedback) return; form.addEventListener('submit', async (event) => { event.preventDefault(); const name = form.elements.name.value.trim(); const email = form.elements.email.value.trim(); const phone = form.elements.phone.value.trim(); const service = form.elements.service.value.trim(); const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); if (!name || !validEmail || !service) { feedback.textContent = t(texts, 'formError'); feedback.classList.remove('is-success'); return; } const webhookUrl = t(texts, 'inquiryWebhookUrl'); const payload = { name, email, service, phone: phone || '' }; try { if (webhookUrl) { await fetch(webhookUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }); } feedback.textContent = t(texts, 'contactSuccess'); feedback.classList.add('is-success'); form.reset(); } catch (error) { feedback.textContent = t(texts, 'formWebhookError'); feedback.classList.remove('is-success'); } }); }
function bindInteractions() { window.addEventListener('wheel', onWheel, { passive: false }); window.addEventListener('keydown', onKeyDown); window.addEventListener('touchstart', (e) => { touchStartY = e.touches[0].clientY; }, { passive: true }); window.addEventListener('touchmove', onTouchMove, { passive: false }); document.addEventListener('click', (event) => { document.querySelectorAll('.required-panel.is-open').forEach((panel) => { if (!panel.contains(event.target) && !panel.closest('.slide').querySelector('.input-trigger').contains(event.target)) closeOpenPanel(panel.closest('.slide')); }); }); }
function onWheel(event) { event.preventDefault(); if (isTransitioning) return; deltaAccumulator += event.deltaY; if (Math.abs(deltaAccumulator) < threshold) return; goTo(activeIndex + (deltaAccumulator > 0 ? 1 : -1)); deltaAccumulator = 0; }
function onTouchMove(event) { if (touchStartY === null || isTransitioning) return; const delta = touchStartY - event.touches[0].clientY; if (Math.abs(delta) < 45) return; event.preventDefault(); goTo(activeIndex + (delta > 0 ? 1 : -1)); touchStartY = null; }
function onKeyDown(event) { if (event.key === 'Escape') { closeAllPanels(); return; } if (isTransitioning) return; if (event.key === 'ArrowDown') goTo(activeIndex + 1); if (event.key === 'ArrowUp') goTo(activeIndex - 1); }
function goTo(index) { if (index < 0 || index >= slidesBlueprint.length || index === activeIndex) return; closeAllPanels(); const slides = [...document.querySelectorAll('.slide')]; isTransitioning = true; slides[activeIndex].classList.remove('is-active'); slides[index].classList.add('is-active'); activeIndex = index; updateCounter(); updateActiveNav(); setTimeout(() => { isTransitioning = false; }, 900); }
function updateActiveNav() { const nav = document.querySelectorAll('.nav-btn'); let groupIndex = 0; if (activeIndex === 8) groupIndex = 4; else if (activeIndex >= 5 && activeIndex <= 7) groupIndex = 3; else if (activeIndex >= 2 && activeIndex <= 4) groupIndex = 2; else if (activeIndex === 1) groupIndex = 1; nav.forEach((btn, idx) => btn.classList.toggle('is-active', idx === groupIndex)); }
function updateCounter() { const current = String(activeIndex + 1).padStart(2, '0'); const total = String(slidesBlueprint.length).padStart(2, '0'); const counter = document.getElementById('slideCounter'); if (counter) counter.textContent = `${current} / ${total}`; }
function bindMobileMenu() { const appBar = document.querySelector('.app-bar'); const toggle = document.getElementById('menuToggle'); const nav = document.getElementById('topNav'); if (!appBar || !toggle || !nav) return; const closeMenu = () => { appBar.classList.remove('is-menu-open'); toggle.setAttribute('aria-expanded', 'false'); }; toggle.addEventListener('click', () => { const isOpen = appBar.classList.toggle('is-menu-open'); toggle.setAttribute('aria-expanded', String(isOpen)); }); nav.addEventListener('click', (event) => { if (event.target.closest('.nav-btn') && window.matchMedia('(max-width: 980px)').matches) closeMenu(); }); window.addEventListener('resize', () => { if (!window.matchMedia('(max-width: 980px)').matches) closeMenu(); }); }
init();
