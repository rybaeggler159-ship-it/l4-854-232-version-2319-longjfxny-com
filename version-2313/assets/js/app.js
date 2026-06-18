(function () {
  var menuButton = document.querySelector('.mobile-menu-button');
  var mobilePanel = document.querySelector('.mobile-panel');

  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      var isOpen = mobilePanel.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  var topButton = document.querySelector('.back-to-top');

  if (topButton) {
    topButton.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var current = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    }

    function startHero() {
      stopHero();
      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }

    function stopHero() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
        startHero();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(current - 1);
        startHero();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(current + 1);
        startHero();
      });
    }

    hero.addEventListener('mouseenter', stopHero);
    hero.addEventListener('mouseleave', startHero);
    startHero();
  }

  var list = document.querySelector('[data-list]');
  var cards = list ? Array.prototype.slice.call(list.querySelectorAll('[data-card]')) : [];
  var queryInput = document.querySelector('[data-filter="query"]');
  var categorySelect = document.querySelector('[data-filter="category"]');
  var typeSelect = document.querySelector('[data-filter="type"]');
  var sortSelect = document.querySelector('[data-sort]');
  var resultCount = document.querySelector('[data-result-count]');

  if (cards.length) {
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q') || params.get('search') || '';

    if (queryInput && initialQuery) {
      queryInput.value = initialQuery;
    }

    function normalize(value) {
      return String(value || '').trim().toLowerCase();
    }

    function applyFilters() {
      var query = normalize(queryInput ? queryInput.value : '');
      var category = normalize(categorySelect ? categorySelect.value : '');
      var type = normalize(typeSelect ? typeSelect.value : '');
      var visibleCount = 0;

      cards.forEach(function (card) {
        var search = normalize(card.getAttribute('data-search'));
        var cardCategory = normalize(card.getAttribute('data-category'));
        var cardType = normalize(card.getAttribute('data-type'));
        var matchQuery = !query || search.indexOf(query) !== -1;
        var matchCategory = !category || cardCategory === category;
        var matchType = !type || cardType === type;
        var visible = matchQuery && matchCategory && matchType;

        card.hidden = !visible;

        if (visible) {
          visibleCount += 1;
        }
      });

      if (resultCount) {
        resultCount.textContent = visibleCount ? '当前显示 ' + visibleCount + ' 部影片' : '未找到匹配影片';
      }
    }

    function applySort() {
      var value = sortSelect ? sortSelect.value : 'default';
      var sorted = cards.slice();

      if (value === 'views') {
        sorted.sort(function (a, b) {
          return extractViews(b) - extractViews(a);
        });
      }

      if (value === 'year') {
        sorted.sort(function (a, b) {
          return Number(b.getAttribute('data-year')) - Number(a.getAttribute('data-year'));
        });
      }

      if (value === 'title') {
        sorted.sort(function (a, b) {
          return String(a.getAttribute('data-title')).localeCompare(String(b.getAttribute('data-title')), 'zh-Hans-CN');
        });
      }

      sorted.forEach(function (card) {
        list.appendChild(card);
      });
    }

    function extractViews(card) {
      var text = card.textContent || '';
      var match = text.match(/([0-9,]+)\s*热度/);
      return match ? Number(match[1].replace(/,/g, '')) : 0;
    }

    [queryInput, categorySelect, typeSelect].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilters);
        control.addEventListener('change', applyFilters);
      }
    });

    if (sortSelect) {
      sortSelect.addEventListener('change', function () {
        applySort();
        applyFilters();
      });
    }

    applySort();
    applyFilters();
  }
})();
