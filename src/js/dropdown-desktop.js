/**
 * Baoba - Dropdown Desktop
 * Arquivo: src/js/dropdown-desktop.js
 */

document.addEventListener("DOMContentLoaded", function () {
  const btn = document.querySelector(".btn-dropdown");
  const dropdown = document.querySelector(".dropdown_pai");
  const header = document.querySelector("#js-header");

  if (!btn || !dropdown) return;

  const menuItems = dropdown.querySelectorAll(".dropdown_menu_item");
  const mediaItems = dropdown.querySelectorAll(".dropdown_media_item");

  btn.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    dropdown.classList.toggle("active");
    btn.classList.toggle("active");
    if (header) header.classList.toggle("dropdown-open");
  });

  document.addEventListener("click", function (e) {
    if (
      !e.target.closest(".btn-dropdown") &&
      !e.target.closest(".dropdown_pai")
    ) {
      dropdown.classList.remove("active");
      btn.classList.remove("active");
      if (header) header.classList.remove("dropdown-open");
    }
  });

  menuItems.forEach(function (item, index) {
    item.addEventListener("mouseenter", function () {
      mediaItems.forEach(function (media, i) {
        media.classList.toggle("active", i === index);
      });
      menuItems.forEach(function (i) {
        i.classList.remove("active");
      });
      item.classList.add("active");
    });
  });

  if (mediaItems.length > 0) mediaItems[0].classList.add("active");
  if (menuItems.length > 0) menuItems[0].classList.add("active");
});
