/**
 * TheraBreath cinematic welcome — quick brand intro, then flavor drips reveal home.
 */
(function (global) {
  var SESSION_KEY = "tff-cine-seen-v3";

  var DRIP_COLORS = [
    { fill: "#5fb832", glow: "rgba(95,184,50,0.45)" },
    { fill: "#008fd3", glow: "rgba(0,143,211,0.4)" },
    { fill: "#f58220", glow: "rgba(245,130,32,0.38)" },
    { fill: "#7cb87a", glow: "rgba(124,184,122,0.35)" },
    { fill: "#90e0ef", glow: "rgba(144,224,239,0.3)" },
    { fill: "#5fb832", glow: "rgba(95,184,50,0.4)" },
    { fill: "#008fd3", glow: "rgba(0,143,211,0.38)" }
  ];

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
      '<div class="tff-cine-grain" aria-hidden="true"></div>' +
      '<div class="tff-cine-letterbox tff-cine-letterbox-top" aria-hidden="true"></div>' +
      '<div class="tff-cine-letterbox tff-cine-letterbox-bottom" aria-hidden="true"></div>' +
      '<div class="tff-cine-intro">' +
      '<p class="tff-cine-intro-kicker">The Flavor Factory welcomes</p>' +
      '<h1 class="tff-cine-intro-brand">TheraBreath</h1>' +
      '<p class="tff-cine-intro-event">Capabilities Workshop</p>' +
      '<p class="tff-cine-intro-meta">July 8 · Norco, California</p>' +
      "</div>" +
      '<canvas class="tff-cine-drip-canvas" aria-hidden="true"></canvas>' +
      '<button type="button" class="tff-cine-skip">Skip</button>';
    return el;
  }

  function revealHome() {
    document.body.classList.remove("tff-cine-pending");
    document.body.classList.add("tff-cine-revealed");
  }

  function dismiss(overlay, stopDrips, fast) {
    if (!overlay || overlay.classList.contains("is-done")) return;
    markSeen();
    if (stopDrips) stopDrips();
    revealHome();
    document.documentElement.classList.remove("tff-cine-active");

    if (fast) {
      overlay.remove();
      return;
    }

    overlay.classList.add("is-done");
    setTimeout(function () {
      overlay.remove();
    }, 500);
  }

  function startDripReveal(canvas, onComplete) {
    var ctx = canvas.getContext("2d");
    if (!ctx) {
      if (onComplete) onComplete();
      return function () {};
    }

    var dpr = Math.min(global.devicePixelRatio || 1, 2);
    var w = 0;
    var h = 0;
    var raf = 0;
    var running = true;
    var start = 0;
    var duration = 3200;
    var drips = [];

    function resize() {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seedDrips();
    }

    function seedDrips() {
      drips = DRIP_COLORS.map(function (pal, i) {
        var count = DRIP_COLORS.length;
        var slot = (i + 0.5) / count;
        return {
          x: slot * w + (Math.random() - 0.5) * (w / count) * 0.35,
          width: w / count * (0.55 + Math.random() * 0.35),
          y: -h * 0.15,
          speed: h * (0.42 + Math.random() * 0.12),
          wobble: Math.random() * Math.PI * 2,
          wobbleAmp: 6 + Math.random() * 10,
          pal: pal,
          delay: i * 0.06
        };
      });
    }

    function drawCover() {
      var grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, "#0a1628");
      grad.addColorStop(0.55, "#0d2844");
      grad.addColorStop(1, "#001a33");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }

    function drawDripHead(d, progress) {
      var headY = d.y;
      if (headY < 0) return;

      var x = d.x + Math.sin(d.wobble + progress * 8) * d.wobbleAmp;
      var half = d.width * 0.42;
      var bulbH = d.width * 0.85;

      var bodyGrad = ctx.createLinearGradient(x, headY - bulbH, x, headY + bulbH * 0.5);
      bodyGrad.addColorStop(0, d.pal.fill);
      bodyGrad.addColorStop(0.7, d.pal.fill);
      bodyGrad.addColorStop(1, "rgba(255,255,255,0.2)");

      ctx.save();
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 0.95;
      ctx.fillStyle = bodyGrad;
      ctx.shadowColor = d.pal.glow;
      ctx.shadowBlur = 22;

      ctx.beginPath();
      ctx.moveTo(x, headY - bulbH * 0.2);
      ctx.bezierCurveTo(
        x - half, headY - bulbH * 0.5,
        x - half * 0.95, headY + bulbH * 0.35,
        x, headY + bulbH * 0.55
      );
      ctx.bezierCurveTo(
        x + half * 0.95, headY + bulbH * 0.35,
        x + half, headY - bulbH * 0.5,
        x, headY - bulbH * 0.2
      );
      ctx.closePath();
      ctx.fill();

      ctx.globalAlpha = 0.35;
      ctx.shadowBlur = 0;
      ctx.fillStyle = d.pal.fill;
      ctx.fillRect(x - half * 0.15, Math.max(0, headY - bulbH * 1.4), half * 0.3, bulbH * 0.9);
      ctx.restore();
    }

    function punchReveal(d) {
      var x = d.x + Math.sin(d.wobble) * d.wobbleAmp * 0.5;
      var half = d.width * 0.5;
      var headY = Math.min(h + 40, d.y);

      if (headY <= 0) return;

      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.moveTo(x - half * 0.7, 0);
      ctx.lineTo(x + half * 0.7, 0);
      ctx.bezierCurveTo(
        x + half, headY * 0.55,
        x + half * 0.85, headY * 0.92,
        x, headY + 6
      );
      ctx.bezierCurveTo(
        x - half * 0.85, headY * 0.92,
        x - half, headY * 0.55,
        x - half * 0.7, 0
      );
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    function frame(ts) {
      if (!running) return;
      if (!start) start = ts;
      var elapsed = ts - start;
      var t = Math.min(1, elapsed / duration);

      ctx.clearRect(0, 0, w, h);
      drawCover();

      drips.forEach(function (d) {
        var localT = Math.max(0, Math.min(1, (t - d.delay) / (1 - d.delay * 0.5)));
        d.y = -h * 0.08 + localT * (h * 1.2 + d.speed * 0.15);
        punchReveal(d);
      });

      drips.forEach(function (d) {
        var localT = Math.max(0, Math.min(1, (t - d.delay) / (1 - d.delay * 0.5)));
        drawDripHead(d, localT);
      });

      if (t >= 1) {
        running = false;
        if (onComplete) onComplete();
        return;
      }

      raf = global.requestAnimationFrame(frame);
    }

    resize();
    raf = global.requestAnimationFrame(frame);

    global.addEventListener("resize", resize);

    return function stop() {
      running = false;
      global.cancelAnimationFrame(raf);
      global.removeEventListener("resize", resize);
    };
  }

  function play() {
    if (!shouldPlay()) return;

    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/tff-cinematic.css";
    document.head.appendChild(link);

    document.documentElement.classList.add("tff-cine-active");
    document.body.classList.add("tff-cine-pending");

    var overlay = buildOverlay();
    document.body.appendChild(overlay);

    var intro = overlay.querySelector(".tff-cine-intro");
    var canvas = overlay.querySelector(".tff-cine-drip-canvas");
    var stopDrips = null;
    var finished = false;

    function finish(fast) {
      if (finished) return;
      finished = true;
      dismiss(overlay, stopDrips, fast);
    }

    var skip = overlay.querySelector(".tff-cine-skip");
    skip.addEventListener("click", function () {
      finish(true);
    });

    setTimeout(function () {
      intro.classList.add("is-out");
      revealHome();
      overlay.classList.add("is-dripping");
      stopDrips = startDripReveal(canvas, function () {
        finish(false);
      });
    }, 2000);

    setTimeout(function () {
      finish(false);
    }, 5800);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", play);
  } else {
    play();
  }

  global.TFFCinematic = {
    replay: function () {
      try {
        sessionStorage.removeItem(SESSION_KEY);
        sessionStorage.removeItem("tff-cine-seen-v2");
        sessionStorage.removeItem("tff-cine-seen-v1");
      } catch (e) {}
      global.location.href = "/?welcome=1";
    }
  };
})(typeof window !== "undefined" ? window : global);