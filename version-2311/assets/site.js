(function() {
  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  function setupMenu() {
    var button = document.querySelector("[data-menu-button]");
    var menu = document.querySelector("[data-mobile-menu]");
    if (!button || !menu) {
      return;
    }
    button.addEventListener("click", function() {
      menu.classList.toggle("open");
      button.textContent = menu.classList.contains("open") ? "×" : "☰";
    });
  }

  function setupFilters() {
    var panels = document.querySelectorAll("[data-filter-panel]");
    panels.forEach(function(panel) {
      var container = panel.parentElement;
      var cards = Array.prototype.slice.call(container.querySelectorAll("[data-card]"));
      var searchInput = panel.querySelector("[data-search-input]");
      var filters = Array.prototype.slice.call(panel.querySelectorAll("[data-filter]"));
      var empty = container.querySelector("[data-empty-state]");

      function apply() {
        var query = normalize(searchInput && searchInput.value);
        var activeFilters = filters.map(function(item) {
          return {
            key: item.getAttribute("data-filter"),
            value: normalize(item.value)
          };
        });
        var visible = 0;
        cards.forEach(function(card) {
          var haystack = normalize(card.getAttribute("data-search"));
          var matchesQuery = !query || haystack.indexOf(query) !== -1;
          var matchesFilters = activeFilters.every(function(filter) {
            if (!filter.value) {
              return true;
            }
            return normalize(card.getAttribute("data-" + filter.key)).indexOf(filter.value) !== -1;
          });
          var show = matchesQuery && matchesFilters;
          card.style.display = show ? "" : "none";
          if (show) {
            visible += 1;
          }
        });
        if (empty) {
          empty.classList.toggle("show", visible === 0);
        }
      }

      if (searchInput) {
        searchInput.addEventListener("input", apply);
      }
      filters.forEach(function(item) {
        item.addEventListener("change", apply);
      });
    });
  }

  function boot() {
    setupMenu();
    setupFilters();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
