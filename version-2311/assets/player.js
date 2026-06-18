(function() {
  function setupMoviePlayer(options) {
    var video = document.getElementById(options.videoId);
    var overlay = document.getElementById(options.overlayId);
    var ready = false;
    var hls = null;

    function attach() {
      if (ready || !video) {
        return;
      }
      ready = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = options.streamUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(options.streamUrl);
        hls.attachMedia(video);
      } else {
        video.src = options.streamUrl;
      }
    }

    function begin() {
      attach();
      if (overlay) {
        overlay.classList.add("is-hidden");
      }
      var attempt = video.play();
      if (attempt && typeof attempt.catch === "function") {
        attempt.catch(function() {
          if (overlay) {
            overlay.classList.remove("is-hidden");
          }
        });
      }
    }

    if (overlay) {
      overlay.addEventListener("click", begin);
    }

    if (video) {
      video.addEventListener("click", function() {
        if (video.paused) {
          begin();
        }
      });
      video.addEventListener("play", function() {
        if (overlay) {
          overlay.classList.add("is-hidden");
        }
      });
      video.addEventListener("ended", function() {
        if (overlay) {
          overlay.classList.remove("is-hidden");
        }
      });
      window.addEventListener("pagehide", function() {
        if (hls) {
          hls.destroy();
        }
      });
    }
  }

  window.setupMoviePlayer = setupMoviePlayer;
})();
