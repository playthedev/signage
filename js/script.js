(function () {
  "use strict";

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky header on scroll ---------- */
  var header = document.getElementById("siteHeader");
  function onScrollHeader() {
    if (window.scrollY > 40) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  }
  onScrollHeader();
  window.addEventListener("scroll", onScrollHeader, { passive: true });

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById("navToggle");
  navToggle.addEventListener("click", function () {
    var isOpen = header.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    navToggle.innerHTML = isOpen
      ? '<svg><use href="#ic-close"/></svg>'
      : '<svg><use href="#ic-menu"/></svg>';
  });
  document.querySelectorAll(".nav a").forEach(function (link) {
    link.addEventListener("click", function () {
      header.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.innerHTML = '<svg><use href="#ic-menu"/></svg>';
    });
  });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Gallery filter ---------- */
  var filterButtons = document.querySelectorAll(".filter-btn");
  var galleryItems = document.querySelectorAll(".g-item");

  function applyFilter(filter) {
    galleryItems.forEach(function (item) {
      var match = filter === "all" || item.dataset.cat === filter;
      item.classList.toggle("hide", !match);
      if (match) {
        requestAnimationFrame(function () { item.classList.add("show"); });
      } else {
        item.classList.remove("show");
      }
    });
  }
  filterButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterButtons.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      applyFilter(btn.dataset.filter);
    });
  });
  // initial state: show all
  galleryItems.forEach(function (item) { item.classList.add("show"); });

  /* ---------- Lightbox ---------- */
  var lightbox = document.getElementById("lightbox");
  var lbImg = document.getElementById("lbImg");
  var lbCaption = document.getElementById("lbCaption");
  var lbClose = document.getElementById("lbClose");
  var lbPrev = document.getElementById("lbPrev");
  var lbNext = document.getElementById("lbNext");
  var currentIndex = 0;
  var visibleItems = [];

  function getVisibleItems() {
    return Array.prototype.filter.call(galleryItems, function (item) {
      return !item.classList.contains("hide");
    });
  }

  function openLightbox(index) {
    visibleItems = getVisibleItems();
    if (!visibleItems.length) return;
    currentIndex = (index + visibleItems.length) % visibleItems.length;
    var item = visibleItems[currentIndex];
    var img = item.querySelector("img");
    var caption = item.querySelector("figcaption");
    lbImg.src = img.src;
    lbImg.alt = img.alt || "";
    lbCaption.innerHTML = caption ? caption.innerHTML : "";
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
  }

  galleryItems.forEach(function (item) {
    item.addEventListener("click", function () {
      var visIdx = getVisibleItems().indexOf(item);
      openLightbox(visIdx);
    });
  });

  lbClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  lbPrev.addEventListener("click", function () { openLightbox(currentIndex - 1); });
  lbNext.addEventListener("click", function () { openLightbox(currentIndex + 1); });

  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") openLightbox(currentIndex - 1);
    if (e.key === "ArrowRight") openLightbox(currentIndex + 1);
  });

  /* ---------- Back to top ---------- */
  var toTop = document.getElementById("toTop");
  window.addEventListener(
    "scroll",
    function () {
      toTop.classList.toggle("show", window.scrollY > 600);
    },
    { passive: true }
  );
  toTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();
