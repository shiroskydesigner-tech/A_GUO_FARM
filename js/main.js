(function () {
  var el = document.getElementById("y");
  if (el) el.textContent = new Date().getFullYear();
})();

(function () {
  var btn = document.querySelector(".hamburger-btn");
  var overlay = document.getElementById("nav-overlay");
  if (!btn || !overlay) return;

  function openMenu() {
    overlay.setAttribute("aria-hidden", "false");
    btn.setAttribute("aria-expanded", "true");
    overlay.classList.add("is-open");
    document.body.classList.add("nav-open");
  }

  function closeMenu() {
    overlay.setAttribute("aria-hidden", "true");
    btn.setAttribute("aria-expanded", "false");
    overlay.classList.remove("is-open");
    document.body.classList.remove("nav-open");
  }

  btn.addEventListener("click", function () {
    if (overlay.classList.contains("is-open")) closeMenu();
    else openMenu();
  });

  overlay.addEventListener("click", function (e) {
    if (e.target.tagName === "A") closeMenu();
  });
})();

/* Reveal-on-scroll: tags common section types with .reveal, and
   also picks up any pre-existing .reveal / .reveal-stagger elements. */
(function () {
  var autoTargets = document.querySelectorAll(
    ".section, .page-title, .product-grid, .cart-list, .checkout-form"
  );
  autoTargets.forEach(function (el) { el.classList.add("reveal"); });

  var allTargets = document.querySelectorAll(".reveal, .reveal-stagger");
  if (!allTargets.length) return;

  if (!("IntersectionObserver" in window)) {
    allTargets.forEach(function (el) { el.classList.add("is-visible"); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

  allTargets.forEach(function (el) { io.observe(el); });
})();
