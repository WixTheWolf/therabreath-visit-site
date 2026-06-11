/**
 * Cinematic welcome — plays on home page first visit / QR scan.
 */
(function (global) {
  var SESSION_KEY = "tff-cine-seen-v1";

  function prefersReducedMotion() {
    return global.matchMedia && global.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function shouldPlay() {
    var p = (global.location.pathname || "/").replace(/\/$/, "") || "/";
    if (p !== "/" && p !== "/index.html") return false;
    if (prefersReducedMotion()) return false;

    var params = new URLSearchParams(global.location.search);
    if (params.get("welcome") === "1" || params.get("qr") === "1") return true;

    try {
      if (sessionStorage.getItem(SESSION_KEY) === "1") return false;
    } catch (e) {}

    return true;
  }

  function markSeen() {
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch (e) {}
  }

  function buildOverlay() {
    var el = document.createElement("div");
    el.className = "tff-cine";
    el.setAttribute("role", "presentation");
    el.setAttribute("aria-hidden", "true");
    el.innerHTML =
      '<canvas class="tff-cine-canvas" aria-hidden="true"></canvas>' +
      '<div class="tff-cine-sweep" aria-hidden="true"></div>' +
      '<div class="tff-cine-streaks" aria-hidden="true">' +
      '<span class="tff-cine-streak"></span><span class="tff-cine-streak"></span>' +
      '<span class="tff-cine-streak"></span><span class="tff-cine-streak"></span></div>' +
      '<div class="tff-cine-flash burst-1"></div>' +
      '<div class="tff-cine-flash burst-2"></div>' +
      '<div class="tff-cine-flash burst-3"></div>' +
      '<div class="tff-cine-vignette"></div>' +
      '<div class="tff-cine-core">' +
      '<div class="tff-cine-mark">TFF</div>' +
      '<span class="tff-cine-line l1">July 8, 2026 · Norco, California</span>' +
      '<span class="tff-cine-line l2">Welcome</span>' +
      '<span class="tff-cine-line l3">TheraBreath Team</span>' +
      '<span class="tff-cine-line l4">Prepared, operational, easy to grow with</span>' +
      '<div class="tff-cine-bar"></div></div>' +
      '<div class="tff-cine-curtain"></div>' +
      '<button type="button" class="tff-cine-skip">Skip intro</button>';
    return el;
  }

  function startParticles(canvas) {
    var ctx = canvas.getContext("2d");
    if (!ctx) return null;

    var dpr = Math.min(global.devicePixelRatio || 1, 2);
    var w = 0;
    var h = 0;
    var parts = [];
    var colors = ["#008fd3", "#5fb832", "#f58220", "#ffffff", "#90e0ef"];
    var raf = 0;
    var running = true;

    function resize() {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function seed(n) {
      parts = [];
      for (var i = 0; i < n; i++) {
        parts.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 1.2,
          vy: (Math.random() - 0.5) * 1.2,
          r: Math.random() * 2.2 + 0.5,
          c: colors[i % colors.length],
          a: Math.random() * 0.5 + 0.2
        });
      }
    }

    function draw() {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      parts.forEach(function (p) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.c;
        ctx.globalAlpha = p.a;
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      raf = global.requestAnimationFrame(draw);
    }

    resize();
    seed(90);
    draw();
    global.addEventListener("resize", resize);

    return function stop() {
      running = false;
      global.cancelAnimationFrame(raf);
      global.removeEventListener("resize", resize);
    };
  }

  function dismiss(overlay, stopParticles) {
    if (!overlay || overlay.classList.contains("is-done")) return;
    overlay.classList.add("is-done");
    document.documentElement.classList.remove("tff-cine-active");
    markSeen();
    if (stopParticles) stopParticles();
    setTimeout(function () {
      overlay.remove();
    }, 1000);
  }

  function play() {
    if (!shouldPlay()) return;

    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/tff-cinematic.css";
    document.head.appendChild(link);

    document.documentElement.classList.add("tff-cine-active");
    var overlay = buildOverlay();
    document.body.appendChild(overlay);

    var canvas = overlay.querySelector(".tff-cine-canvas");
    var stopParticles = startParticles(canvas);

    var skip = overlay.querySelector(".tff-cine-skip");
    skip.addEventListener("click", function () {
      dismiss(overlay, stopParticles);
    });

    setTimeout(function () {
      dismiss(overlay, stopParticles);
    }, 5600);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", play);
  } else {
    play();
  }

  global.TFFCinematic = { replay: function () {
    try { sessionStorage.removeItem(SESSION_KEY); } catch (e) {}
    global.location.href = "/?welcome=1";
  }};
})(typeof window !== "undefined" ? window : global);