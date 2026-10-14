// Baoba - Timeline das etapas (SVG + pontos)
// Arquivo: src/js/steps-timeline.js
//
// Desenha dentro de .steps_line_canvas uma linha curva em SVG que passa por um
// ponto alinhado ao centro do ícone de cada .steps_baoba_item. A linha é
// desenhada pelo scroll; quando chega num ponto, o ponto aparece e o item
// correspondente entra com fade-up. Ao rolar para cima, tudo volta junto.

(function () {
  const GRID_SELECTOR = ".steps_baoba_grid";
  const CANVAS_SELECTOR = ".steps_line_canvas";
  const ITEM_SELECTOR = ".steps_baoba_item";
  const ANCHOR_SELECTOR = ".steps_baoba_media";
  const READY_CLASS = "is-steps-reveal";
  const VISIBLE_CLASS = "is-step-visible";
  const DOT_CLASS = "steps_line_dot";
  const DOT_ACTIVE_CLASS = "is-active";

  // Altura da tela (0 = topo, 1 = base) onde fica a "ponta" da linha
  const HEAD_POSITION = 0.6;
  const SCRUB = 0.6;

  // Posição horizontal de cada ponto (0 = esquerda, 1 = direita), copiada do
  // desenho original do Lottie. Repete o padrão se houver mais itens.
  const DOT_X = [0.403, 0.203, 0.306, 0.6, 0.866, 0.938, 0.866, 0.691, 0.416];
  // Fim da linha, como no Lottie: canto inferior esquerdo
  const END_X = 0;

  // Tablet e mobile (breakpoint "medium" do Webflow): linha reta à esquerda,
  // do primeiro ao último ponto. A coluna da linha é a classe do Webflow.
  const STRAIGHT_QUERY = window.matchMedia("(max-width: 991px)");

  const SVG_NS = "http://www.w3.org/2000/svg";

  // Distância do topo de `el` até o topo de `ancestor`, ignorando transforms
  function offsetTopWithin(el, ancestor) {
    let top = 0;
    let node = el;
    while (node && node !== ancestor) {
      top += node.offsetTop;
      node = node.offsetParent;
    }
    return node === ancestor ? top : top - ancestor.offsetTop;
  }

  // Curva suave (Catmull-Rom) passando por todos os pontos
  function smoothPath(points) {
    let d = `M${points[0].x},${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i - 1] || points[i];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] || p2;
      const c1x = p1.x + (p2.x - p0.x) / 6;
      const c1y = p1.y + (p2.y - p0.y) / 6;
      const c2x = p2.x - (p3.x - p1.x) / 6;
      const c2y = p2.y - (p3.y - p1.y) / 6;
      d += ` C${c1x},${c1y} ${c2x},${c2y} ${p2.x},${p2.y}`;
    }
    return d;
  }

  function init() {
    const grid = document.querySelector(GRID_SELECTOR);
    const canvas = grid && grid.querySelector(CANVAS_SELECTOR);
    if (!canvas) return;

    const items = Array.from(grid.querySelectorAll(ITEM_SELECTOR));
    if (!items.length) return;

    const svg = document.createElementNS(SVG_NS, "svg");
    const path = document.createElementNS(SVG_NS, "path");
    svg.setAttribute("aria-hidden", "true");
    svg.appendChild(path);
    canvas.appendChild(svg);

    const dots = items.map(() => {
      const dot = document.createElement("div");
      dot.className = DOT_CLASS;
      canvas.appendChild(dot);
      return dot;
    });

    let dotY = [];
    let totalLength = 0;
    let lengthByY = [];
    let height = 0;
    let headY = 0;

    function layout() {
      const width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      if (!width || !height) return;

      const straight = STRAIGHT_QUERY.matches;
      const canvasTop = offsetTopWithin(canvas, grid);
      const points = items.map((item, i) => {
        const anchor = item.querySelector(ANCHOR_SELECTOR) || item;
        const y = offsetTopWithin(anchor, grid) + anchor.offsetHeight / 2 - canvasTop;
        const x = straight ? width / 2 : DOT_X[i % DOT_X.length] * width;
        return { x, y };
      });

      const first = points[0];
      const last = points[points.length - 1];
      const d = straight
        ? `M${first.x},${first.y} L${last.x},${last.y}`
        : smoothPath([...points, { x: END_X * width, y: height }]);

      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      path.setAttribute("d", d);
      totalLength = path.getTotalLength();
      path.style.strokeDasharray = totalLength;

      dotY = points.map((point, i) => {
        dots[i].style.left = `${point.x}px`;
        dots[i].style.top = `${point.y}px`;
        return point.y;
      });

      // Tabela altura -> comprimento da linha, para a ponta seguir o scroll
      const samples = 400;
      lengthByY = [];
      let maxY = -Infinity;
      for (let s = 0; s <= samples; s++) {
        const length = (totalLength * s) / samples;
        maxY = Math.max(maxY, path.getPointAtLength(length).y);
        lengthByY.push([maxY, length]);
      }

      render();
    }

    function lengthAt(y) {
      if (y <= lengthByY[0][0]) return 0;
      for (let i = 1; i < lengthByY.length; i++) {
        const [y1, l1] = lengthByY[i];
        if (y1 >= y) {
          const [y0, l0] = lengthByY[i - 1];
          return y1 === y0 ? l1 : l0 + ((y - y0) / (y1 - y0)) * (l1 - l0);
        }
      }
      return totalLength;
    }

    function render() {
      if (!totalLength) return;
      path.style.strokeDashoffset = totalLength - lengthAt(headY);
      dotY.forEach((y, i) => {
        const active = headY >= y;
        dots[i].classList.toggle(DOT_ACTIVE_CLASS, active);
        items[i].classList.toggle(VISIBLE_CLASS, active);
      });
    }

    function showAll() {
      headY = Infinity;
      render();
    }

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion || !gsap || !ScrollTrigger) {
      layout();
      showAll();
      window.addEventListener("resize", () => {
        layout();
        showAll();
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    grid.classList.add(READY_CLASS);
    layout();

    const progress = { value: 0 };
    gsap.to(progress, {
      value: 1,
      ease: "none",
      scrollTrigger: {
        trigger: canvas,
        start: `top ${HEAD_POSITION * 100}%`,
        end: `bottom ${HEAD_POSITION * 100}%`,
        scrub: SCRUB,
      },
      onUpdate: () => {
        headY = progress.value * height;
        render();
      },
    });

    // Recalcula quando a altura dos itens muda (resize, imagens, fontes)
    let lastHeight = grid.offsetHeight;
    let resizeTimer;
    new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        layout();
        if (grid.offsetHeight !== lastHeight) {
          lastHeight = grid.offsetHeight;
          ScrollTrigger.refresh();
        }
      }, 100);
    }).observe(grid);
  }

  if (window.Webflow && typeof Webflow.push === "function") {
    Webflow.push(init);
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
