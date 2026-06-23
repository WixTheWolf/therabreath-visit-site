(function () {
  var slides = Array.prototype.slice.call(document.querySelectorAll(".pres-slide"));
  var index = 0;
  var chrome = document.getElementById("pres-chrome");
  var progress = document.getElementById("pres-progress-bar");
  var counter = document.getElementById("pres-counter");
  var hideTimer = null;

  function show(i) {
    if (!slides.length) return;
    index = Math.max(0, Math.min(slides.length - 1, i));
    slides.forEach(function (slide, n) {
      slide.classList.remove("active", "prev");
      if (n === index) slide.classList.add("active");
      else if (n < index) slide.classList.add("prev");
    });
    if (progress) {
      progress.style.width = ((index + 1) / slides.length * 100) + "%";
    }
    if (counter) {
      counter.textContent = (index + 1) + " / " + slides.length;
    }
    history.replaceState(null, "", "#" + (index + 1));
  }

  function next() { show(index + 1); }
  function prev() { show(index - 1); }

  function toggleFullscreen() {
    var root = document.querySelector(".pres-root");
    if (!root) return;
    if (!document.fullscreenElement) {
      root.requestFullscreen().catch(function () {});
    } else {
      document.exitFullscreen();
    }
  }

  function flashChrome() {
    if (!chrome) return;
    chrome.classList.remove("hidden");
    clearTimeout(hideTimer);
    hideTimer = setTimeout(function () {
      if (document.fullscreenElement) chrome.classList.add("hidden");
    }, 3000);
  }

  function initFromHash() {
    var m = (location.hash || "").match(/^#(\d+)$/);
    if (m) show(parseInt(m[1], 10) - 1);
    else show(0);
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
      e.preventDefault();
      next();
      flashChrome();
    } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
      e.preventDefault();
      prev();
      flashChrome();
    } else if (e.key === "Home") {
      e.preventDefault();
      show(0);
      flashChrome();
    } else if (e.key === "End") {
      e.preventDefault();
      show(slides.length - 1);
      flashChrome();
    } else if (e.key === "f" || e.key === "F") {
      e.preventDefault();
      toggleFullscreen();
    }
  });

  document.getElementById("pres-btn-prev")?.addEventListener("click", function () { prev(); flashChrome(); });
  document.getElementById("pres-btn-next")?.addEventListener("click", function () { next(); flashChrome(); });
  document.getElementById("pres-btn-fs")?.addEventListener("click", toggleFullscreen);

  document.querySelector(".pres-hit.prev")?.addEventListener("click", function () { prev(); flashChrome(); });
  document.querySelector(".pres-hit.next")?.addEventListener("click", function () { next(); flashChrome(); });

  document.addEventListener("fullscreenchange", function () {
    if (document.fullscreenElement) flashChrome();
    else if (chrome) chrome.classList.remove("hidden");
  });

  document.addEventListener("mousemove", flashChrome);
  initFromHash();
})();