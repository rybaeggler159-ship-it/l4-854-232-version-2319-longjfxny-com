(function () {
  function startMoviePlayer(source) {
    var root = document.querySelector('[data-player-root]');
    if (!root) {
      return;
    }

    var video = root.querySelector('video');
    var cover = root.querySelector('[data-player-cover]');
    var message = root.querySelector('[data-player-message]');
    var hls = null;
    var ready = false;

    function fail() {
      if (message) {
        message.hidden = false;
      }
    }

    function bind() {
      if (ready || !video) {
        return true;
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
          } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
            hls.recoverMediaError();
          } else {
            fail();
          }
        });
        ready = true;
        return true;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        ready = true;
        return true;
      }

      fail();
      return false;
    }

    function play() {
      if (!bind()) {
        return;
      }
      if (cover) {
        cover.classList.add('is-hidden');
      }
      video.controls = true;
      var action = video.play();
      if (action && action.catch) {
        action.catch(function () {
          if (cover) {
            cover.classList.remove('is-hidden');
          }
        });
      }
    }

    if (cover) {
      cover.addEventListener('click', play);
    }

    if (video) {
      video.addEventListener('click', function () {
        if (video.paused) {
          play();
        } else {
          video.pause();
        }
      });
      video.addEventListener('play', function () {
        if (cover) {
          cover.classList.add('is-hidden');
        }
      });
    }

    window.addEventListener('pagehide', function () {
      if (hls) {
        hls.destroy();
      }
    });
  }

  window.startMoviePlayer = startMoviePlayer;
})();
