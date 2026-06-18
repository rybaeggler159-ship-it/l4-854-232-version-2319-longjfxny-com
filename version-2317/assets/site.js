(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  ready(function () {
    var toggle = document.querySelector(".menu-toggle");
    var nav = document.querySelector(".main-nav");
    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        var opened = nav.classList.toggle("open");
        toggle.setAttribute("aria-expanded", opened ? "true" : "false");
      });
    }

    var slider = document.querySelector("[data-hero-slider]");
    if (slider) {
      var slides = Array.prototype.slice.call(slider.querySelectorAll(".hero-slide"));
      var dots = Array.prototype.slice.call(slider.querySelectorAll(".hero-dot"));
      var prev = slider.querySelector("[data-hero-prev]");
      var next = slider.querySelector("[data-hero-next]");
      var current = 0;
      var timer = null;

      function show(index) {
        if (!slides.length) {
          return;
        }
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
          slide.classList.toggle("active", i === current);
        });
        dots.forEach(function (dot, i) {
          dot.classList.toggle("active", i === current);
        });
      }

      function restart() {
        if (timer) {
          window.clearInterval(timer);
        }
        timer = window.setInterval(function () {
          show(current + 1);
        }, 5200);
      }

      dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
          show(Number(dot.getAttribute("data-slide")) || 0);
          restart();
        });
      });

      if (prev) {
        prev.addEventListener("click", function () {
          show(current - 1);
          restart();
        });
      }

      if (next) {
        next.addEventListener("click", function () {
          show(current + 1);
          restart();
        });
      }

      show(0);
      restart();
    }

    var search = document.querySelector("[data-movie-search]");
    var grid = document.querySelector("[data-movie-grid]");
    var filterRow = document.querySelector("[data-filter-row]");
    var activeFilter = "all";

    function applyFilters() {
      if (!grid) {
        return;
      }
      var query = search ? search.value.trim().toLowerCase() : "";
      var cards = Array.prototype.slice.call(grid.querySelectorAll(".movie-card"));
      cards.forEach(function (card) {
        var haystack = [
          card.getAttribute("data-title") || "",
          card.getAttribute("data-genre") || "",
          card.getAttribute("data-tags") || "",
          card.getAttribute("data-year") || "",
          card.getAttribute("data-region") || ""
        ].join(" ").toLowerCase();
        var matchSearch = !query || haystack.indexOf(query) !== -1;
        var matchFilter = activeFilter === "all" || haystack.indexOf(activeFilter.toLowerCase()) !== -1;
        card.style.display = matchSearch && matchFilter ? "" : "none";
      });
    }

    if (search) {
      search.addEventListener("input", applyFilters);
    }

    if (filterRow) {
      filterRow.addEventListener("click", function (event) {
        var button = event.target.closest("[data-filter]");
        if (!button) {
          return;
        }
        activeFilter = button.getAttribute("data-filter") || "all";
        Array.prototype.slice.call(filterRow.querySelectorAll(".filter-btn")).forEach(function (item) {
          item.classList.toggle("active", item === button);
        });
        applyFilters();
      });
    }
  });
})();
