(function () {
  var WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];
  var MONTH_NAMES = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];

  window.HARVEST_CALENDAR_CONFIG = {
    firstHarvest: { year: 2025, month: 6, day: 15 }
  };

  function isSameDay(y, m, d, ref) {
    return ref && ref.year === y && ref.month === m && ref.day === d;
  }

  function renderCalendar(container, year, month, firstHarvest) {
    if (!container) return;

    var first = new Date(year, month - 1, 1);
    var last = new Date(year, month, 0);
    var startDay = first.getDay();
    var daysInMonth = last.getDate();

    var prevMonth = month === 1 ? 12 : month - 1;
    var prevYear = month === 1 ? year - 1 : year;
    var prevLast = new Date(prevYear, prevMonth, 0);
    var daysPrev = prevLast.getDate();

    var cells = [];
    var i, d, isOther, isFirst;

    for (i = 0; i < startDay; i++) {
      d = daysPrev - startDay + i + 1;
      cells.push({ day: d, other: true, firstHarvest: false });
    }
    for (d = 1; d <= daysInMonth; d++) {
      isFirst = isSameDay(year, month, d, firstHarvest);
      cells.push({ day: d, other: false, firstHarvest: isFirst });
    }
    var remaining = 42 - cells.length;
    for (i = 0; i < remaining; i++) {
      cells.push({ day: i + 1, other: true, firstHarvest: false });
    }

    var monthEl = container.querySelector(".calendar-month");
    if (monthEl) monthEl.textContent = year + "年 " + MONTH_NAMES[month - 1];

    var weekdaysEl = container.querySelector(".calendar-weekdays");
    if (weekdaysEl) {
      weekdaysEl.innerHTML = WEEKDAYS.map(function (w) {
        return "<span>" + w + "</span>";
      }).join("");
    }

    var daysEl = container.querySelector(".calendar-days");
    if (!daysEl) return;
    daysEl.innerHTML = cells.slice(0, 42).map(function (cell) {
      var cls = "calendar-day";
      if (cell.other) cls += " other-month";
      if (cell.firstHarvest) cls += " first-harvest";
      return "<div class=\"" + cls + "\">" + cell.day + "</div>";
    }).join("");
  }

  function init() {
    var container = document.getElementById("harvest-calendar");
    if (!container) return;

    var cfg = window.HARVEST_CALENDAR_CONFIG || {};
    var firstHarvest = cfg.firstHarvest;

    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;

    var prevBtn = container.querySelector(".calendar-prev");
    var nextBtn = container.querySelector(".calendar-next");

    function go() {
      renderCalendar(container, year, month, firstHarvest);
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        month--;
        if (month < 1) { month = 12; year--; }
        go();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        month++;
        if (month > 12) { month = 1; year++; }
        go();
      });
    }

    go();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
