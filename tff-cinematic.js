/**
 * Minimal cinematic welcome — quick, clean greeting for TheraBreath guests.
 */
(function (global) {
  var SESSION_KEY = "tff-cine-seen-v4";

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
      '<div class="tff-cine-backdrop" aria-hidden="true"></div>' +
      '<div class="tff-cine-panel">' +
      '<span class="tff-cine-mark" aria-hidden="true">TFF</span>' +
      '<p class="tff-cine-from">The Flavor Factory</p>' +
      '<h1 class="tff-cine-welcome">Welcome, TheraBreath Team</h1>' +
      '<p class="tff-cine-sub">Breath of Innovation · July 8, 2026</p>' +
      '<div class="tff-cine-bar" aria-hidden="true"><span></span></div>' +
      "</div>" +
      '<button type="button" class="tff-cine-skip">Skip</button>';
    return el;
  }

  function revealHome() {
    document.body.classList.remove("tff-cine-pending");
    document.body.classList.add("tff-cine-revealed");
  }

  function dismiss(overlay, fast) {
    if (!overlay || overlay.classList.contains("is-done")) return;
    markSeen();
    revealHome();
    document.documentElement.classList.remove("tff-cine-active");

    if (fast) {
      overlay.remove();
      return;
    }

    overlay.classList.add("is-out");
    setTimeout(function () {
      overlay.classList.add("is-done");
      setTimeout(function () {
        overlay.remove();
      }, 400);
    }, 480);
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

    var finished = false;

    function finish(fast) {
      if (finished) return;
      finished = true;
      dismiss(overlay, fast);
    }

    requestAnimationFrame(function () {
      overlay.classList.add("is-in");
    });

    overlay.querySelector(".tff-cine-skip").addEventListener("click", function () {
      finish(true);
    });

    setTimeout(function () {
      finish(false);
    }, 2600);
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
        sessionStorage.removeItem("tff-cine-seen-v3");
        sessionStorage.removeItem("tff-cine-seen-v2");
        sessionStorage.removeItem("tff-cine-seen-v1");
      } catch (e) {}
      global.location.href = "/?welcome=1";
    }
  };
})(typeof window !== "undefined" ? window : global);