(function () {
  var slides = Array.prototype.slice.call(document.querySelectorAll(".pres-slide"));
  var stage = document.getElementById("pres-stage");
  var chrome = document.getElementById("pres-chrome");
  var topbar = document.getElementById("pres-topbar-bar");
  var counter = document.getElementById("pres-counter");
  var dotsWrap = document.getElementById("pres-dots");
  var hint = document.getElementById("pres-hint");
  var index = 0;
  var hideTimer = null;
  var fitTimer = null;

  function buildDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = "";
    slides.forEach(function (_, n) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.setAttribute("aria-label", "Slide " + (n + 1));
      btn.addEventListener("click", function () {
        show(n);
        flashChrome();
      });
      dotsWrap.appendChild(btn);
    });
  }

  function fitActive() {
    if (!stage) return;
    var slide = slides[index];
    if (!slide) return;
    var canvas = slide.querySelector(".pres-canvas");
    if (!canvas) return;

    canvas.style.transform = "none";
    canvas.style.height = "100%";

    var padY = 24;
    var padX = 24;
    var availH = stage.clientHeight - padY;
    var availW = stage.clientWidth - padX;

    canvas.style.height = "auto";
    canvas.style.maxHeight = "none";
    var naturalH = canvas.offsetHeight;
    var naturalW = canvas.offsetWidth;

    var scale = Math.min(1, availH / naturalH, availW / naturalW);
    if (scale < 0.995) {
      canvas.style.height = naturalH + "px";
      canvas.style.transform = "scale(" + scale + ")";
      canvas.style.transformOrigin = "center center";
    } else {
      canvas.style.height = "100%";
      canvas.style.transform = "none";
    }
  }

  function scheduleFit() {
    clearTimeout(fitTimer);
    fitTimer = setTimeout(fitActive, 50);
  }

  function show(i) {
    if (!slides.length) return;
    index = Math.max(0, Math.min(slides.length - 1, i));
    slides.forEach(function (slide, n) {
      slide.classList.toggle("active", n === index);
      var canvas = slide.querySelector(".pres-canvas");
      if (canvas && n !== index) canvas.style.transform = "none";
    });

    if (topbar) {
      topbar.style.width = ((index + 1) / slides.length * 100) + "%";
    }
    if (counter) {
      counter.textContent = (index + 1) + " / " + slides.length;
    }
    if (dotsWrap) {
      Array.prototype.forEach.call(dotsWrap.children, function (dot, n) {
        dot.classList.toggle("on", n === index);
      });
    }
    history.replaceState(null, "", "#" + (index + 1));
    scheduleFit();
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
    }, 3500);
  }

  function initFromHash() {
    var m = (location.hash || "").match(/^#(\d+)$/);
    if (m) show(parseInt(m[1], 10) - 1);
    else show(0);
  }

  function showHint() {
    if (!hint || sessionStorage.getItem("tff-pres-hint")) return;
    hint.classList.add("show");
    setTimeout(function () {
      hint.classList.remove("show");
      try { sessionStorage.setItem("tff-pres-hint", "1"); } catch (e) {}
    }, 4500);
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
    scheduleFit();
    if (document.fullscreenElement) flashChrome();
    else if (chrome) chrome.classList.remove("hidden");
  });

  window.addEventListener("resize", scheduleFit);
  document.addEventListener("mousemove", flashChrome);

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { scheduleFit(); });
  }

  buildDots();
  initFromHash();
  showHint();
  scheduleFit();
})();