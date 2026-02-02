/**
 * Baoba - Dropdown Desktop
 * Arquivo: src/js/dropdown-desktop.js
 */

(function () {
  "use strict";

  const DESKTOP_BREAKPOINT = 991;

  let desktopInstance = null;
  let resizeTimeout;

  function isDesktop() {
    return window.innerWidth > DESKTOP_BREAKPOINT;
  }

  function cleanupDesktopInstance() {
    if (desktopInstance) {
      desktopInstance.cleanup();
      desktopInstance = null;
    }
  }

  function createDesktopInstance() {
    const btn = document.querySelector(".btn-dropdown");
    const dropdown = document.querySelector(".dropdown_pai");
    const header = document.querySelector("#js-header");

    if (!btn || !dropdown) return null;

    const menuItems = dropdown.querySelectorAll(".dropdown_menu_item");
    const mediaItems = dropdown.querySelectorAll(".dropdown_media_item");

    return {
      btn: btn,
      dropdown: dropdown,
      header: header,
      menuItems: menuItems,
      mediaItems: mediaItems,
      clickHandler: null,
      outsideClickHandler: null,

      open: function () {
        this.dropdown.classList.add("active");
        this.btn.classList.add("active");
        if (this.header) this.header.classList.add("dropdown-open");
      },

      close: function () {
        this.dropdown.classList.remove("active");
        this.btn.classList.remove("active");
        if (this.header) this.header.classList.remove("dropdown-open");
      },

      toggle: function () {
        if (this.dropdown.classList.contains("active")) {
          this.close();
        } else {
          this.open();
        }
      },

      setup: function () {
        const self = this;

        // Click handler no botão
        this.clickHandler = function (e) {
          e.preventDefault();
          e.stopPropagation();
          self.toggle();
        };

        // Outside click handler
        this.outsideClickHandler = function (e) {
          if (
            !e.target.closest(".btn-dropdown") &&
            !e.target.closest(".dropdown_pai")
          ) {
            self.close();
          }
        };

        // Adiciona eventos
        this.btn.addEventListener("click", this.clickHandler);
        document.addEventListener("click", this.outsideClickHandler);

        // Hover nos itens do menu
        this.menuItems.forEach(function (item, index) {
          item.addEventListener("mouseenter", function () {
            self.mediaItems.forEach(function (media, i) {
              media.classList.toggle("active", i === index);
            });
            self.menuItems.forEach(function (i) {
              i.classList.remove("active");
            });
            item.classList.add("active");
          });
        });

        // Ativa primeiro item por padrão
        if (this.mediaItems.length > 0)
          this.mediaItems[0].classList.add("active");
        if (this.menuItems.length > 0)
          this.menuItems[0].classList.add("active");
      },

      cleanup: function () {
        if (this.clickHandler) {
          this.btn.removeEventListener("click", this.clickHandler);
        }
        if (this.outsideClickHandler) {
          document.removeEventListener("click", this.outsideClickHandler);
        }
        this.close();
      },
    };
  }

  function setupDesktopDropdown() {
    if (!isDesktop()) {
      cleanupDesktopInstance();
      return;
    }

    cleanupDesktopInstance();
    desktopInstance = createDesktopInstance();

    if (desktopInstance) {
      desktopInstance.setup();
    }
  }

  function handleResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(setupDesktopDropdown, 250);
  }

  function init() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", setupDesktopDropdown);
    } else {
      setTimeout(setupDesktopDropdown, 100);
    }

    window.addEventListener("resize", handleResize);
  }

  init();
})();
