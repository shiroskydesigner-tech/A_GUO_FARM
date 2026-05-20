(function () {
  var config = {
    date: {
      start: { year: 2026, month: 5, day: 25 },
      end:   { year: 2026, month: 6, day: 10 }
    },
    temp: 30,
    humidity: 40,
    duration: 1200
  };

  function animateValue(el, from, to, duration, suffix) {
    if (!el) return;
    suffix = suffix || "";
    var start = typeof performance !== "undefined" ? performance.now() : Date.now();
    function step(now) {
      var elapsed = (typeof performance !== "undefined" ? performance.now() : Date.now()) - start;
      var t = Math.min(elapsed / duration, 1);
      var ease = 1 - Math.pow(1 - t, 2);
      var val = Math.round(from + (to - from) * ease);
      el.textContent = val + suffix;
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function run() {
    var dateEl = document.getElementById("weather-date");
    var tempEl = document.getElementById("weather-temp");
    var humidityEl = document.getElementById("weather-humidity");

    if (dateEl && config.date) {
      var s = config.date.start, e = config.date.end;
      dateEl.textContent = s.month + "/" + s.day + " – " + e.month + "/" + e.day;
    }

    if (tempEl) {
      tempEl.textContent = "0";
      animateValue(tempEl, 0, config.temp, config.duration, "");
    }

    if (humidityEl) {
      humidityEl.textContent = "0";
      animateValue(humidityEl, 0, config.humidity, config.duration, "");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
