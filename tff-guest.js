/**
 * Minimal guest chrome — agenda, presentation, portfolio, tasting.
 */
(function (global) {
  var LINKS = [
    { href: "/", label: "Home", match: ["/", "/index.html", "/agenda"] },
    { href: "/find", label: "Find", match: ["/find"], find: true },
    { href: "/visit", label: "Day hub", match: ["/visit", "/taste"] },
    { href: "/present", label: "Slides", match: ["/present", "/presentation"] },
    { href: "/mystery", label: "Mapping", match: ["/mystery", "/map"] },
    { href: "/score", label: "Score", cta: true, match: ["/score"] }
  ];

  function path() {
    var p = (global.location.pathname || "/").replace(/\/$/, "") || "/";
    return p;
  }

  function isActive(item) {
    var p = path();
    if (item.match && item.match.length) return item.match.indexOf(p) !== -1;
    return p === item.href;
  }

  function mountNav() {
    var slot = document.getElementById("guest-nav");
    if (!slot) return;
    var html = '<a class="guest-brand" href="/">TFF × TheraBreath</a><div class="guest-links">';
    LINKS.forEach(function (item) {
      var cls = isActive(item) ? " on" : "";
      if (item.cta && !isActive(item)) cls += " cta";
      if (item.find && !isActive(item)) cls += " find-link";
      html += '<a class="' + cls.trim() + '" href="' + item.href + '">' + item.label + "</a>";
    });
    html += "</div>";
    slot.className = "guest-nav";
    slot.innerHTML = html;
  }

  function loadDecor() {
    if (document.querySelector('script[src*="tff-decor.js"]')) return;
    var s = document.createElement("script");
    s.src = "/js/tff-decor.js";
    s.defer = true;
    document.body.appendChild(s);
  }

  global.TFFGuest = { mountNav: mountNav };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      mountNav();
      loadDecor();
    });
  } else {
    mountNav();
    loadDecor();
  }
})();