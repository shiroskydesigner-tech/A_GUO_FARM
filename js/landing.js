/* Landing-page only: parallax on hero, header state, sticky-bar polish. */
(function () {
  if (!document.body.classList.contains("landing")) return;

  /* ── Onload scroll-hint ───────────────────────────────────────────────
     Gently nudges the page down ~220px then drifts back to top with a
     custom easeInOutQuart curve — feels like a slow exhale/inhale rather
     than the browser's linear smooth-scroll. Aborts the moment the user
     takes control (wheel/touch/keydown). */
  (function scrollHint() {
    var aborted = false;
    function cancel() { aborted = true; }
    var opts = { passive: true, once: true };
    window.addEventListener("wheel", cancel, opts);
    window.addEventListener("touchstart", cancel, opts);
    window.addEventListener("keydown", cancel, opts);

    /* easeInOutQuart — slow start, slow end, organic settle */
    function ease(t) {
      return t < 0.5
        ? 8 * t * t * t * t
        : 1 - Math.pow(-2 * t + 2, 4) / 2;
    }

    function tween(toY, duration, done) {
      var fromY = window.scrollY || window.pageYOffset || 0;
      var dist = toY - fromY;
      if (Math.abs(dist) < 1) { if (done) done(); return; }
      var start = performance.now();

      function step(now) {
        if (aborted) return;
        var t = Math.min(1, (now - start) / duration);
        var y = fromY + dist * ease(t);
        window.scrollTo(0, y);
        if (t < 1) {
          requestAnimationFrame(step);
        } else if (done) {
          done();
        }
      }
      requestAnimationFrame(step);
    }

    setTimeout(function () {
      if (aborted || window.scrollY > 8) return;
      tween(220, 500, function () {
        setTimeout(function () {
          if (aborted) return;
          tween(0, 500);
        }, 600);
      });
    }, 900);
  })();

  var prefersReducedMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var header = document.querySelector("body.landing header");
  var heroSection = document.querySelector(".video-hero");
  var heroCopy = document.querySelector(".video-hero__copy");
  var heroVideo = document.querySelector(".video-hero__video");
  var heroVeil = document.querySelector(".video-hero__veil");
  /* Stage media parallax was disabled — images now show at natural size
     (no crop) so we can't drift them without revealing empty container. */
  var stageMedia = [];

  /* Per-section parallax layers: [element, speed]
     speed > 0 → element moves slower than scroll (drifts down as page scrolls up)
     speed < 0 → element moves faster than scroll (drifts up)
     Magnitude is intentionally small for a subtle, tasteful effect. */
  var parallaxLayers = [];
  (function collectParallaxLayers() {
    var stages = document.querySelectorAll(".stage");
    for (var i = 0; i < stages.length; i++) {
      var media = stages[i].querySelector(".stage__media");
      var copy = stages[i].querySelector(".stage__copy");
      if (media) parallaxLayers.push([media, -0.06]);
      if (copy) parallaxLayers.push([copy, 0.05]);
    }
    var profileGrid = document.querySelector(".profile__grid");
    if (profileGrid) parallaxLayers.push([profileGrid, -0.05]);
    var profileTitle = document.querySelector(".profile__title");
    if (profileTitle) parallaxLayers.push([profileTitle, 0.04]);
    var closingTitle = document.querySelector(".closing__title");
    if (closingTitle) parallaxLayers.push([closingTitle, -0.05]);
    var closingMark = document.querySelector(".closing__mark");
    if (closingMark) parallaxLayers.push([closingMark, 0.04]);
    for (var j = 0; j < parallaxLayers.length; j++) {
      parallaxLayers[j][0].style.willChange = "transform";
    }
  })();

  var lastY = -1;
  var ticking = false;

  function update() {
    var y = window.scrollY || window.pageYOffset;
    var vh = window.innerHeight;

    /* Header state: solid after first 40px scroll */
    if (header) {
      if (y > 40) header.classList.add("is-scrolled");
      else header.classList.remove("is-scrolled");
    }

    /* Body class: switch nav colour once past the hero */
    if (heroSection) {
      var heroBottom = heroSection.offsetHeight - 80;
      if (y > heroBottom) {
        document.body.classList.add("scrolled-past-hero");
      } else {
        document.body.classList.remove("scrolled-past-hero");
      }
    }

    /* Hero parallax (skip if reduced motion preferred) */
    if (!prefersReducedMotion && heroCopy && heroSection) {
      var progress = Math.min(y / vh, 1);
      heroCopy.style.transform =
        "translate3d(0," + (y * 0.42) + "px,0)";
      heroCopy.style.opacity = String(Math.max(0, 1 - progress * 1.15));
      if (heroVideo) {
        heroVideo.style.transform =
          "translate3d(0," + (y * 0.18) + "px,0) scale(" +
          (1 + progress * 0.06) + ")";
      }
      if (heroVeil) {
        heroVeil.style.opacity = String(0.85 + progress * 0.4);
      }
    }

    /* Per-section parallax: drift each layer based on its distance from
       viewport center. Only elements within viewport are updated. */
    if (!prefersReducedMotion) {
      for (var p = 0; p < parallaxLayers.length; p++) {
        var layer = parallaxLayers[p][0];
        var speed = parallaxLayers[p][1];
        var lr = layer.getBoundingClientRect();
        if (lr.bottom < -100 || lr.top > vh + 100) continue;
        var layerCenter = lr.top + lr.height / 2;
        var delta = (layerCenter - vh / 2) * speed;
        layer.style.transform = "translate3d(0," + delta.toFixed(2) + "px,0)";
      }
    }

    /* Subtle drift on stage images while in viewport */
    if (!prefersReducedMotion) {
      for (var i = 0; i < stageMedia.length; i++) {
        var img = stageMedia[i];
        var parent = img.parentElement;
        var rect = parent.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > vh) continue;
        /* normalize to -1 (entering) .. 1 (leaving) */
        var center = rect.top + rect.height / 2;
        var norm = (center - vh / 2) / vh;
        var translate = norm * -28;
        img.style.transform = "translate3d(0," + translate + "px,0)";
      }
    }

    ticking = false;
    lastY = y;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  update();
})();

/* Smooth-scroll for in-page anchor links */
(function () {
  if (!document.body.classList.contains("landing")) return;
  document.addEventListener("click", function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var hash = a.getAttribute("href");
    if (!hash || hash === "#") return;
    var target = document.querySelector(hash);
    if (!target) return;
    e.preventDefault();
    var headerH = 64;
    var top = target.getBoundingClientRect().top + window.scrollY - headerH;
    window.scrollTo({ top: top, behavior: "smooth" });
    /* Close mobile nav if open */
    var overlay = document.getElementById("nav-overlay");
    if (overlay && overlay.classList.contains("is-open")) {
      overlay.classList.remove("is-open");
      overlay.setAttribute("aria-hidden", "true");
      document.body.classList.remove("nav-open");
      var btn = document.querySelector(".hamburger-btn");
      if (btn) btn.setAttribute("aria-expanded", "false");
    }
  });
})();

/* Year stamp */
(function () {
  var el = document.getElementById("y");
  if (el) el.textContent = new Date().getFullYear();
})();
