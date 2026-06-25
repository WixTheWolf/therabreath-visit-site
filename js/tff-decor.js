(function (global) {
  var CSS_HREF = "/css/tff-warm.css?v=3";
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
    { slug: "clean-mint", left: "0.5%", top: "10%", rot: "-12deg", op: 0.09, delay: "0.05s" },
    { slug: "revitalizing-mint", left: "93%", top: "6%", rot: "10deg", op: 0.1, delay: "0.12s" },
    { slug: "grapes-galore", left: "1%", top: "72%", rot: "7deg", op: 0.08, delay: "0.2s" },
    { slug: "wacky-watermelon", left: "94%", top: "70%", rot: "-8deg", op: 0.09, delay: "0.18s" },
    { slug: "rainforest-mint", left: "0%", top: "44%", rot: "5deg", op: 0.07, delay: "0.28s" },
    { slug: "dazzling-mint", left: "95%", top: "40%", rot: "-6deg", op: 0.08, delay: "0.32s" }
  ];

  function isLightThemePage() {
    var body = document.body;
    if (body.classList.contains("tff-warm")) return true;
    if (body.classList.contains("hub")) return true;
    if (body.classList.contains("dir-page")) return true;
    if (body.classList.contains("port-mode")) return true;
    if (document.querySelector(".guest-page")) return true;
    if (document.querySelector('link[href*="tff-guest.css"], link[href*="hub.css"]')) return true;
    return false;
  }

  function shouldScatter() {
    if (!isLightThemePage()) return false;
    if (global.matchMedia("(max-width: 520px)").matches) return false;
    return !!(document.querySelector(".guest-page, .hub-main"));
  }

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
    if (!shouldScatter()) return;
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
    if (!isLightThemePage()) return;
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