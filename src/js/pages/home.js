// Baoba - Página Home
// Arquivo: src/js/pages/home.js

// Código específico da página home
document.addEventListener('DOMContentLoaded', function() {
  console.log('Baobá - Home page carregada!');
  
  // Inicializar hero section
  initHeroSection();
  
  // Inicializar produtos slider
  initProdutosSlider();
  
  // Inicializar animações
  initAnimations();
});

// Hero section
function initHeroSection() {
  const heroSection = document.querySelector('.hero-section');
  
  if (heroSection) {
    // Adicionar efeito parallax suave
    window.addEventListener('scroll', window.BRMotoSport.throttle(() => {
      const scrolled = window.pageYOffset;
      const parallax = heroSection.querySelector('.hero-bg');
      
      if (parallax) {
        parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
      }
    }, 16));
  }
}

// Slider de produtos (se necessário)
function initProdutosSlider() {
  const slider = document.querySelector('.swiper-produtos');
  
  if (slider && typeof Swiper !== 'undefined') {
    new Swiper('.swiper-produtos', {
      slidesPerView: 'auto',
      centeredSlides: true,
      spaceBetween: 30,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        }
      }
    });
  }
}

// Animações na página
function initAnimations() {
  const animatedElements = document.querySelectorAll('.fade-in-up');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
      }
    });
  });
  
  animatedElements.forEach(el => observer.observe(el));
}
