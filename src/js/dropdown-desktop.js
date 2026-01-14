/**
 * Baoba - Dropdown Desktop (Produção)
 * Otimizado para performance e estabilidade
 */

(function() {
  'use strict'; 
  
  const DEV = window.location.hostname === 'localhost' || window.location.search.includes('debug');
  const DESKTOP_BREAKPOINT = 1024;
  
  let resizeTimeout;
  let dropdownInstance = null;
  
  function log(message) {
    if (DEV) console.log('Baoba:', message);
  }
  
  function isDesktop() {
    return window.innerWidth > DESKTOP_BREAKPOINT;
  }
  
  function createDropdownInstance() {
    const dropdownBtn = document.querySelector('.btn-dropdown');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const header = document.querySelector('.header-main');
    
    if (!dropdownBtn || !dropdownMenu) {
      log('Elementos do dropdown desktop não encontrados');
      return null;
    }
    
    return {
      btn: dropdownBtn,
      menu: dropdownMenu,
      header: header,
      
      close: function() {
        this.menu.classList.remove('active');
        this.btn.classList.remove('active');
        if (this.header) {
          this.header.classList.remove('dropdown-open');
        }
      },
      
      open: function() {
        this.menu.classList.add('active');
        this.btn.classList.add('active');
        if (this.header) {
          this.header.classList.add('dropdown-open');
        }
      },
      
      toggle: function() {
        if (this.menu.classList.contains('active')) {
          this.close();
        } else {
          this.open();
        }
      },
      
      setup: function() {
        const self = this;
        
        // Click handler
        function handleClick(e) {
          e.preventDefault();
          e.stopPropagation();
          self.toggle();
        }
        
        // Mouse leave handlers
        function handleMenuLeave() {
          self.close();
        }
        
        function handleBtnLeave() {
          setTimeout(() => {
            if (!self.menu.matches(':hover')) {
              self.close();
            }
          }, 100);
        }
        
        // Click outside handler
        function handleOutsideClick(e) {
          if (!e.target.closest('.btn-dropdown') && !e.target.closest('.dropdown-menu')) {
            self.close();
          }
        }
        
        // Remove existing listeners
        this.btn.removeEventListener('click', handleClick);
        this.menu.removeEventListener('mouseleave', handleMenuLeave);
        this.btn.removeEventListener('mouseleave', handleBtnLeave);
        document.removeEventListener('click', handleOutsideClick);
        
        // Add new listeners
        this.btn.addEventListener('click', handleClick);
        this.menu.addEventListener('mouseleave', handleMenuLeave);
        this.btn.addEventListener('mouseleave', handleBtnLeave);
        document.addEventListener('click', handleOutsideClick);
      }
    };
  }
  
  function initDesktopDropdown() {
    try {
      if (!isDesktop()) {
        if (dropdownInstance) {
          dropdownInstance.close();
          dropdownInstance = null;
        }
        return;
      }
      
      dropdownInstance = createDropdownInstance();
      if (dropdownInstance) {
        dropdownInstance.setup();
        log('Dropdown desktop inicializado');
      }
    } catch (error) {
      if (DEV) console.error('Erro ao inicializar dropdown desktop:', error);
    }
  }
  
  // Debounced resize handler
  function handleResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(initDesktopDropdown, 250);
  }
  
  // Initialize
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initDesktopDropdown);
    } else {
      initDesktopDropdown();
    }
    
    window.addEventListener('resize', handleResize);
  }
  
  init();
  
})();