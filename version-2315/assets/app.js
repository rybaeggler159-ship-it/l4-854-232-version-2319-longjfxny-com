(function () {
  var header = document.querySelector('[data-header]');
  var menuButton = document.querySelector('[data-menu-button]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  function setHeaderState() {
    if (!header) {
      return;
    }
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  }

  setHeaderState();
  window.addEventListener('scroll', setHeaderState, { passive: true });

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  document.querySelectorAll('[data-hero]').forEach(function (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        start();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(parseInt(dot.getAttribute('data-hero-dot'), 10) || 0);
        start();
      });
    });

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    show(0);
    start();
  });

  document.querySelectorAll('[data-filter-toolbar]').forEach(function (toolbar) {
    var section = toolbar.parentElement;
    var list = section ? section.querySelector('[data-filter-list]') : null;
    var cards = list ? Array.prototype.slice.call(list.querySelectorAll('[data-movie-card]')) : [];
    var searchInput = toolbar.querySelector('[data-search-input]');
    var yearFilter = toolbar.querySelector('[data-year-filter]');
    var categoryFilter = toolbar.querySelector('[data-category-filter]');
    var clearButton = toolbar.querySelector('[data-clear-filter]');
    var emptyState = section ? section.querySelector('[data-empty-state]') : null;

    function normalize(value) {
      return String(value || '').trim().toLowerCase();
    }

    function applyFilters() {
      var query = normalize(searchInput ? searchInput.value : '');
      var year = yearFilter ? yearFilter.value : 'all';
      var category = categoryFilter ? categoryFilter.value : 'all';
      var visible = 0;

      cards.forEach(function (card) {
        var text = normalize(card.getAttribute('data-title'));
        var cardYear = card.getAttribute('data-year') || '';
        var cardCategory = card.getAttribute('data-category') || '';
        var matched = true;

        if (query && text.indexOf(query) === -1) {
          matched = false;
        }
        if (year && year !== 'all' && cardYear !== year) {
          matched = false;
        }
        if (category && category !== 'all' && cardCategory !== category) {
          matched = false;
        }

        card.classList.toggle('is-hidden', !matched);
        if (matched) {
          visible += 1;
        }
      });

      if (emptyState) {
        emptyState.classList.toggle('is-visible', visible === 0);
      }
    }

    if (searchInput) {
      searchInput.addEventListener('input', applyFilters);
    }
    if (yearFilter) {
      yearFilter.addEventListener('change', applyFilters);
    }
    if (categoryFilter) {
      categoryFilter.addEventListener('change', applyFilters);
    }
    if (clearButton) {
      clearButton.addEventListener('click', function () {
        if (searchInput) {
          searchInput.value = '';
        }
        if (yearFilter) {
          yearFilter.value = 'all';
        }
        if (categoryFilter) {
          categoryFilter.value = 'all';
        }
        applyFilters();
      });
    }

    var params = new URLSearchParams(window.location.search);
    var q = params.get('q');
    if (q && searchInput) {
      searchInput.value = q;
    }
    applyFilters();
  });

  document.querySelectorAll('[data-player]').forEach(function (player) {
    var video = player.querySelector('video');
    var trigger = player.querySelector('[data-player-trigger]');
    var playUrl = player.getAttribute('data-play-url');
    var hlsInstance = null;
    var loaded = false;

    function loadVideo() {
      if (!video || !playUrl) {
        return;
      }
      if (!loaded) {
        loaded = true;
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = playUrl;
        } else if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({ enableWorker: true });
          hlsInstance.loadSource(playUrl);
          hlsInstance.attachMedia(video);
        } else {
          video.src = playUrl;
        }
      }
      player.classList.add('is-playing');
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {
          video.controls = true;
        });
      }
    }

    if (trigger) {
      trigger.addEventListener('click', loadVideo);
    }
    if (video) {
      video.addEventListener('click', function () {
        if (!loaded || video.paused) {
          loadVideo();
        }
      });
      video.addEventListener('play', function () {
        player.classList.add('is-playing');
      });
    }
    window.addEventListener('pagehide', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
        hlsInstance = null;
      }
    });
  });
})();
