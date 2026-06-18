(function () {
  var script = document.currentScript;
  var source = script ? script.getAttribute("data-src") : "";

  function init() {
    var video = document.getElementById("main-video");
    var cover = document.querySelector(".player-cover");
    if (!video || !source) {
      return;
    }

    var hls = null;
    var started = false;

    function attach() {
      if (started) {
        return;
      }
      started = true;
      if (cover) {
        cover.classList.add("is-hidden");
      }
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
        video.play().catch(function () {});
        return;
      }
      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hls.loadSource(source);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          video.play().catch(function () {});
        });
        hls.on(window.Hls.Events.ERROR, function (event, data) {
          if (data && data.fatal && hls) {
            hls.destroy();
            hls = null;
            video.src = source;
            video.play().catch(function () {});
          }
        });
        return;
      }
      video.src = source;
      video.play().catch(function () {});
    }

    if (cover) {
      cover.addEventListener("click", attach);
    }

    video.addEventListener("click", function () {
      if (!started) {
        attach();
      }
    });

    video.addEventListener("play", function () {
      if (cover) {
        cover.classList.add("is-hidden");
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
