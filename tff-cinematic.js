/**
 * Cinematic 3D welcome — bold black-stage intro, dissolves into homepage.
 */
(function (global) {
  var SESSION_KEY = "tff-cine-seen-v5";

  var COLORS = ["#008fd3", "#5fb832", "#90e0ef", "#f58220"];

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
      '<div class="tff-cine-vignette" aria-hidden="true"></div>' +
      '<div class="tff-cine-scene" aria-hidden="true">' +
      '<div class="tff-cine-orbit"><div class="tff-cine-ring tff-cine-ring-a"></div></div>' +
      '<div class="tff-cine-orbit tff-cine-orbit-b"><div class="tff-cine-ring tff-cine-ring-b"></div></div>' +
      '<div class="tff-cine-orbit tff-cine-orbit-c"><div class="tff-cine-prism"></div></div>' +
      '<div class="tff-cine-orb tff-cine-orb-a"></div>' +
      '<div class="tff-cine-orb tff-cine-orb-b"></div>' +
      "</div>" +
      '<div class="tff-cine-stage">' +
      '<h1 class="tff-cine-headline">' +
      '<span class="tff-cine-headline-line">The Flavor Factory</span>' +
      '<span class="tff-cine-headline-line tff-cine-headline-accent">Welcomes the TheraBreath Team</span>' +
      "</h1>" +
      '<p class="tff-cine-tag">Breath of Innovation · Capabilities Workshop · July 8, 2026 · Norco, CA</p>' +
      "</div>" +
      '<div class="tff-cine-dissolve" aria-hidden="true"></div>' +
      '<button type="button" class="tff-cine-skip">Skip</button>';
    return el;
  }

  function startScene(canvas, overlay) {
    var ctx = canvas.getContext("2d");
    if (!ctx) return function () {};

    var dpr = Math.min(global.devicePixelRatio || 1, 2);
    var w = 0;
    var h = 0;
    var raf = 0;
    var running = true;
    var dissolving = false;
    var dissolveStart = 0;
    var dissolveDur = 1100;
    var t = 0;
    var particles = [];
    var count = 140;

    function resize() {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function seed() {
      particles = [];
      for (var i = 0; i < count; i++) {
        particles.push({
          x: (Math.random() - 0.5) * w * 1.4,
          y: (Math.random() - 0.5) * h * 1.4,
          z: Math.random() * 900 + 80,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          vz: Math.random() * 0.6 + 0.15,
          c: COLORS[i % COLORS.length],
          size: Math.random() * 2.2 + 0.6
        });
      }
    }

    function project(p, rotY, rotX) {
      var cosY = Math.cos(rotY);
      var sinY = Math.sin(rotY);
      var cosX = Math.cos(rotX);
      var sinX = Math.sin(rotX);

      var x1 = p.x * cosY - p.z * sinY;
      var z1 = p.x * sinY + p.z * cosY;
      var y1 = p.y * cosX - z1 * sinX;
      var z2 = p.y * sinX + z1 * cosX;

      var fov = 520;
      var scale = fov / (fov + z2);
      return {
        x: w * 0.5 + x1 * scale,
        y: h * 0.5 + y1 * scale,
        z: z2,
        scale: scale
      };
    }

    function drawGrid(rotY, rotX, alpha) {
      var lines = 10;
      var span = 420;
      ctx.save();
      ctx.globalAlpha = alpha * 0.35;
      ctx.strokeStyle = "rgba(0, 143, 211, 0.22)";
      ctx.lineWidth = 1;

      for (var i = -lines; i <= lines; i++) {
        var offset = (i / lines) * span;
        var a = project({ x: -span, y: 0, z: offset }, rotY, rotX);
        var b = project({ x: span, y: 0, z: offset }, rotY, rotX);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();

        var c = project({ x: offset, y: 0, z: -span }, rotY, rotX);
        var d = project({ x: offset, y: 0, z: span }, rotY, rotX);
        ctx.beginPath();
        ctx.moveTo(c.x, c.y);
        ctx.lineTo(d.x, d.y);
        ctx.stroke();
      }
      ctx.restore();
    }

    function frame(ts) {
      if (!running) return;
      t += 0.012;

      var dissolveT = 0;
      if (dissolving) {
        if (!dissolveStart) dissolveStart = ts;
        dissolveT = Math.min(1, (ts - dissolveStart) / dissolveDur);
      }

      var fade = dissolving ? 1 - dissolveT : 1;
      var burst = dissolving ? dissolveT * 2.8 : 0;

      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, w, h);

      var rotY = t * 0.22;
      var rotX = 0.42 + Math.sin(t * 0.35) * 0.08;

      drawGrid(rotY, rotX, fade);

      var projected = particles.map(function (p) {
        if (!dissolving) {
          p.x += p.vx;
          p.y += p.vy;
          p.z -= p.vz;
          if (p.z < 40) {
            p.z = 900 + Math.random() * 200;
            p.x = (Math.random() - 0.5) * w * 1.2;
            p.y = (Math.random() - 0.5) * h * 1.2;
          }
        } else {
          p.x += p.vx * (1 + burst * 3);
          p.y += p.vy * (1 + burst * 3) - burst * 1.2;
          p.z -= p.vz * (1 + burst * 2);
        }
        return { p: p, pt: project(p, rotY, rotX) };
      });

      projected.sort(function (a, b) {
        return b.pt.z - a.pt.z;
      });

      ctx.lineWidth = 1;
      projected.forEach(function (item, i) {
        var p = item.p;
        var pt = item.pt;
        if (pt.scale <= 0) return;

        for (var j = i + 1; j < projected.length && j < i + 18; j++) {
          var other = projected[j].pt;
          var dx = pt.x - other.x;
          var dy = pt.y - other.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            ctx.strokeStyle = "rgba(144, 224, 239, " + (0.14 * fade * (1 - dist / 90)) + ")";
            ctx.beginPath();
            ctx.moveTo(pt.x, pt.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }

        var glow = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, p.size * 8 * pt.scale);
        glow.addColorStop(0, p.c);
        glow.addColorStop(1, "transparent");
        ctx.globalAlpha = fade * Math.min(1, pt.scale * 1.4);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, p.size * 3.5 * pt.scale, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;

      if (dissolving && dissolveT >= 1) {
        running = false;
        return;
      }

      raf = global.requestAnimationFrame(frame);
    }

    resize();
    raf = global.requestAnimationFrame(frame);
    global.addEventListener("resize", resize);

    return {
      stop: function () {
        running = false;
        global.cancelAnimationFrame(raf);
        global.removeEventListener("resize", resize);
      },
      dissolve: function () {
        dissolving = true;
        overlay.classList.add("is-dissolving");
      }
    };
  }

  function revealHome() {
    document.body.classList.remove("tff-cine-pending");
    document.body.classList.add("tff-cine-revealed");
  }

  function dismiss(overlay, scene, fast) {
    if (!overlay || overlay.classList.contains("is-done")) return;
    markSeen();

    if (fast) {
      if (scene) scene.stop();
      revealHome();
      document.documentElement.classList.remove("tff-cine-active");
      overlay.remove();
      return;
    }

    revealHome();
    if (scene) scene.dissolve();

    overlay.classList.add("is-dissolving");
    document.documentElement.classList.remove("tff-cine-active");

    setTimeout(function () {
      if (scene) scene.stop();
      overlay.classList.add("is-done");
      setTimeout(function () {
        overlay.remove();
      }, 200);
    }, 1150);
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

    var canvas = overlay.querySelector(".tff-cine-canvas");
    var scene = startScene(canvas, overlay);
    var finished = false;

    function finish(fast) {
      if (finished) return;
      finished = true;
      dismiss(overlay, scene, fast);
    }

    requestAnimationFrame(function () {
      overlay.classList.add("is-in");
    });

    overlay.querySelector(".tff-cine-skip").addEventListener("click", function () {
      finish(true);
    });

    setTimeout(function () {
      finish(false);
    }, 3400);
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
        sessionStorage.removeItem("tff-cine-seen-v4");
        sessionStorage.removeItem("tff-cine-seen-v3");
        sessionStorage.removeItem("tff-cine-seen-v2");
        sessionStorage.removeItem("tff-cine-seen-v1");
      } catch (e) {}
      global.location.href = "/?welcome=1";
    }
  };
})(typeof window !== "undefined" ? window : global);