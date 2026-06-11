/**
 * Flavor-driven cinematic welcome — wipes across taste territories, then reveals home.
 */
(function (global) {
  var SESSION_KEY = "tff-cine-seen-v2";

  var FLAVORS = [
    {
      name: "Spearmint",
      note: "Cool · Garden · Green",
      bg: "linear-gradient(135deg, #0d2818 0%, #2d6a3f 35%, #5fb832 100%)",
      accent: "#b8f5a0"
    },
    {
      name: "Icy Peak",
      note: "Bright · Arctic · Clean",
      bg: "linear-gradient(135deg, #001a33 0%, #006aa6 40%, #00b4d8 100%)",
      accent: "#caf0f8"
    },
    {
      name: "Warm Ginger",
      note: "Spice · Earth · Finish",
      bg: "linear-gradient(135deg, #2a1208 0%, #c45c26 45%, #f58220 100%)",
      accent: "#ffd6a5"
    },
    {
      name: "Green Tea",
      note: "Botanical · Steamed · Soft",
      bg: "linear-gradient(135deg, #0a1f14 0%, #2d6a4f 50%, #7cb87a 100%)",
      accent: "#d8f3dc"
    },
    {
      name: "Crystal Mint",
      note: "Whitening · Icy · Bold",
      bg: "linear-gradient(135deg, #0a1628 0%, #008fd3 50%, #90e0ef 100%)",
      accent: "#ffffff"
    }
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

  function flavorPanelsHtml() {
    return FLAVORS.map(function (f, i) {
      return (
        '<div class="tff-cine-flavor" style="--flavor-bg:' + f.bg + ";--flavor-accent:" + f.accent + '" data-i="' + i + '">' +
        '<div class="tff-cine-flavor-inner">' +
        '<span class="tff-cine-flavor-idx">0' + (i + 1) + "</span>" +
        '<h2 class="tff-cine-flavor-name">' + f.name + "</h2>" +
        '<p class="tff-cine-flavor-note">' + f.note + "</p>" +
        "</div></div>"
      );
    }).join("");
  }

  function buildOverlay() {
    var el = document.createElement("div");
    el.className = "tff-cine";
    el.setAttribute("role", "presentation");
    el.setAttribute("aria-hidden", "true");
    el.innerHTML =
      '<canvas class="tff-cine-canvas" aria-hidden="true"></canvas>' +
      '<div class="tff-cine-grain" aria-hidden="true"></div>' +
      '<div class="tff-cine-letterbox tff-cine-letterbox-top" aria-hidden="true"></div>' +
      '<div class="tff-cine-letterbox tff-cine-letterbox-bottom" aria-hidden="true"></div>' +
      '<div class="tff-cine-flavors">' + flavorPanelsHtml() + "</div>" +
      '<div class="tff-cine-finale">' +
      '<p class="tff-cine-finale-kicker">The Flavor Factory × TheraBreath</p>' +
      '<h1 class="tff-cine-finale-title">Breath of Innovation</h1>' +
      '<p class="tff-cine-finale-sub">July 8 · Norco, California</p>' +
      "</div>" +
      '<div class="tff-cine-exit-wipe" aria-hidden="true"></div>' +
      '<button type="button" class="tff-cine-skip">Skip</button>';
    return el;
  }

  function startBokeh(canvas) {
    var ctx = canvas.getContext("2d");
    if (!ctx) return null;

    var dpr = Math.min(global.devicePixelRatio || 1, 2);
    var w = 0;
    var h = 0;
    var blobs = [];
    var palette = [
      { c: "#5fb832", a: 0.35 },
      { c: "#008fd3", a: 0.4 },
      { c: "#f58220", a: 0.28 },
      { c: "#90e0ef", a: 0.25 },
      { c: "#2d6a4f", a: 0.3 }
    ];
    var raf = 0;
    var running = true;
    var t = 0;

    function resize() {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function seed() {
      blobs = [];
      for (var i = 0; i < 14; i++) {
        var pal = palette[i % palette.length];
        blobs.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 120 + 80,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.25,
          c: pal.c,
          a: pal.a,
          phase: Math.random() * Math.PI * 2
        });
      }
    }

    function draw() {
      if (!running) return;
      t += 0.016;
      ctx.clearRect(0, 0, w, h);
      blobs.forEach(function (b) {
        b.x += b.vx;
        b.y += b.vy;
        if (b.x < -b.r) b.x = w + b.r;
        if (b.x > w + b.r) b.x = -b.r;
        if (b.y < -b.r) b.y = h + b.r;
        if (b.y > h + b.r) b.y = -b.r;
        var pulse = 0.85 + Math.sin(t * 1.2 + b.phase) * 0.15;
        var grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r * pulse);
        grad.addColorStop(0, b.c);
        grad.addColorStop(1, "transparent");
        ctx.globalAlpha = b.a;
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r * pulse, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      raf = global.requestAnimationFrame(draw);
    }

    resize();
    seed();
    draw();
    global.addEventListener("resize", function () {
      resize();
      seed();
    });

    return function stop() {
      running = false;
      global.cancelAnimationFrame(raf);
    };
  }

  function revealHome() {
    document.body.classList.remove("tff-cine-pending");
    document.body.classList.add("tff-cine-revealed");
  }

  function dismiss(overlay, stopBokeh, fast) {
    if (!overlay || overlay.classList.contains("is-done")) return;
    markSeen();
    if (stopBokeh) stopBokeh();
    revealHome();

    if (fast) {
      document.documentElement.classList.remove("tff-cine-active");
      overlay.remove();
      return;
    }

    overlay.classList.add("is-exiting");
    document.documentElement.classList.remove("tff-cine-active");
    setTimeout(function () {
      overlay.classList.add("is-done");
      setTimeout(function () {
        overlay.remove();
      }, 700);
    }, 1100);
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
    var stopBokeh = startBokeh(canvas);

    var skip = overlay.querySelector(".tff-cine-skip");
    skip.addEventListener("click", function () {
      dismiss(overlay, stopBokeh, true);
    });

    setTimeout(function () {
      overlay.classList.add("is-finale");
    }, 4200);

    setTimeout(function () {
      dismiss(overlay, stopBokeh);
    }, 7200);
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
        sessionStorage.removeItem("tff-cine-seen-v1");
      } catch (e) {}
      global.location.href = "/?welcome=1";
    }
  };
})(typeof window !== "undefined" ? window : global);