(function () {
  function attachPlayer(root) {
    var video = root.querySelector("video[data-stream]");
    var overlay = root.querySelector(".player-overlay");
    var message = root.querySelector(".player-message");
    var hls = null;
    var ready = false;

    if (!video) {
      return;
    }

    function setMessage(text) {
      if (message) {
        message.textContent = text || "";
      }
    }

    function prepare() {
      var stream = video.getAttribute("data-stream") || "";

      if (ready || !stream) {
        return ready;
      }

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = stream;
        ready = true;
        return true;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(stream);
        hls.attachMedia(video);
        ready = true;
        return true;
      }

      setMessage("播放暂时不可用，请稍后再试");
      return false;
    }

    function start() {
      if (!prepare()) {
        return;
      }

      root.classList.add("is-playing");
      setMessage("");
      var playRequest = video.play();

      if (playRequest && typeof playRequest.catch === "function") {
        playRequest.catch(function () {
          root.classList.remove("is-playing");
        });
      }
    }

    if (overlay) {
      overlay.addEventListener("click", start);
    }

    video.addEventListener("play", function () {
      root.classList.add("is-playing");
    });

    video.addEventListener("pause", function () {
      if (!video.ended) {
        root.classList.remove("is-playing");
      }
    });

    video.addEventListener("ended", function () {
      root.classList.remove("is-playing");
    });

    video.addEventListener("error", function () {
      setMessage("播放暂时不可用，请稍后再试");
      root.classList.remove("is-playing");
    });

    window.addEventListener("beforeunload", function () {
      if (hls && typeof hls.destroy === "function") {
        hls.destroy();
      }
    });
  }

  document.querySelectorAll("[data-player]").forEach(attachPlayer);
})();
