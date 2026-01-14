/**
 * Baoba - Dropdown Mobile (Produção)
 * Otimizado para performance e estabilidade
 */

(function() {
  'use strict';
  
  const DEV = window.location.hostname === 'localhost' || window.location.search.includes('debug');
  const MOBILE_BREAKPOINT = 1024;
  
  let resizeTimeout;
  let headerObserver = null;
  let mobileInstance = null;
  
  const config = {
    triggerClass: '.btn-dropdown',
    submenuId: 'mega-menu',
    headerSelector: '.header-main',
    menuToggleSelector: '.menu-hamburger',
    activeClass: 'w--open',
    headerActiveClass: 'mobile-menu-active'
  };
  
  function log(message) {
    if (DEV) console.log('Baoba Mobile:', message);
  }
  
  function isMobile() {
    return window.innerWidth <= MOBILE_BREAKPOINT;
  }
  
  function cleanupMobileInstance() {
    if (mobileInstance) {
      mobileInstance.cleanup();
      mobileInstance = null;
    }
  }
  
  function createMobileInstance() {
    const triggerLi = document.querySelector(`li:has(${config.triggerClass})`);
    const submenu = document.querySelector(`#${config.submenuId} .dropdown-menu-list`);
    
    if (!triggerLi || !submenu) {
      log('Elementos do dropdown mobile não encontrados');
      return null;
    }
    
    return {
      triggerLi: triggerLi,
      submenu: submenu,
      
      open: function() {
        this.submenu.style.cssText = '';
        this.submenu.setAttribute('aria-hidden', 'false');
        this.submenu.classList.add('active');
        this.triggerLi.classList.add('active');
      },
      
      close: function() {
        this.submenu.style.cssText = `
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
        `;
        this.submenu.classList.remove('active');
        this.submenu.setAttribute('aria-hidden', 'true');
        this.triggerLi.classList.remove('active');
      },
      
      setup: function() {
        const self = this;
        
        // Move submenu into LI
        this.triggerLi.appendChild(this.submenu);
        
        // Prevent bubbling on links
        const submenuLinks = this.submenu.querySelectorAll('a');
        submenuLinks.forEach(link => {
          link.addEventListener('click', (e) => e.stopPropagation());
        });
        
        // Click handler
        function handleClick(e) {
          if (!e.target.closest('.dropdown-menu-list a')) {
            e.preventDefault();
            e.stopPropagation();
            self.triggerLi.classList.contains('active') ? self.close() : self.open();
          }
        }
        
        // Remove existing listeners
        this.triggerLi.removeEventListener('click', handleClick);
        
        // Add new listener
        this.triggerLi.addEventListener('click', handleClick);
      },
      
      cleanup: function() {
        // Restore submenu to original position if needed
        const originalContainer = document.querySelector(`#${config.submenuId}`);
        if (originalContainer && this.submenu.parentNode === this.triggerLi) {
          originalContainer.querySelector('.dropdown-menu-wrap').appendChild(this.submenu);
        }
      }
    };
  }
  
  function setupHeaderObserver() {
    try {
      if (!isMobile()) {
        if (headerObserver) {
          headerObserver.disconnect();
          headerObserver = null;
        }
        return;
      }
      
      const header = document.querySelector(config.headerSelector);
      const menuToggle = document.querySelector(config.menuToggleSelector);
      
      if (!header || !menuToggle) {
        log('Elementos do header mobile não encontrados');
        return;
      }
      
      if (headerObserver) {
        headerObserver.disconnect();
      }
      
      headerObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            const isMenuOpen = menuToggle.classList.contains(config.activeClass);
            header.classList.toggle(config.headerActiveClass, isMenuOpen);
          }
        });
      });
      
      headerObserver.observe(menuToggle, {
        attributes: true,
        attributeFilter: ['class']
      });
      
      // Check initial state
      header.classList.toggle(config.headerActiveClass, menuToggle.classList.contains(config.activeClass));
      
      log('Header observer configurado');
    } catch (error) {
      if (DEV) console.error('Erro ao configurar header observer:', error);
    }
  }
  
  function setupMobileDropdown() {
    try {
      if (!isMobile()) {
        cleanupMobileInstance();
        return;


      }
      
      cleanupMobileInstance();
      mobileInstance = createMobileInstance();
      
      if (mobileInstance) {
        mobileInstance.setup();
        log('Dropdown mobile inicializado');
      }
    } catch (error) {
      if (DEV) console.error('Erro ao inicializar dropdown mobile:', error);
    }
  }
  
  function handleOutsideClick(e) {
    if (!isMobile() || !mobileInstance) return;
    
    if (!e.target.closest(`li:has(${config.triggerClass})`)) {
      mobileInstance.close();
    }
  }
  
  function handleResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      cleanupMobileInstance();
      setupHeaderObserver();
      setupMobileDropdown();
    }, 250);
  }
  
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setupHeaderObserver();
        setupMobileDropdown();
      });
    } else {
      setTimeout(() => {
        setupHeaderObserver();
        setupMobileDropdown();
      }, 100);
    }
    
    window.addEventListener('resize', handleResize);
    document.addEventListener('click', handleOutsideClick);
  }
  
  init();
  
})();