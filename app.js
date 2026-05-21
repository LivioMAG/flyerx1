(async function initFlyer() {
  const config = await loadConfig();
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const layers = Array.from(document.querySelectorAll(".visual-layer"));
  const pills = Array.from(document.querySelectorAll(".phase-pill"));
  const placeholder = document.getElementById("visual-placeholder");

  const phaseState = {
    current: 0,
    timer: null,
    autoDelay: 3600,
    pauseAfterManual: 6500
  };

  await applyImages(config, layers);

  const loadedCount = layers.filter((img) => img.dataset.loaded === "true").length;
  placeholder.textContent = loadedCount > 0
    ? "Ausgangsbild · Konzept · Visualisierung"
    : "Platzhalter aktiv · Bitte Bildpfade in config.json prüfen";

  function setPhase(nextPhase, isManual = false) {
    phaseState.current = nextPhase;

    layers.forEach((layer, index) => {
      layer.classList.remove("is-active", "is-adjacent");
      if (index === nextPhase) {
        layer.classList.add("is-active");
      } else if (Math.abs(index - nextPhase) === 1 || Math.abs(index - nextPhase) === 2) {
        layer.classList.add("is-adjacent");
      }
    });

    pills.forEach((pill, index) => {
      const active = index === nextPhase;
      pill.setAttribute("aria-selected", String(active));
    });

    if (isManual && !reduceMotion) {
      stopAutoCycle();
      window.setTimeout(startAutoCycle, phaseState.pauseAfterManual);
    }
  }

  function nextPhase() {
    const next = (phaseState.current + 1) % layers.length;
    setPhase(next, false);
  }

  function startAutoCycle() {
    if (reduceMotion || phaseState.timer || layers.length < 2) return;
    phaseState.timer = window.setInterval(nextPhase, phaseState.autoDelay);
  }

  function stopAutoCycle() {
    if (!phaseState.timer) return;
    window.clearInterval(phaseState.timer);
    phaseState.timer = null;
  }

  pills.forEach((pill) => {
    pill.addEventListener("click", () => {
      const target = Number(pill.dataset.phase);
      if (!Number.isInteger(target)) return;
      setPhase(target, true);
    });
  });

  setPhase(0, false);
  startAutoCycle();
})();

async function loadConfig() {
  try {
    const response = await fetch("./config.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn("config.json konnte nicht geladen werden:", error);
    return {};
  }
}

async function applyImages(config, layers) {
  const keys = ["sourceImage", "abstractImage", "realisticRender"];

  await Promise.all(
    layers.map(async (layer, index) => {
      const key = keys[index];
      const src = config[key];

      if (!src) {
        setFallbackImage(layer, `Fehlender Eintrag: ${key}`);
        return;
      }

      try {
        await preloadImage(src);
        layer.src = src;
        layer.dataset.loaded = "true";
      } catch {
        setFallbackImage(layer, `Datei nicht gefunden: ${src}`);
      }
    })
  );
}

function preloadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = resolve;
    image.onerror = reject;
    image.src = src;
  });
}

function setFallbackImage(layer, message) {
  const fallbackSVG = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1280 720'>
      <defs>
        <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0%' stop-color='#22314f'/>
          <stop offset='100%' stop-color='#0f192b'/>
        </linearGradient>
      </defs>
      <rect width='1280' height='720' fill='url(#g)'/>
      <text x='50%' y='48%' text-anchor='middle' fill='#d6e2ff' font-size='40' font-family='Inter, Arial'>Bildplatzhalter</text>
      <text x='50%' y='56%' text-anchor='middle' fill='#a8b7d6' font-size='25' font-family='Inter, Arial'>${message}</text>
    </svg>
  `)}`;

  layer.src = fallbackSVG;
  layer.dataset.loaded = "false";
}
