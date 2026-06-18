(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      var open = mobileNav.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', String(open));
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

    function showHero(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === current);
      });
    }

    function startHero() {
      stopHero();
      timer = window.setInterval(function () {
        showHero(current + 1);
      }, 5200);
    }

    function stopHero() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    if (prev) {
      prev.addEventListener('click', function () {
        showHero(current - 1);
        startHero();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showHero(current + 1);
        startHero();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showHero(Number(dot.getAttribute('data-hero-dot') || 0));
        startHero();
      });
    });

    hero.addEventListener('mouseenter', stopHero);
    hero.addEventListener('mouseleave', startHero);
    showHero(0);
    startHero();
  }

  function normalize(value) {
    return (value || '').toString().toLowerCase().replace(/\s+/g, '');
  }

  function applySearch(input) {
    var selector = input.getAttribute('data-search-scope') || 'body';
    var scope = document.querySelector(selector) || document.body;
    var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card, .category-overview-card'));
    var query = normalize(input.value);

    cards.forEach(function (card) {
      var content = normalize(card.textContent + ' ' + Array.prototype.map.call(card.attributes, function (attr) {
        return attr.value;
      }).join(' '));
      card.classList.toggle('is-search-hidden', Boolean(query) && content.indexOf(query) === -1);
    });
  }

  Array.prototype.slice.call(document.querySelectorAll('[data-search-input]')).forEach(function (input) {
    input.addEventListener('input', function () {
      applySearch(input);
    });
  });

  var filterButtons = Array.prototype.slice.call(document.querySelectorAll('[data-filter-year]'));
  if (filterButtons.length) {
    filterButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        var year = button.getAttribute('data-filter-year') || '';
        filterButtons.forEach(function (item) {
          item.classList.toggle('is-active', item === button);
        });
        Array.prototype.slice.call(document.querySelectorAll('.movie-card')).forEach(function (card) {
          var cardYear = card.getAttribute('data-year') || '';
          card.classList.toggle('is-filtered-out', Boolean(year) && cardYear !== year);
        });
      });
    });
  }
})();
