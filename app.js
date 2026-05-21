// Lädt Bildkonfiguration dynamisch und initialisiert Interaktionen.
(async function initApp() {
  const config = await loadConfig();
  applyImages(config);
  initRevealAnimations();
  initParallax();
  initTransformSection();
  initCardTilt();
})();

async function loadConfig() {
  try {
    const res = await fetch("./config.json", { cache: "no-store" });
    if (!res.ok) throw new Error("config.json konnte nicht geladen werden.");
    return await res.json();
  } catch (err) {
    console.warn("Fehler beim Laden der Konfiguration:", err);
    return {};
  }
}

function applyImages(config) {
  const nodes = document.querySelectorAll("[data-image-key]");

  nodes.forEach((node) => {
    const primary = node.dataset.imageKey;
    const fallbackKey = node.dataset.fallbackKey;
    const file = config[primary] || (fallbackKey ? config[fallbackKey] : null);

    if (!file) return setPlaceholder(node, `${primary} fehlt`);

    const img = new Image();
    img.onload = () => {
      node.style.setProperty("--image", `url('${encodeURI(file)}')`);
      node.classList.add("has-image");
      const fallback = node.querySelector(".image-fallback");
      if (fallback) fallback.style.display = "none";
    };
    img.onerror = () => setPlaceholder(node, `${file} nicht gefunden`);
    img.src = file;
  });
}

function setPlaceholder(node, text) {
  node.style.setProperty(
    "--image",
    "linear-gradient(135deg, rgba(210,216,227,.65), rgba(238,241,246,.95))"
  );
  const fallback = node.querySelector(".image-fallback");
  if (fallback) fallback.textContent = `Platzhalter · ${text}`;
}

function initRevealAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("in-view");
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

function initParallax() {
  const parallaxNodes = document.querySelectorAll(".parallax");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || !parallaxNodes.length) return;

  const update = () => {
    const viewportMid = window.innerHeight / 2;
    parallaxNodes.forEach((node) => {
      const speed = Number(node.dataset.parallax || 0.12);
      const rect = node.getBoundingClientRect();
      const delta = (rect.top + rect.height / 2 - viewportMid) * speed;
      node.style.transform = `translate3d(0, ${-delta}px, 0)`;
    });
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
}

function initTransformSection() {
  const stage = document.querySelector("#transform-stage");
  if (!stage) return;

  const layers = [...stage.querySelectorAll(".layer")];
  const dots = [...stage.querySelectorAll(".stage-dot")];
  let idx = 0;

  const activate = (next) => {
    idx = next;
    layers.forEach((layer, i) => layer.classList.toggle("active", i === idx));
    dots.forEach((dot, i) => dot.classList.toggle("active", i === idx));
  };

  dots.forEach((dot) => {
    dot.addEventListener("click", () => activate(Number(dot.dataset.goto)));
  });

  setInterval(() => activate((idx + 1) % layers.length), 3600);
}

function initCardTilt() {
  const cards = document.querySelectorAll("[data-tilt]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  cards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateY = ((x / rect.width) - 0.5) * 8;
      const rotateX = (0.5 - y / rect.height) * 8;
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}
