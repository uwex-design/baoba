/**
 * Baoba - Código Comum
 * Arquivo: src/js/common.js
 */

(() => {
  "use strict";

  // Configurações
  const CONFIG = {
    SELECTORS: {
      menuToggle: ".menu-toggle",
      mobileMenu: ".mobile-menu",
      internalLinks: 'a[href^="#"]',
    },
    CLASSES: {
      loaded: "loaded",
      menuOpen: "menu-open",
      active: "active",
    },
  };

  /**
   * Inicializa lazy loading se disponível
   */
  function initLazyLoad() {
    if (window.BRMotoSport?.lazyLoad) {
      window.BRMotoSport.lazyLoad();
    }
  }

  /**
   * Inicializa menu mobile (se existir)
   */
  function initMobileMenu() {
    const menuToggle = document.querySelector(CONFIG.SELECTORS.menuToggle);
    const mobileMenu = document.querySelector(CONFIG.SELECTORS.mobileMenu);

    if (menuToggle && mobileMenu) {
      menuToggle.addEventListener("click", () => {
        mobileMenu.classList.toggle(CONFIG.CLASSES.active);
        menuToggle.classList.toggle(CONFIG.CLASSES.active);
        document.body.classList.toggle(CONFIG.CLASSES.menuOpen);
      });
    }
  }

  /**
   * Inicializa smooth scroll para links internos
   */
  function initSmoothScroll() {
    const internalLinks = document.querySelectorAll(
      CONFIG.SELECTORS.internalLinks
    );

    internalLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const target = this.getAttribute("href");

        if (window.BRMotoSport?.smoothScroll) {
          window.BRMotoSport.smoothScroll(target);
        }
      });
    });
  }

  /**
   * Inicialização principal
   */
  function init() {
    // Adicionar classe loaded ao body
    document.body.classList.add(CONFIG.CLASSES.loaded);

    // Inicializar funcionalidades
    initLazyLoad();
    initMobileMenu();
    initSmoothScroll();

    // Inicializar Swiper se disponível
    initSwiperMarcas();
  }

  /**
   * Inicializa Swiper das marcas (se disponível)
   */
  function initSwiperMarcas() {
    if (typeof Swiper !== "undefined") {
      const swiperMarcas = document.querySelector(".swiper.swiper-marcas");

      if (swiperMarcas) {
        new Swiper(".swiper.swiper-marcas", {
          slidesPerView: 1.5,
          spaceBetween: 0,
        });
      }
    }
  }

  // Inicialização
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    setTimeout(init, 100);
  }
})();
