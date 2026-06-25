(function (global) {
  var CSS_HREF = "/css/tff-warm.css?v=2";
  var BOTTLES = [
    "clean-mint",
    "revitalizing-mint",
    "rainforest-mint",
    "dazzling-mint",
    "tingling-mint",
    "grapes-galore",
    "wacky-watermelon",
    "strawberry-splash",
    "bubble-gum",
    "overnight"
  ];

  var SCATTER = [
    { slug: "clean-mint", left: "1%", top: "12%", rot: "-12deg", op: 0.18, delay: "0.05s" },
    { slug: "revitalizing-mint", left: "91%", top: "8%", rot: "10deg", op: 0.2, delay: "0.12s" },
    { slug: "grapes-galore", left: "3%", top: "68%", rot: "7deg", op: 0.17, delay: "0.2s" },
    { slug: "wacky-watermelon", left: "93%", top: "64%", rot: "-8deg", op: 0.19, delay: "0.18s" },
    { slug: "rainforest-mint", left: "0.5%", top: "42%", rot: "5deg", op: 0.15, delay: "0.28s" },
    { slug: "dazzling-mint", left: "94%", top: "38%", rot: "-6deg", op: 0.16, delay: "0.32s" }
  ];

  function ensureWarmCss() {
    if (document.querySelector('link[href*="tff-warm.css"]')) return;
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = CSS_HREF;
    document.head.appendChild(link);
  }

  function ensureDecorRoot() {
    var el = document.getElementById("tff-decor");
    if (el) return el;
    el = document.createElement("div");
    el.id = "tff-decor";
    el.className = "tff-decor";
    el.setAttribute("aria-hidden", "true");
    document.body.insertBefore(el, document.body.firstChild);
    return el;
  }

  function mountScatter() {
    if (global.matchMedia("(max-width: 520px)").matches) return;
    var root = ensureDecorRoot();
    if (root.dataset.scatter === "1") return;
    root.dataset.scatter = "1";
    SCATTER.forEach(function (cfg) {
      if (BOTTLES.indexOf(cfg.slug) < 0) return;
      var wrap = document.createElement("div");
      wrap.className = "tff-decor-bottle";
      wrap.style.left = cfg.left;
      wrap.style.top = cfg.top;
      wrap.style.setProperty("--rot", cfg.rot);
      wrap.style.setProperty("--op", String(cfg.op));
      wrap.style.animationDelay = cfg.delay;
      var img = document.createElement("img");
      img.src = "/assets/bottles/" + cfg.slug + ".png?v=2";
      img.alt = "";
      img.loading = "lazy";
      img.decoding = "async";
      wrap.appendChild(img);
      root.appendChild(wrap);
    });
  }

  function init() {
    document.body.classList.add("tff-warm");
    ensureWarmCss();
    mountScatter();
  }

  global.TFFDecor = { init: init, mountScatter: mountScatter };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(typeof window !== "undefined" ? window : global);