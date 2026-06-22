/**
 * Minimal guest chrome — agenda, mapping, scorecard only.
 */
(function (global) {
  var LINKS = [
    { href: "/", label: "Agenda", match: ["/", "/index.html", "/agenda", "/visit"] },
    { href: "/brief", label: "Brief", match: ["/brief"] },
    { href: "/mystery", label: "Mapping", match: ["/mystery"] },
    { href: "/score", label: "Scorecard", match: ["/score"], cta: true }
  ];

  function path() {
    var p = (global.location.pathname || "/").replace(/\/$/, "") || "/";
    return p;
  }

  function isActive(item) {
    var p = path();
    if (item.match) return item.match.indexOf(p) !== -1;
    return p === item.href;
  }

  function mountNav() {
    var slot = document.getElementById("guest-nav");
    if (!slot) return;
    var html = '<a class="guest-brand" href="/">TFF × TheraBreath</a><div class="guest-links">';
    LINKS.forEach(function (item) {
      var cls = isActive(item) ? " on" : "";
      if (item.cta && !isActive(item)) cls += " cta";
      html += '<a class="' + cls.trim() + '" href="' + item.href + '">' + item.label + "</a>";
    });
    html += "</div>";
    slot.className = "guest-nav";
    slot.innerHTML = html;
  }

  global.TFFGuest = { mountNav: mountNav };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountNav);
  } else {
    mountNav();
  }
})();