(function () {
  var root = document.querySelector('[data-player]');

  if (!root) {
    return;
  }

  var video = root.querySelector('video');
  var overlay = root.querySelector('[data-player-overlay]');
  var loading = root.querySelector('[data-player-loading]');
  var errorBox = root.querySelector('[data-player-error]');
  var source = root.getAttribute('data-src');
  var ready = false;
  var hls = null;

  function setError(message) {
    root.classList.remove('is-loading');
    root.classList.add('has-error');

    if (errorBox) {
      errorBox.textContent = message;
    }
  }

  function prepare() {
    if (ready || !video || !source) {
      return;
    }

    ready = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      return;
    }

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
          hls.startLoad();
          return;
        }

        if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
          hls.recoverMediaError();
          return;
        }

        setError('视频加载失败，请稍后重试');
      });

      return;
    }

    setError('当前浏览器暂时无法播放该内容');
  }

  function playVideo() {
    prepare();
    root.classList.add('is-loading');

    var playPromise = video.play();

    if (playPromise && typeof playPromise.then === 'function') {
      playPromise.then(function () {
        root.classList.remove('is-loading');
        if (overlay) {
          overlay.classList.add('is-hidden');
        }
      }).catch(function () {
        root.classList.remove('is-loading');
        if (overlay) {
          overlay.classList.remove('is-hidden');
        }
      });
    }
  }

  function pauseVideo() {
    video.pause();

    if (overlay) {
      overlay.classList.remove('is-hidden');
    }
  }

  if (overlay) {
    overlay.addEventListener('click', playVideo);
  }

  video.addEventListener('click', function () {
    if (video.paused) {
      playVideo();
    } else {
      pauseVideo();
    }
  });

  video.addEventListener('playing', function () {
    root.classList.remove('is-loading');
    if (overlay) {
      overlay.classList.add('is-hidden');
    }
  });

  video.addEventListener('pause', function () {
    if (overlay) {
      overlay.classList.remove('is-hidden');
    }
  });

  video.addEventListener('waiting', function () {
    if (loading) {
      root.classList.add('is-loading');
    }
  });

  video.addEventListener('canplay', function () {
    root.classList.remove('is-loading');
  });

  window.addEventListener('beforeunload', function () {
    if (hls) {
      hls.destroy();
    }
  });
})();
