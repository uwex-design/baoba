/**
 * Baoba - Dropdown Mobile
 * Arquivo: src/js/dropdown-mobile.js
 */

(function() {
    'use strict';
    
    const MOBILE_BREAKPOINT = 991;
    
    let resizeTimeout;
    let mobileInstance = null;
    
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
      const btn = document.querySelector('.btn-dropdown');
      const dropdownPai = document.querySelector('.dropdown_pai');
      const navMenu = document.querySelector('.nav_menu');
      const menuToggle = document.querySelector('.w-nav-button');
      
      if (!btn || !dropdownPai || !navMenu) return null;
      
      const menuItems = dropdownPai.querySelectorAll('.dropdown_menu_item');
      if (menuItems.length === 0) return null;
      
      const mobileSubmenu = document.createElement('div');
      mobileSubmenu.className = 'dropdown-mobile-submenu';
      
      return {
        btn: btn,
        mobileSubmenu: mobileSubmenu,
        dropdownPai: dropdownPai,
        menuToggle: menuToggle,
        
        open: function() {
          this.mobileSubmenu.classList.add('active');
          this.btn.classList.add('active');
        },
        
        close: function() {
          this.mobileSubmenu.classList.remove('active');
          this.btn.classList.remove('active');
        },
        
        toggle: function() {
          if (this.mobileSubmenu.classList.contains('active')) {
            this.close();
          } else {
            this.open();
          }
        },
        
        setup: function() {
          const self = this;
          
          // Clona os itens do menu
          menuItems.forEach(item => {
            const link = item.cloneNode(true);
            link.classList.remove('active');
            this.mobileSubmenu.appendChild(link);
          });
          
          // Insere submenu após o botão
          this.btn.insertAdjacentElement('afterend', this.mobileSubmenu);
          
          // Esconde dropdown original no mobile
          this.dropdownPai.style.display = 'none';
          
          // IMPORTANTE: Garante que começa FECHADO
          this.close();
          
          // Click handler no botão
          this.btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            self.toggle();
          });
          
          // Observer para fechar quando o menu mobile fechar
          if (this.menuToggle) {
            const observer = new MutationObserver(function(mutations) {
              mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'class') {
                  const isMenuOpen = self.menuToggle.classList.contains('w--open');
                  if (!isMenuOpen) {
                    self.close();
                  }
                }
              });
            });
            
            observer.observe(this.menuToggle, {
              attributes: true,
              attributeFilter: ['class']
            });
          }
        },
        
        cleanup: function() {
          if (this.mobileSubmenu && this.mobileSubmenu.parentNode) {
            this.mobileSubmenu.remove();
          }
          if (this.dropdownPai) {
            this.dropdownPai.style.display = '';
          }
          this.close();
        }
      };
    }
    
    function setupMobileDropdown() {
      if (!isMobile()) {
        cleanupMobileInstance();
        return;
      }
      
      cleanupMobileInstance();
      mobileInstance = createMobileInstance();
      
      if (mobileInstance) {
        mobileInstance.setup();
      }
    }
    
    function handleOutsideClick(e) {
      if (!isMobile() || !mobileInstance) return;
      
      if (!e.target.closest('.btn-dropdown') && !e.target.closest('.dropdown-mobile-submenu')) {
        mobileInstance.close();
      }
    }
    
    function handleResize() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(setupMobileDropdown, 250);
    }
    
    function init() {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupMobileDropdown);
      } else {
        setTimeout(setupMobileDropdown, 100);
      }
      
      window.addEventListener('resize', handleResize);
      document.addEventListener('click', handleOutsideClick);
    }
    
    init();
    
  })();