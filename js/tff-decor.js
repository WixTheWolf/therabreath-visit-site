(function (global) {
  var CSS_HREF = "/css/tff-warm.css?v=1";
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
    { slug: "clean-mint", left: "2%", top: "14%", rot: "-14deg", op: 0.42, delay: "0.05s" },
    { slug: "revitalizing-mint", left: "88%", top: "10%", rot: "11deg", op: 0.48, delay: "0.15s" },
    { slug: "grapes-galore", left: "6%", top: "62%", rot: "8deg", op: 0.4, delay: "0.25s" },
    { slug: "wacky-watermelon", left: "90%", top: "58%", rot: "-9deg", op: 0.44, delay: "0.2s" },
    { slug: "rainforest-mint", left: "1%", top: "38%", rot: "6deg", op: 0.32, delay: "0.3s" },
    { slug: "dazzling-mint", left: "92%", top: "34%", rot: "-7deg", op: 0.36, delay: "0.35s" },
    { slug: "strawberry-splash", left: "12%", top: "82%", rot: "-5deg", op: 0.3, delay: "0.4s" },
    { slug: "bubble-gum", left: "78%", top: "78%", rot: "10deg", op: 0.34, delay: "0.45s" }
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
      img.src = "/assets/bottles/" + cfg.slug + ".png?v=1";
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