/**
 * TFF site shell — global nav, mobile dock, scroll reveals, micro-celebrations.
 */
(function (global) {
  var PRIMARY = [
    { href: "/", label: "Home", match: ["/", "/index.html"] },
    { href: "/visit", label: "Visit", title: "Visit guide", match: ["/visit"] },
    { href: "/workshop", label: "Workshop", match: ["/workshop"] },
    { href: "/lakewood", label: "Lakewood", title: "Lakewood site parity", match: ["/lakewood"] },
    { href: "/mystery", label: "Mapping", title: "Blind Flavor Mapping", fun: true, match: ["/mystery"] },
    { href: "/score", label: "Scorecard", title: "Prototype Scorecard", cta: true, match: ["/score"] }
  ];

  var MORE = [
    { href: "/concepts", label: "Ten directions", match: ["/concepts"] },
    { href: "/workshop#agenda", label: "Agenda" },
    { href: "/workshop#capabilities", label: "Capabilities" },
    { href: "/workshop#next", label: "Next steps" },
    { href: "/onepager", label: "Executive one-pager" },
    { href: "/booklet", label: "Welcome packet" },
    { href: "/passport", label: "Visitor passport" },
    { href: "/slides", label: "Slide deck" },
    { href: "/companies", label: "Companies", match: ["/companies", "/flavor-factory", "/therabreath-brand"] },
    { href: "/qr", label: "QR print sheet" },
    { href: "/stations", label: "Station signs" },
    { href: "/gate", label: "Team sign-in", signin: true },
    { href: "/toolkit", label: "Command center", authedOnly: true },
    { href: "/mystery-live", label: "Blind Flavor Mapping live", authedOnly: true },
    { href: "/score-live", label: "Sensory summary live", authedOnly: true }
  ];

  function isTeamAuthed() {
    return global.TFF && global.TFF.isAuthed && global.TFF.isAuthed();
  }

  function moreMenuItems() {
    return MORE.filter(function (item) {
      if (item.signin) return !isTeamAuthed();
      if (item.authedOnly) return isTeamAuthed();
      return true;
    });
  }

  var DOCK = [
    { href: "/", label: "Home", icon: "home" },
    { href: "/visit", label: "Visit", icon: "workshop" },
    { href: "/mystery", label: "Mapping", icon: "mystery" },
    { href: "/score", label: "Scorecard", icon: "score" }
  ];

  var ICONS = {
    home: '<path d="M4 10.5L12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z"/>',
    workshop: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M8 9h8M8 13h5"/>',
    mystery: '<circle cx="12" cy="12" r="8"/><path d="M9.5 9.5a2.5 2.5 0 0 1 4.5 1.5c0 2-2.5 2-2.5 4"/><circle cx="12" cy="17" r="0.5" fill="currentColor" stroke="none"/>',
    score: '<path d="M6 18l4-10 4 6 4-10 2 14H6z"/>'
  };

  function path() {
    var p = (global.location.pathname || "/").replace(/\/$/, "") || "/";
    return p;
  }

  function isActive(item) {
    var p = path();
    var list = item.match || [item.href];
    return list.some(function (m) {
      return m === p || (m !== "/" && p.indexOf(m) === 0);
    });
  }

  function mode() {
    var el = document.documentElement;
    return el.getAttribute("data-tff-shell") || "inject";
  }

  function prefersReducedMotion() {
    return global.matchMedia && global.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function navHtml(team) {
    var p = path();
    var links = PRIMARY.map(function (item) {
      var cls = "tff-shell-link";
      if (isActive(item)) cls += " is-active";
      if (item.fun) cls += " tff-shell-fun";
      if (item.cta) cls += " tff-shell-cta";
      var title = item.title ? ' title="' + item.title + '"' : "";
      return '<a class="' + cls + '" href="' + item.href + '"' + title + ">" + item.label + "</a>";
    }).join("");

    var moreItems = moreMenuItems().map(function (item) {
      var active = isActive(item) ? " is-active" : "";
      return '<a href="' + item.href + '" class="' + active + '">' + item.label + "</a>";
    }).join("");

    var hideBack = p === "/" || p === "/index.html";
    return (
      '<header class="tff-shell-nav' + (team ? " tff-team" : "") + '" id="tff-shell-nav" role="banner">' +
      '<div class="tff-shell-start">' +
      '<button type="button" class="tff-shell-back"' + (hideBack ? ' hidden' : '') + ' aria-label="Go back">' +
      '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      "</button>" +
      '<a class="tff-shell-brand" href="/" aria-label="Breath of Innovation hub home">' +
      '<span class="tff-shell-mark">TFF</span>' +
      "<span>Breath of Innovation<small>TFF × TheraBreath</small></span></a></div>" +
      '<button type="button" class="tff-shell-toggle" aria-label="Open menu" aria-expanded="false">' +
      "<span></span><span></span><span></span></button>" +
      '<nav class="tff-shell-links" aria-label="Site navigation">' +
      links +
      '<div class="tff-shell-more">' +
      '<button type="button" class="tff-shell-more-btn" aria-expanded="false">More ▾</button>' +
      '<div class="tff-shell-dropdown" role="menu">' + moreItems + "</div></div>" +
      "</nav>" +
      '<span class="tff-shell-meta">July 8 · Norco</span>' +
      "</header>"
    );
  }

  function bindShellBack(nav) {
    var back = nav.querySelector(".tff-shell-back");
    if (!back) return;
    back.addEventListener("click", function () {
      var ref = document.referrer || "";
      var sameHost = ref.indexOf(global.location.origin) === 0;
      if (sameHost && global.history.length > 1) {
        global.history.back();
      } else {
        global.location.href = "/";
      }
    });
  }

  function dockHtml() {
    return (
      '<nav class="tff-shell-dock" aria-label="Quick navigation">' +
      DOCK.map(function (item) {
        var cls = isActive(item) ? " is-active" : "";
        if (item.fun) cls += " tff-dock-fun";
        return (
          '<a href="' + item.href + '" class="' + cls + '">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true">' + ICONS[item.icon] + "</svg>" +
          "<span>" + item.label + "</span></a>"
        );
      }).join("") +
      "</nav>"
    );
  }

  function bindNav(nav) {
    bindShellBack(nav);
    var toggle = nav.querySelector(".tff-shell-toggle");
    var more = nav.querySelector(".tff-shell-more");
    var moreBtn = nav.querySelector(".tff-shell-more-btn");

    if (toggle) {
      toggle.addEventListener("click", function () {
        var open = nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }

    if (moreBtn && more) {
      moreBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        var open = more.classList.toggle("is-open");
        moreBtn.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }

    nav.querySelectorAll(".tff-shell-links > a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("is-open");
        if (toggle) toggle.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("click", function () {
      if (more) more.classList.remove("is-open");
      if (moreBtn) moreBtn.setAttribute("aria-expanded", "false");
    });
  }

  function initReveal() {
    if (prefersReducedMotion()) {
      document.querySelectorAll(".tff-reveal, .tff-stagger").forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    if (!("IntersectionObserver" in global)) {
      document.querySelectorAll(".tff-reveal, .tff-stagger").forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    document.querySelectorAll(".tff-reveal, .tff-stagger").forEach(function (el) {
      io.observe(el);
    });
  }

  function initPageEnter() {
    if (prefersReducedMotion()) return;
    var main =
      document.querySelector("main") ||
      document.querySelector(".wrap") ||
      document.querySelector(".intro") ||
      document.querySelector(".hero") ||
      document.querySelector(".page-hero") ||
      document.querySelector("header:not(.tff-shell-nav)");
    if (main && !main.classList.contains("tff-enter")) {
      main.classList.add("tff-enter");
    }
  }

  function enhanceInteractives() {
    document
      .querySelectorAll("a.card, a.thread, a.partner, a.tool, a.path, a.lane, a.sign")
      .forEach(function (el) {
        if (!el.classList.contains("tff-card-lift")) el.classList.add("tff-card-lift");
      });
    document.querySelectorAll(".sec, .section, .partner-grid, .quick").forEach(function (el) {
      if (!el.classList.contains("tff-reveal") && !el.classList.contains("tff-stagger")) {
        el.classList.add("tff-reveal");
      }
    });
  }

  function celebrate(x, y) {
    if (prefersReducedMotion()) return;
    var layer = document.createElement("div");
    layer.className = "tff-celebrate";
    var colors = ["#5fb832", "#008fd3", "#f58220", "#0a1628"];
    for (var i = 0; i < 14; i++) {
      var bit = document.createElement("span");
      bit.className = "tff-confetti";
      bit.style.left = (x + (Math.random() - 0.5) * 80) + "px";
      bit.style.top = (y + (Math.random() - 0.5) * 20) + "px";
      bit.style.background = colors[i % colors.length];
      bit.style.animationDelay = (Math.random() * 0.15) + "s";
      layer.appendChild(bit);
    }
    document.body.appendChild(layer);
    setTimeout(function () {
      layer.remove();
    }, 1000);
  }

  function injectHeadMeta() {
    var head = document.head;
    if (!document.querySelector('link[rel="icon"]')) {
      var icon = document.createElement("link");
      icon.rel = "icon";
      icon.type = "image/svg+xml";
      icon.href = "/assets/favicon.svg";
      head.appendChild(icon);
    }
    if (!document.querySelector('meta[name="theme-color"]')) {
      var theme = document.createElement("meta");
      theme.name = "theme-color";
      theme.content = "#0a1628";
      head.appendChild(theme);
    }
    if (!document.querySelector('meta[property="og:image"]')) {
      var og = document.createElement("meta");
      og.setAttribute("property", "og:image");
      og.content = "https://therabreath-visit-site.vercel.app/assets/og-share.svg";
      head.appendChild(og);
    }
  }

  function inject() {
    injectHeadMeta();
    var m = mode();
    if (m === "off") return;

    document.documentElement.classList.add("tff-has-shell");

    if (m !== "native") {
      var team = m === "team" || path() === "/toolkit" || path() === "/gate";
      var wrap = document.createElement("div");
      wrap.innerHTML = navHtml(team);
      var nav = wrap.firstChild;
      document.body.insertBefore(nav, document.body.firstChild);
      bindNav(nav);
    }

    if (m !== "off") {
      document.documentElement.classList.add("tff-has-dock");
      var dockWrap = document.createElement("div");
      dockWrap.innerHTML = dockHtml();
      document.body.appendChild(dockWrap.firstChild);
    }

    enhanceInteractives();
    initReveal();
    initPageEnter();
  }

  function refreshTeamMenu() {
    var nav = document.getElementById("tff-shell-nav");
    if (!nav) return;
    var dropdown = nav.querySelector(".tff-shell-dropdown");
    if (!dropdown) return;
    dropdown.innerHTML = moreMenuItems()
      .map(function (item) {
        var active = isActive(item) ? " is-active" : "";
        return '<a href="' + item.href + '" class="' + active + '">' + item.label + "</a>";
      })
      .join("");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inject);
  } else {
    inject();
  }

  global.addEventListener("pageshow", function () {
    refreshTeamMenu();
  });

  global.TFFShell = {
    celebrate: celebrate,
    refresh: inject,
    refreshTeamMenu: refreshTeamMenu
  };
})(typeof window !== "undefined" ? window : global);