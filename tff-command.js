/**
 * Command center utilities: unified search, share pack, thread dashboard.
 */
(function (global) {
  var SITE = global.location.origin;
  var INTENSITY_OPEN_KEY = "intensity-tiers-open-v2";
  var LAKEWOOD_KEY = "tff-lakewood";

  var intensityItems = [
    { id: "o1", title: "NCT03105960 reference sent", detail: "Ryan follow-up post-Mar 2", done: true },
    { id: "o2", title: "Allicin-specific literature", detail: "Ross Mar 2 request" },
    { id: "o3", title: "Diallyl disulfide (DADS) literature", detail: "Ross Mar 2 request" },
    { id: "o4", title: "1 g garlic clove efficacy studies", detail: "Ryan dose framing" },
    { id: "o5", title: "GA-22131 chlorite stability report", detail: "Ryan committed; Ross waiting" },
    { id: "o6", title: "Dan business-owner POV for Nelly", detail: "TB offensive vs Extra Mild" },
    { id: "o7", title: "Ross Listerine synthesis", detail: "Walmart eval share-back" },
    { id: "o8", title: "Next functional sample direction", detail: "Pleasant odor + efficacy" }
  ];

  var lakewoodVariants = [
    { id: "icy", name: "Invigorating Icy Mint", tier: "a" },
    { id: "mild", name: "Mild Mint", tier: "b" },
    { id: "rain", name: "Rainforest Mint", tier: "b" },
    { id: "dazz", name: "Whitening Dazzling Mint", tier: "a" },
    { id: "cham", name: "Overnight Chamomile Mint", tier: "b" },
    { id: "revit", name: "Complete Revitalizing Mint", tier: "b" },
    { id: "gums", name: "Healthy Gums Clean Mint", tier: "b" },
    { id: "spark", name: "AntiCavity Sparkle Mint", tier: "a" }
  ];

  var sharePack = [
    { label: "Partnership hub", path: "/" },
    { label: "Workshop experience (room display)", path: "/workshop" },
    { label: "Lakewood site parity proposal", path: "/lakewood" },
    { label: "Triangle test kit (ISO 4120)", path: "/triangle" },
    { label: "Blind comparison kit", path: "/blind" },
    { label: "Slide deck + scoring sheet", path: "/slides" },
    { label: "Welcome booklet (PDF index)", path: "/booklet" },
    { label: "Visitor passport", path: "/passport" },
    { label: "Tasting station signs", path: "/stations" },
    { label: "Flavor mystery game", path: "/mystery" },
    { label: "Mystery live board (admin)", path: "/mystery-live" },
    { label: "Live concept scorer", path: "/score" },
    { label: "Score live board (admin)", path: "/score-live" },
    { label: "Executive one-pager", path: "/onepager" },
    { label: "QR code print sheet", path: "/qr" },
    { label: "Co-creation worksheet", path: "/worksheet" }
  ];

  function loadJson(key) {
    try {
      return JSON.parse(localStorage.getItem(key) || "{}");
    } catch (e) {
      return {};
    }
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    return Promise.resolve();
  }

  function toast(msg) {
    var el = document.getElementById("cmd-toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(el._t);
    el._t = setTimeout(function () {
      el.classList.remove("show");
    }, 2600);
  }

  function buildSharePackText() {
    var lines = [
      "TheraBreath × The Flavor Factory — shareable links",
      "July 8, 2026 capabilities workshop · Norco, CA",
      ""
    ];
    sharePack.forEach(function (item) {
      lines.push(item.label);
      lines.push(SITE + item.path);
      lines.push("");
    });
    lines.push("—");
    lines.push("Internal team portal (password required): " + SITE + "/gate");
    return lines.join("\n");
  }

  function copySharePack() {
    return copyText(buildSharePackText()).then(function () {
      toast("Share pack copied — paste into email to Ross / Nelly");
    });
  }

  function scoreMatch(text, query) {
    var t = text.toLowerCase();
    var q = query.toLowerCase().trim();
    if (!q) return 1;
    var words = q.split(/\s+/).filter(Boolean);
    var hits = 0;
    words.forEach(function (w) {
      if (t.indexOf(w) !== -1) hits++;
    });
    return hits / words.length;
  }

  function initSearch() {
    var input = document.getElementById("cmd-search");
    var results = document.getElementById("cmd-search-results");
    if (!input || !results) return;

    var index = [];
    var loaded = false;

    function render(query) {
      if (!loaded) {
        results.innerHTML = '<p class="cmd-search-empty">Loading index…</p>';
        return;
      }
      var q = (query || "").trim();
      if (!q) {
        results.innerHTML = "";
        results.classList.remove("open");
        return;
      }
      var matches = index
        .map(function (item) {
          return {
            item: item,
            score: scoreMatch(item.q + " " + item.snippet + " " + item.category, q)
          };
        })
        .filter(function (m) {
          return m.score > 0;
        })
        .sort(function (a, b) {
          return b.score - a.score;
        })
        .slice(0, 12);

      if (!matches.length) {
        results.innerHTML = '<p class="cmd-search-empty">No matches for “' + q + "”</p>";
        results.classList.add("open");
        return;
      }

      results.innerHTML = matches
        .map(function (m) {
          var it = m.item;
          var tag = it.type === "answer" ? "Answer" : "Ask them";
          var badge =
            it.badge === "session"
              ? '<span class="cmd-badge warn">In session</span>'
              : it.badge === "email"
                ? '<span class="cmd-badge email">Email</span>'
                : "";
          return (
            '<a class="cmd-search-hit" href="' +
            it.href +
            '?q=' +
            encodeURIComponent(q) +
            '">' +
            '<span class="cmd-search-meta"><b>' +
            tag +
            "</b> · " +
            it.category +
            badge +
            "</span>" +
            "<strong>" +
            it.q +
            "</strong>" +
            '<span class="cmd-search-snippet">' +
            it.snippet +
            "</span></a>"
          );
        })
        .join("");
      results.classList.add("open");
    }

    fetch("/search-index.json")
      .then(function (r) {
        return r.json();
      })
      .then(function (data) {
        index = data;
        loaded = true;
        render(input.value);
      })
      .catch(function () {
        results.innerHTML = '<p class="cmd-search-empty">Search index unavailable</p>';
      });

    input.addEventListener("input", function () {
      render(input.value);
    });
    input.addEventListener("focus", function () {
      if (input.value.trim()) render(input.value);
    });
    document.addEventListener("click", function (e) {
      if (!e.target.closest(".cmd-search-wrap")) {
        results.classList.remove("open");
      }
    });
  }

  function renderDashboard() {
    var el = document.getElementById("cmd-dashboard");
    if (!el) return;

    var intensityState = loadJson(INTENSITY_OPEN_KEY);
    var intensityOpen = intensityItems.filter(function (item) {
      return !item.done && !intensityState[item.id];
    });
    var intensityDone = intensityItems.length - intensityOpen.length;

    var lakewoodState = loadJson(LAKEWOOD_KEY);
    var lakewoodFlagged = [];
    var lakewoodActive = [];
    var lakewoodPass = 0;
    lakewoodVariants.forEach(function (v) {
      var s = lakewoodState[v.id] || { result: "pending", steps: {} };
      if (s.result === "pass") lakewoodPass++;
      else if (s.result === "flag") lakewoodFlagged.push(v);
      else if (s.steps && (s.steps.expert || s.steps.triangle)) lakewoodActive.push(v);
    });

    var html = '<div class="dash-grid">';

    html += '<div class="dash-card">';
    html += '<div class="dash-head"><h3>Listerine + GA-22131</h3><a href="/intensity-tiers">Open thread →</a></div>';
    html +=
      '<p class="dash-stat"><strong>' +
      intensityOpen.length +
      "</strong> open · <strong>" +
      intensityDone +
      "</strong> done</p>";
    if (intensityOpen.length) {
      html += '<ul class="dash-list">';
      intensityOpen.slice(0, 5).forEach(function (item) {
        html += "<li><b>" + item.title + "</b><span>" + item.detail + "</span></li>";
      });
      if (intensityOpen.length > 5) {
        html += "<li class=\"more\">+" + (intensityOpen.length - 5) + " more on thread page</li>";
      }
      html += "</ul>";
    } else {
      html += '<p class="dash-ok">All intensity-tier items checked off.</p>';
    }
    html += "</div>";

    html += '<div class="dash-card">';
    html += '<div class="dash-head"><h3>Lakewood validation</h3><a href="/lakewood-tracker">Open tracker →</a></div>';
    html +=
      '<p class="dash-stat"><strong>' +
      lakewoodPass +
      "</strong> parity · <strong>" +
      lakewoodFlagged.length +
      "</strong> flagged · <strong>" +
      (lakewoodVariants.length - lakewoodPass - lakewoodFlagged.length) +
      "</strong> in pipeline</p>";
    if (lakewoodFlagged.length) {
      html += '<p class="dash-label warn">Flagged variants</p><ul class="dash-list">';
      lakewoodFlagged.forEach(function (v) {
        html += "<li><b>" + v.name + "</b><span>Tier " + v.tier.toUpperCase() + " · needs characterization</span></li>";
      });
      html += "</ul>";
    }
    if (lakewoodActive.length) {
      html += '<p class="dash-label">In testing</p><ul class="dash-list">';
      lakewoodActive.forEach(function (v) {
        html += "<li><b>" + v.name + "</b><span>Expert or triangle in progress</span></li>";
      });
      html += "</ul>";
    }
    if (!lakewoodFlagged.length && !lakewoodActive.length) {
      html += '<p class="dash-muted">No tracker updates yet — tap steps on the variant tracker as panels run.</p>';
    }
    html += "</div>";

    html += "</div>";
    el.innerHTML = html;
  }

  function init() {
    initSearch();
    renderDashboard();
    var shareBtn = document.getElementById("cmd-share-pack");
    if (shareBtn) {
      shareBtn.addEventListener("click", copySharePack);
    }
    var pocketBtn = document.getElementById("cmd-pocket-print");
    if (pocketBtn) {
      pocketBtn.addEventListener("click", function () {
        global.open("/pocket", "_blank");
      });
    }
    global.addEventListener("storage", function (e) {
      if (e.key === INTENSITY_OPEN_KEY || e.key === LAKEWOOD_KEY) {
        renderDashboard();
      }
    });
    global.addEventListener("focus", renderDashboard);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  global.TFFCommand = {
    copySharePack: copySharePack,
    renderDashboard: renderDashboard
  };
})(window);