(function () {
  "use strict";

  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function setHeaderState() {
    var header = document.querySelector("[data-header]");
    if (!header) {
      return;
    }
    header.classList.toggle("is-scrolled", window.scrollY > 20);
  }

  function initMobileMenu() {
    var toggle = document.querySelector("[data-mobile-toggle]");
    var menu = document.querySelector("[data-mobile-menu]");
    if (!toggle || !menu) {
      return;
    }
    toggle.addEventListener("click", function () {
      menu.classList.toggle("is-open");
    });
  }

  function initHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    if (slides.length < 2) {
      return;
    }
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-hero-dot")) || 0);
        start();
      });
    });

    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
    start();
  }

  function initFilters() {
    var forms = Array.prototype.slice.call(document.querySelectorAll("[data-filter-form]"));
    forms.forEach(function (form) {
      var input = form.querySelector("[data-filter-input]");
      var list = document.querySelector("[data-filter-list]");
      var empty = document.querySelector("[data-empty-state]");
      var activeChip = "";
      if (!input || !list) {
        return;
      }
      var cards = Array.prototype.slice.call(list.querySelectorAll(".movie-card"));

      function applyFilter() {
        var query = (input.value || "").trim().toLowerCase();
        var visible = 0;
        cards.forEach(function (card) {
          var haystack = [
            card.getAttribute("data-title"),
            card.getAttribute("data-genre"),
            card.getAttribute("data-region"),
            card.getAttribute("data-year"),
            card.getAttribute("data-type"),
            card.textContent
          ].join(" ").toLowerCase();
          var chipMatch = !activeChip || haystack.indexOf(activeChip.toLowerCase()) !== -1;
          var queryMatch = !query || haystack.indexOf(query) !== -1;
          var match = chipMatch && queryMatch;
          card.hidden = !match;
          if (match) {
            visible += 1;
          }
        });
        if (empty) {
          empty.hidden = visible !== 0;
        }
      }

      form.addEventListener("submit", function (event) {
        event.preventDefault();
        applyFilter();
      });
      input.addEventListener("input", applyFilter);
      Array.prototype.slice.call(form.querySelectorAll("[data-chip]")).forEach(function (button) {
        button.addEventListener("click", function () {
          activeChip = button.getAttribute("data-chip") || "";
          Array.prototype.slice.call(form.querySelectorAll("[data-chip]")).forEach(function (item) {
            item.classList.toggle("is-active", item === button);
          });
          applyFilter();
        });
      });
    });
  }

  function initSearch() {
    var input = document.querySelector("[data-site-search]");
    var button = document.querySelector("[data-site-search-button]");
    var grid = document.querySelector("[data-result-grid]");
    var count = document.querySelector("[data-result-count]");
    var title = document.querySelector(".result-head h2");
    var data = window.SEARCH_DATA || [];
    if (!input || !grid || !data.length) {
      return;
    }

    function createCard(item) {
      var tags = (item.tags || []).slice(0, 3).map(function (tag) {
        return "<span>" + escapeHtml(tag) + "</span>";
      }).join("");
      return [
        "<article class=\"movie-card movie-card-wide\">",
        "<a href=\"./" + item.file + "\" class=\"movie-cover wide-cover\">",
        "<img src=\"" + item.cover + "\" alt=\"" + escapeHtml(item.title) + "\" loading=\"lazy\">",
        "<span class=\"cover-badge\">" + escapeHtml(item.year) + "</span>",
        "</a>",
        "<div class=\"movie-info\">",
        "<a href=\"./" + item.file + "\" class=\"movie-title\">" + escapeHtml(item.title) + "</a>",
        "<p>" + escapeHtml(item.oneLine) + "</p>",
        "<div class=\"movie-meta\"><span>" + escapeHtml(item.category) + "</span><span>" + escapeHtml(item.region) + "</span><span>" + escapeHtml(item.type) + "</span></div>",
        "<div class=\"tag-row\">" + tags + "</div>",
        "</div>",
        "</article>"
      ].join("");
    }

    function escapeHtml(value) {
      return String(value || "").replace(/[&<>\"]/g, function (character) {
        return {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          "\"": "&quot;"
        }[character];
      });
    }

    function render(query) {
      var q = String(query || "").trim().toLowerCase();
      var results = q ? data.filter(function (item) {
        return [
          item.title,
          item.oneLine,
          item.genre,
          item.region,
          item.type,
          item.year,
          item.category,
          (item.tags || []).join(" ")
        ].join(" ").toLowerCase().indexOf(q) !== -1;
      }) : data.slice(0, 12);
      grid.innerHTML = results.slice(0, 90).map(createCard).join("");
      if (title) {
        title.textContent = q ? "搜索结果" : "推荐内容";
      }
      if (count) {
        count.textContent = q ? "找到 " + results.length + " 个结果" : "";
      }
    }

    function searchFromInput() {
      render(input.value);
    }

    input.addEventListener("input", searchFromInput);
    input.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        searchFromInput();
      }
    });
    if (button) {
      button.addEventListener("click", searchFromInput);
    }
    Array.prototype.slice.call(document.querySelectorAll("[data-keyword]")).forEach(function (keyword) {
      keyword.addEventListener("click", function () {
        input.value = keyword.getAttribute("data-keyword") || "";
        render(input.value);
      });
    });
  }

  function initPlayers() {
    var players = Array.prototype.slice.call(document.querySelectorAll("[data-player]"));
    players.forEach(function (player) {
      var video = player.querySelector("video");
      var button = player.querySelector("[data-play-button]");
      var message = player.querySelector("[data-player-message]");
      var source = player.getAttribute("data-video");
      var hls = null;
      var loaded = false;

      function showMessage(value) {
        if (!message) {
          return;
        }
        message.hidden = !value;
        message.textContent = value || "";
      }

      function bindSource() {
        if (loaded || !video || !source) {
          return;
        }
        loaded = true;
        if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.loadSource(source);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.ERROR, function (event, data) {
            if (!data || !data.fatal) {
              return;
            }
            if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
              showMessage("播放加载中，请稍候");
              hls.startLoad();
            } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
              showMessage("播放恢复中，请稍候");
              hls.recoverMediaError();
            } else {
              showMessage("播放加载失败，请稍后再试");
            }
          });
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = source;
        } else {
          showMessage("播放加载失败，请稍后再试");
        }
      }

      function play() {
        bindSource();
        if (!video) {
          return;
        }
        var promise = video.play();
        if (promise && typeof promise.catch === "function") {
          promise.catch(function () {
            showMessage("点击播放按钮开始观看");
          });
        }
      }

      if (button) {
        button.addEventListener("click", function () {
          button.classList.add("is-hidden");
          play();
        });
      }
      if (video) {
        video.addEventListener("play", function () {
          if (button) {
            button.classList.add("is-hidden");
          }
          showMessage("");
        });
        video.addEventListener("click", function () {
          if (video.paused) {
            play();
          }
        });
      }
      window.addEventListener("pagehide", function () {
        if (hls) {
          hls.destroy();
        }
      });
    });
  }

  ready(function () {
    setHeaderState();
    initMobileMenu();
    initHero();
    initFilters();
    initSearch();
    initPlayers();
    window.addEventListener("scroll", setHeaderState, { passive: true });
  });
}());
