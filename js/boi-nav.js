(function () {
  var slot = document.getElementById("boi-nav");
  if (!slot || !window.BOI) return;

  var links = (BOI.nav || []).map(function (item) {
    var cls = item.cta ? " cta" : "";
    return '<a href="' + item.href + '" class="' + cls.trim() + '">' + item.label + "</a>";
  }).join("");

  var tb = BOI.links && BOI.links.therabreath;
  var ext = "";
  if (tb) {
    var isExternal = /^https?:\/\//i.test(tb);
    var attrs = isExternal ? ' target="_blank" rel="noopener"' : "";
    var title = isExternal ? "Open TheraBreath visit site" : "July 8 visit guide";
    var label = isExternal ? "Visit site →" : "Visit guide →";
    ext = '<a class="boi-nav-ext" href="' + tb + '"' + attrs + ' title="' + title + '">' + label + "</a>";
  }

  slot.className = "boi-nav";
  slot.innerHTML =
    '<a class="boi-brand" href="/visit"><span class="boi-mark">TFF</span> Breath of Innovation</a>' +
    '<div class="boi-nav-links">' +
    links +
    ext +
    "</div>";

  var path = location.pathname.replace(/\/$/, "") || "/";
  slot.querySelectorAll(".boi-nav-links a").forEach(function (a) {
    var href = a.getAttribute("href");
    if (href === path || (path === "/index.html" && href === "/visit")) {
      a.classList.add("on");
    }
  });
})();