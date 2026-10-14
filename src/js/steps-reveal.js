// Baoba - Steps reveal sincronizado com o Lottie da linha
// Arquivo: src/js/steps-reveal.js
//
// A linha (.stepe_line_image) é um Lottie controlado pelo scroll (IX3).
// Cada "circle" do Lottie surge num frame; quando o Lottie passa desse frame,
// o .steps_baoba_item correspondente (mesma ordem, de cima para baixo) entra
// com fade-up. Ao rolar para cima, o item volta a esconder junto com o ponto.

(function () {
  const LINE_SELECTOR = ".stepe_line_image";
  const GRID_SELECTOR = ".steps_baoba_grid";
  const ITEM_SELECTOR = ".steps_baoba_item";
  const READY_CLASS = "is-steps-reveal";
  const VISIBLE_CLASS = "is-step-visible";
  const MAX_WAIT_MS = 10000;

  // Frame em que cada ponto começa a surgir, ordenado de cima para baixo
  function getDotFrames(animationData) {
    return animationData.layers
      .filter((layer) => /circle/i.test(layer.nm || ""))
      .map((layer) => {
        const scale = layer.ks.s;
        const pos = layer.ks.p;
        const frame = scale && scale.a === 1 ? scale.k[0].t : 0;
        const y = pos.s ? pos.y.k : pos.k[1];
        return { frame, y };
      })
      .sort((a, b) => a.y - b.y)
      .map((dot) => dot.frame);
  }

  function findAnimation(el) {
    const mod = window.Webflow && Webflow.require && Webflow.require("lottie");
    const lib = (mod && mod.lottie) || window.lottie;
    if (!lib || !lib.getRegisteredAnimations) return null;
    return lib.getRegisteredAnimations().find((anim) => anim.wrapper === el) || null;
  }

  function revealAll(items) {
    items.forEach((item) => item.classList.add(VISIBLE_CLASS));
  }

  function bind(anim, grid, items) {
    const dotFrames = getDotFrames(anim.animationData);
    const count = Math.min(dotFrames.length, items.length);

    // Sem pontos no Lottie: não esconde nada
    if (!count) return;

    // O 1º ponto já está visível no frame 0; o item entra quando a linha começa a andar
    const thresholds = dotFrames.slice(0, count).map((frame) => Math.max(frame, 1));

    function update() {
      const frame = anim.currentFrame;
      for (let i = 0; i < count; i++) {
        items[i].classList.toggle(VISIBLE_CLASS, frame >= thresholds[i]);
      }
    }

    // Itens sem ponto correspondente aparecem normalmente
    items.slice(count).forEach((item) => item.classList.add(VISIBLE_CLASS));

    grid.classList.add(READY_CLASS);
    anim.addEventListener("enterFrame", update);
    update();
  }

  function init() {
    const line = document.querySelector(LINE_SELECTOR);
    const grid = line && line.closest(GRID_SELECTOR);
    if (!grid) return;

    const items = Array.from(grid.querySelectorAll(ITEM_SELECTOR));
    if (!items.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const start = Date.now();
    (function waitForLottie() {
      const anim = findAnimation(line);
      if (anim && anim.isLoaded && anim.animationData) {
        bind(anim, grid, items);
      } else if (Date.now() - start < MAX_WAIT_MS) {
        setTimeout(waitForLottie, 100);
      } else {
        // Lottie não carregou: garante que o conteúdo continue visível
        grid.classList.remove(READY_CLASS);
        revealAll(items);
      }
    })();
  }

  if (window.Webflow && typeof Webflow.push === "function") {
    Webflow.push(init);
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
