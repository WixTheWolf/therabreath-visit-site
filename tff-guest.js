/**
 * Minimal guest chrome — agenda, presentation, portfolio, tasting.
 */
(function (global) {
  var LIVE = "https://breath-of-innovation.vercel.app";
  var LINKS = [
    { href: "/", label: "Agenda", match: ["/", "/index.html", "/agenda", "/visit"] },
    { href: LIVE + "/present", label: "Slides", external: true, match: [] },
    { href: LIVE + "/portfolio", label: "Flavors", external: true, match: [] },
    { href: "/brief", label: "Brief", match: ["/brief"] },
    { href: "/mystery", label: "Mapping", match: ["/mystery"] },
    { href: "/score", label: "Scorecard", match: ["/score"] },
    { href: LIVE, label: "Live hub", external: true, cta: true, match: [] }
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
      var extra = item.external ? ' target="_blank" rel="noopener"' : "";
      html += '<a class="' + cls.trim() + '" href="' + item.href + '"' + extra + ">" + item.label + "</a>";
    });
    html += "</div>";
    slot.className = "guest-nav";
    slot.innerHTML = html;
  }

  global.TFFGuest = { mountNav: mountNav, LIVE_SITE: LIVE };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountNav);
  } else {
    mountNav();
  }
})();