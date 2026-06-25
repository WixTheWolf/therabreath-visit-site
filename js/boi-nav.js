(function () {
  var slot = document.getElementById("boi-nav");
  if (!slot || !window.BOI) return;

  var links = (BOI.nav || []).map(function (item) {
    var cls = item.cta ? " cta" : "";
    return '<a href="' + item.href + '" class="' + cls.trim() + '">' + item.label + "</a>";
  }).join("");

  var tb = BOI.links && BOI.links.therabreath;
  var ext = tb
    ? '<a class="boi-nav-ext" href="' + tb + '" target="_blank" rel="noopener" title="Open therabreath.com">TheraBreath →</a>'
    : "";

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