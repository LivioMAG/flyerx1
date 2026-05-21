(async function initApp() {
  const config = await loadConfig();
  applyImages(config);
  initRevealAnimations();
  initTransformationStory();
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
  document.querySelectorAll("[data-image-key]").forEach((node) => {
    const key = node.dataset.imageKey;
    const file = config[key];
    if (!file) return setPlaceholder(node, `${key} fehlt`);
    const img = new Image();
    img.onload = () => {
      node.style.setProperty("--image", `url('${encodeURI(file)}')`);
      node.querySelector(".image-fallback")?.remove();
    };
    img.onerror = () => setPlaceholder(node, `${file} nicht gefunden`);
    img.src = file;
  });
}

function setPlaceholder(node, text) {
  node.style.setProperty("--image", "linear-gradient(145deg, #1d2a45, #10182a)");
  const fallback = node.querySelector(".image-fallback");
  if (fallback) fallback.textContent = `Platzhalter · ${text}`;
}

function initRevealAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("in-view"));
  }, { threshold: 0.15 });
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

function initTransformationStory() {
  const story = document.querySelector(".transformation-story");
  if (!story) return;

  const source = story.querySelector(".layer-source");
  const abstract = story.querySelector(".layer-abstract");
  const finalLayer = story.querySelector(".layer-final");
  const title = story.querySelector(".phase-title");
  const description = story.querySelector(".phase-description");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const phases = [
    { title: "Vom Ausgangsbild", description: "Wir starten mit dem bestehenden Raum, Grundriss oder 2D Rendering." },
    { title: "Zur räumlichen Idee", description: "Aus der Vorlage entsteht eine konzeptionelle Interpretation mit Stimmung, Materialität und Raumgefühl." },
    { title: "Zur fertigen Visualisierung", description: "Innerhalb von 4 Stunden entsteht eine hochwertige Innenvisualisierung für Präsentation, Verkauf oder Entscheidungsfindung." }
  ];

  const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const mapRange = (v, inMin, inMax, outMin, outMax) => {
    const t = clamp((v - inMin) / (inMax - inMin));
    return lerp(outMin, outMax, t);
  };

  let raf = null;
  let currentPhase = -1;

  const updateText = (phase) => {
    if (phase === currentPhase) return;
    currentPhase = phase;
    title.style.opacity = "0";
    description.style.opacity = "0";
    title.style.transform = "translateY(14px)";
    description.style.transform = "translateY(14px)";
    setTimeout(() => {
      title.textContent = phases[phase].title;
      description.textContent = phases[phase].description;
      title.style.opacity = "1";
      description.style.opacity = "1";
      title.style.transform = "translateY(0)";
      description.style.transform = "translateY(0)";
    }, reduceMotion ? 0 : 180);
  };

  title.style.transition = description.style.transition = "opacity .45s ease, transform .6s ease";

  const render = () => {
    raf = null;
    const rect = story.getBoundingClientRect();
    const maxScroll = rect.height - window.innerHeight;
    const progress = clamp(-rect.top / maxScroll);

    const abstractIn = mapRange(progress, 0.3, 0.6, 0, 1);
    const finalIn = mapRange(progress, 0.6, 1, 0, 1);
    const sourceOut = mapRange(progress, 0.25, 0.6, 0, 1);

    source.style.opacity = `${lerp(1, 0.26, sourceOut)}`;
    source.style.transform = `translate3d(0,0,0) scale(${lerp(1, 0.93, sourceOut)})`;
    source.style.filter = `blur(${lerp(0, 1.6, sourceOut)}px) brightness(${lerp(1, 0.72, sourceOut)})`;

    abstract.style.opacity = `${lerp(0, 1, abstractIn) * lerp(1, 0.35, finalIn)}`;
    abstract.style.transform = `translate3d(0, ${lerp(80, 0, abstractIn)}px, 0) scale(${lerp(0.96, 1, abstractIn)})`;
    abstract.style.filter = `blur(${lerp(7, 0.3, abstractIn)}px)`;
    abstract.style.clipPath = `inset(${lerp(10, 0, abstractIn)}% round 26px)`;

    finalLayer.style.opacity = `${lerp(0, 1, finalIn)}`;
    finalLayer.style.transform = `translate3d(0, ${lerp(100, 0, finalIn)}px, 0) scale(${lerp(0.96, 1, finalIn)})`;
    finalLayer.style.filter = `blur(${lerp(8, 0, finalIn)}px)`;
    finalLayer.style.clipPath = `inset(${lerp(12, 0, finalIn)}% round 26px)`;

    if (progress < 0.37) updateText(0);
    else if (progress < 0.68) updateText(1);
    else updateText(2);
  };

  const requestRender = () => {
    if (raf) return;
    raf = requestAnimationFrame(render);
  };

  if (reduceMotion) {
    source.style.opacity = "0.2";
    abstract.style.opacity = "0";
    finalLayer.style.opacity = "1";
    finalLayer.style.transform = "none";
    finalLayer.style.filter = "none";
    updateText(2);
    return;
  }

  render();
  window.addEventListener("scroll", requestRender, { passive: true });
  window.addEventListener("resize", requestRender);
}
