document.addEventListener("DOMContentLoaded", function () {
  // Header fixed
  const header = document.getElementById("js-header");
  if (header) {
    function fixedMenu() {
      if (window.pageYOffset > 96) {
        header.classList.add("fixed-menu");
      } else {
        header.classList.remove("fixed-menu");
      }
    }
    window.addEventListener("scroll", fixedMenu);
  }

  // Swiper Locais
  document.querySelectorAll(".locais_row").forEach((row) => {
    const thumb = row.querySelector(".swiper-thumb-locais");
    const main = row.querySelector(".swiper-locais");
    const next = row.querySelector(".next-locais");
    const prev = row.querySelector(".prev-locais");

    if (!thumb || !main) return;

    const swiperThumb = new Swiper(thumb, {
      loop: false,
      spaceBetween: 10,
      slidesPerView: 1,
      freeMode: true,
      watchSlidesProgress: true,
      slideToClickedSlide: false,
      speed: 400,
      allowTouchMove: false,
      autoplay: false,
    });

    new Swiper(main, {
      loop: false,
      spaceBetween: 10,
      speed: 650,
      navigation: {
        nextEl: next,
        prevEl: prev,
      },
      autoplay: {
        delay: 5000,
      },
      on: {
        init: function () {
          if (this.slides.length > 1) {
            swiperThumb.slideTo(1, 0);
          }
        },
        slideChange: function () {
          const currentIndex = this.activeIndex;
          const totalSlides = this.slides.length;

          if (currentIndex < totalSlides - 1) {
            swiperThumb.slideTo(currentIndex + 1, 400);
          } else {
            swiperThumb.slideTo(0, 400);
          }
        },
      },
    });
  });
});