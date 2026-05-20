(function () {
  var slider = document.querySelector(".hero-slider");
  if (!slider) return;

  var track = slider.querySelector(".hero-slider-track");
  if (!track) return;

  var slides = track.querySelectorAll(".hero-slide");
  var total = slides.length;
  if (total === 0) return;

  slider.style.setProperty("--slide-count", total);
  var perSlide = 100 / total;

  var dotsWrap = slider.querySelector(".hero-slider-dots");
  var dots = [];
  if (dotsWrap) {
    for (var i = 0; i < total; i++) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.className = "hero-slider-dot";
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", "切換到第 " + (i + 1) + " 張");
      dot.dataset.index = String(i);
      dotsWrap.appendChild(dot);
      dots.push(dot);
    }
    dotsWrap.addEventListener("click", function (e) {
      var t = e.target.closest(".hero-slider-dot");
      if (!t) return;
      goTo(Number(t.dataset.index));
      restart();
    });
  }

  var index = 0;
  var intervalMs = 5200;
  var timer = null;

  function applyActive() {
    slides.forEach(function (s, i) {
      s.classList.toggle("is-active", i === index);
    });
    dots.forEach(function (d, i) {
      d.classList.toggle("is-active", i === index);
      d.setAttribute("aria-selected", i === index ? "true" : "false");
    });
  }

  function goTo(i) {
    index = ((i % total) + total) % total;
    track.style.transform = "translateX(-" + (index * perSlide) + "%)";
    applyActive();
  }

  function next() { goTo(index + 1); }

  function start() {
    if (timer) return;
    timer = setInterval(next, intervalMs);
  }

  function stop() {
    if (!timer) return;
    clearInterval(timer);
    timer = null;
  }

  function restart() {
    stop();
    start();
  }

  slider.addEventListener("mouseenter", stop);
  slider.addEventListener("mouseleave", start);
  slider.addEventListener("focusin", stop);
  slider.addEventListener("focusout", start);
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stop(); else start();
  });

  applyActive();
  start();
})();
