/*
  Splash intro loader.
  Plays every frame in sequence at a fixed FPS — never skips, regardless of load speed.
  After the sequence finishes, the splash holds on the last frame until critical
  assets have also finished loading, then fades out (with a hard timeout as safety).
*/
(function () {
  var TOTAL_FRAMES = 24;
  var FPS = 12;
  var FRAME_INTERVAL = 1000 / FPS;
  var TOTAL_DURATION = TOTAL_FRAMES * FRAME_INTERVAL;
  var HOLD_AFTER = 240;
  var MAX_DURATION = 9000;
  var FADE_DURATION = 900;

  var splash = document.getElementById("splash");
  var frameEl = document.getElementById("splash-frame");
  var progressEl = document.getElementById("splash-progress");
  if (!splash || !frameEl) return;

  function pad3(n) {
    n = String(n);
    while (n.length < 3) n = "0" + n;
    return n;
  }

  function framePath(i) {
    return "04_mp4/frame_" + pad3(i) + ".jpg";
  }

  /* Preload all frames + critical homepage assets so the rapid <img src> swaps
     don't cause flicker and the page is ready when the splash exits. */
  var critical = [];
  for (var i = 1; i <= TOTAL_FRAMES; i++) critical.push(framePath(i));
  critical.push(
    "images/Slider/slide-1.jpg",
    "images/Slider/slide-2.jpg",
    "images/Slider/slide-3.jpg",
    "images/Slider/slide-4.jpg",
    "images/background/bg.jpg",
    "images/logo/logo.svg"
  );
  var total = critical.length;
  var loaded = 0;
  var cache = [];

  critical.forEach(function (url) {
    var img = new Image();
    img.onload = img.onerror = function () { loaded++; };
    img.src = url;
    cache.push(img);
  });

  var startTime = performance.now();
  var lastFrameShown = -1;
  var animationDone = false;
  var finished = false;
  var rafId;

  function setFrame(n) {
    if (n === lastFrameShown) return;
    lastFrameShown = n;
    frameEl.src = framePath(n);
  }

  function updateProgress(p) {
    if (!progressEl) return;
    progressEl.style.setProperty("--p", (Math.min(p, 1) * 100).toFixed(1) + "%");
  }

  function tick(now) {
    var elapsed = now - startTime;

    if (!animationDone) {
      /* While the animation is running, advance frame strictly by elapsed time
         so every frame appears (no skipping) and the pace is constant. */
      var idx = Math.min(Math.floor(elapsed / FRAME_INTERVAL) + 1, TOTAL_FRAMES);
      setFrame(idx);
      updateProgress(idx / TOTAL_FRAMES);

      if (elapsed >= TOTAL_DURATION) {
        setFrame(TOTAL_FRAMES);
        updateProgress(1);
        animationDone = true;
      }
    }

    if (animationDone) {
      var assetsReady = loaded >= total;
      var heldLongEnough = elapsed >= TOTAL_DURATION + HOLD_AFTER;
      var timedOut = elapsed >= MAX_DURATION;
      if ((assetsReady && heldLongEnough) || timedOut) {
        finish();
        return;
      }
    }

    rafId = requestAnimationFrame(tick);
  }

  function finish() {
    if (finished) return;
    finished = true;
    cancelAnimationFrame(rafId);
    splash.classList.add("is-hidden");
    document.body.classList.remove("splash-active");
    window.dispatchEvent(new CustomEvent("splash:done"));
    setTimeout(function () {
      if (splash.parentNode) splash.parentNode.removeChild(splash);
    }, FADE_DURATION + 100);
  }

  /* Reduced-motion: skip the per-frame animation, hold a mid-frame, just wait
     for assets, then fade. */
  var reduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduced) {
    setFrame(Math.round(TOTAL_FRAMES / 2));
    updateProgress(1);
    var poll = setInterval(function () {
      var elapsed = performance.now() - startTime;
      if ((loaded >= total && elapsed >= 600) || elapsed >= MAX_DURATION) {
        clearInterval(poll);
        finish();
      }
    }, 100);
    return;
  }

  rafId = requestAnimationFrame(tick);
})();
