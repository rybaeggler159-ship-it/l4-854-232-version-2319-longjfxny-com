(function () {
  var menuButton = document.querySelector(".menu-toggle");
  var navLinks = document.querySelector(".nav-links");

  if (menuButton && navLinks) {
    menuButton.addEventListener("click", function () {
      var isOpen = navLinks.classList.toggle("is-open");
      menuButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  document.querySelectorAll("img").forEach(function (image) {
    image.addEventListener("error", function () {
      image.classList.add("image-missing");
    });
  });

  var slider = document.querySelector("[data-hero-slider]");

  if (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(slider.querySelectorAll(".hero-dot"));
    var current = 0;

    function activate(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === current);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        activate(Number(dot.getAttribute("data-slide")) || 0);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        activate(current + 1);
      }, 5600);
    }
  }

  var filterGrid = document.querySelector("[data-filter-grid]");
  var localFilter = document.querySelector(".local-filter");
  var yearFilter = document.querySelector(".year-filter");
  var emptyState = document.querySelector(".empty-state");

  function applyLocalFilter() {
    if (!filterGrid) {
      return;
    }

    var query = localFilter ? localFilter.value.trim().toLowerCase() : "";
    var year = yearFilter ? yearFilter.value : "";
    var visible = 0;

    filterGrid.querySelectorAll("[data-card]").forEach(function (card) {
      var text = [
        card.getAttribute("data-title") || "",
        card.getAttribute("data-year") || "",
        card.getAttribute("data-genre") || "",
        card.getAttribute("data-region") || "",
        card.getAttribute("data-tags") || ""
      ].join(" ").toLowerCase();
      var matchQuery = !query || text.indexOf(query) !== -1;
      var matchYear = !year || card.getAttribute("data-year") === year;
      var show = matchQuery && matchYear;
      card.hidden = !show;
      if (show) {
        visible += 1;
      }
    });

    if (emptyState) {
      emptyState.hidden = visible !== 0;
    }
  }

  if (localFilter) {
    localFilter.addEventListener("input", applyLocalFilter);
  }

  if (yearFilter) {
    yearFilter.addEventListener("change", applyLocalFilter);
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function renderSearchResults() {
    var results = document.getElementById("searchResults");
    var empty = document.getElementById("searchEmpty");
    var input = document.getElementById("searchPageInput");

    if (!results || !window.SITE_MOVIES) {
      return;
    }

    var params = new URLSearchParams(window.location.search);
    var query = (params.get("q") || "").trim();

    if (input) {
      input.value = query;
    }

    var lowered = query.toLowerCase();
    var movies = window.SITE_MOVIES.filter(function (movie) {
      if (!lowered) {
        return true;
      }
      return [movie.title, movie.year, movie.region, movie.genre, movie.tags, movie.type]
        .join(" ")
        .toLowerCase()
        .indexOf(lowered) !== -1;
    }).slice(0, 96);

    results.innerHTML = movies.map(function (movie) {
      var tags = String(movie.tags || "")
        .split("，")
        .filter(Boolean)
        .slice(0, 4)
        .map(function (tag) {
          return "<span>" + escapeHtml(tag) + "</span>";
        })
        .join("");

      return [
        "<article class=\"movie-card\" data-card>",
        "  <a class=\"movie-cover\" href=\"./" + escapeHtml(movie.url) + "\" aria-label=\"" + escapeHtml(movie.title) + "\">",
        "    <img onerror=\"this.classList.add('image-missing')\" src=\"" + escapeHtml(movie.cover) + "\" alt=\"" + escapeHtml(movie.title) + "\" loading=\"lazy\">",
        "    <span class=\"cover-badge\">" + escapeHtml(movie.year) + "</span>",
        "  </a>",
        "  <div class=\"movie-card-body\">",
        "    <div class=\"movie-meta-line\"><span>" + escapeHtml(movie.region) + "</span><span>" + escapeHtml(movie.type) + "</span></div>",
        "    <h2><a href=\"./" + escapeHtml(movie.url) + "\">" + escapeHtml(movie.title) + "</a></h2>",
        "    <p>" + escapeHtml(movie.oneLine) + "</p>",
        "    <div class=\"tag-list\">" + tags + "</div>",
        "  </div>",
        "</article>"
      ].join("\n");
    }).join("\n");

    if (empty) {
      empty.hidden = movies.length !== 0;
    }
  }

  renderSearchResults();
})();
