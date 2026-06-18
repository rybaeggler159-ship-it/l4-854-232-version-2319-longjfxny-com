(function() {
  const menuButton = document.querySelector("[data-menu-toggle]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");

  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", function() {
      mobileMenu.classList.toggle("is-open");
    });
  }

  document.querySelectorAll("[data-search-form]").forEach(function(form) {
    form.addEventListener("submit", function(event) {
      const input = form.querySelector("input[name='q']");
      if (!input) {
        return;
      }
      const query = input.value.trim();
      if (!query) {
        return;
      }
      event.preventDefault();
      window.location.href = "./search.html?q=" + encodeURIComponent(query);
    });
  });

  document.querySelectorAll("[data-hero-slider]").forEach(function(slider) {
    const slides = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-slide]"));
    const dots = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-dot]"));
    let index = 0;
    let timer = null;

    function showSlide(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function(slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === index);
      });
      dots.forEach(function(dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === index);
      });
    }

    function startTimer() {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function() {
        showSlide(index + 1);
      }, 5200);
    }

    dots.forEach(function(dot) {
      dot.addEventListener("click", function() {
        const nextIndex = Number(dot.getAttribute("data-hero-dot"));
        showSlide(nextIndex);
        startTimer();
      });
    });

    showSlide(0);
    startTimer();
  });

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  function setupFilterPanel(panel) {
    const list = panel.parentElement.querySelector("[data-filter-list]");
    if (!list) {
      return;
    }
    const cards = Array.prototype.slice.call(list.querySelectorAll(".movie-card"));
    const textInput = panel.querySelector("[data-filter-text]");
    const yearInput = panel.querySelector("[data-filter-year]");
    const regionInput = panel.querySelector("[data-filter-region]");
    const typeInput = panel.querySelector("[data-filter-type]");
    const clearButton = panel.querySelector("[data-filter-clear]");

    function applyFilters() {
      const textValue = normalize(textInput && textInput.value);
      const yearValue = normalize(yearInput && yearInput.value);
      const regionValue = normalize(regionInput && regionInput.value);
      const typeValue = normalize(typeInput && typeInput.value);

      cards.forEach(function(card) {
        const haystack = normalize(card.getAttribute("data-keywords") + " " + card.getAttribute("data-title"));
        const year = normalize(card.getAttribute("data-year"));
        const region = normalize(card.getAttribute("data-region"));
        const type = normalize(card.getAttribute("data-type"));
        const matched = (!textValue || haystack.indexOf(textValue) !== -1) &&
          (!yearValue || year.indexOf(yearValue) !== -1) &&
          (!regionValue || region.indexOf(regionValue) !== -1) &&
          (!typeValue || type.indexOf(typeValue) !== -1);
        card.classList.toggle("is-filtered-out", !matched);
      });
    }

    [textInput, yearInput, regionInput, typeInput].forEach(function(input) {
      if (input) {
        input.addEventListener("input", applyFilters);
      }
    });

    if (clearButton) {
      clearButton.addEventListener("click", function() {
        [textInput, yearInput, regionInput, typeInput].forEach(function(input) {
          if (input) {
            input.value = "";
          }
        });
        applyFilters();
      });
    }

    const params = new URLSearchParams(window.location.search);
    const queryValue = params.get("q");
    if (queryValue && textInput) {
      textInput.value = queryValue;
      applyFilters();
    }
  }

  document.querySelectorAll("[data-filter-panel]").forEach(setupFilterPanel);
}());
