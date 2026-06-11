/**
 * Guest-safe site search — curated public pages only (no team portal index).
 */
(function (global) {
  var INDEX = [
    { title: "Workshop agenda", category: "Visit", href: "/workshop", snippet: "Half-day flow, four pillars, hosts, tasting block, logistics." },
    { title: "Your visit guide", category: "Visit", href: "/visit", snippet: "Block-by-block morning guide — capabilities first, tasting second." },
    { title: "Lakewood site parity", category: "Program", href: "/lakewood", snippet: "Four-rung validation ladder for taste consistency across sites." },
    { title: "Blind Flavor Mapping", category: "Tasting", href: "/mystery", snippet: "Match coded cups M1–M10 to prototype codenames before reveal." },
    { title: "Prototype Scorecard", category: "Tasting", href: "/score", snippet: "Rate all ten prototypes after reveal — liking, uniqueness, intent." },
    { title: "Ten workshop directions", category: "Tasting", href: "/concepts", snippet: "Preview stability tiers and QC status — cup codes stay blind." },
    { title: "The Flavor Factory", category: "Company", href: "/flavor-factory", snippet: "Family-owned Norco facility — development through production." },
    { title: "TheraBreath brand context", category: "Company", href: "/therabreath-brand", snippet: "Brand portfolio and oral-care positioning." },
    { title: "Chlorite + flavor", category: "Technical", href: "/chlorite-flavor", snippet: "Why sodium chlorite changes flavor stability rules." },
    { title: "Visitor passport", category: "Print", href: "/passport", snippet: "Pocket agenda, checklist, and scoring notes." },
    { title: "Executive one-pager", category: "Print", href: "/onepager", snippet: "Capabilities summary for procurement leave-behind." },
    { title: "Welcome packet", category: "Print", href: "/booklet", snippet: "Partnership PDFs, formulas, COAs, sensory protocols." },
    { title: "Company hub", category: "Company", href: "/companies", snippet: "TFF and TheraBreath profiles in one place." }
  ];

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function init(wrapId, inputId, resultsId) {
    var wrap = document.getElementById(wrapId);
    var input = document.getElementById(inputId);
    var results = document.getElementById(resultsId);
    if (!wrap || !input || !results) return;

    function render() {
      var q = (input.value || "").trim().toLowerCase();
      if (!q) {
        results.classList.remove("open");
        results.innerHTML = "";
        return;
      }
      var hits = INDEX.filter(function (item) {
        return (
          item.title.toLowerCase().indexOf(q) >= 0 ||
          item.category.toLowerCase().indexOf(q) >= 0 ||
          item.snippet.toLowerCase().indexOf(q) >= 0
        );
      }).slice(0, 8);

      if (!hits.length) {
        results.innerHTML = '<p class="guest-search-empty">No matches — try workshop, Lakewood, chlorite, or scorecard.</p>';
        results.classList.add("open");
        return;
      }

      results.innerHTML = hits
        .map(function (item) {
          return (
            '<a class="guest-search-hit" href="' + item.href + '">' +
            '<span class="guest-search-meta"><b>' + escapeHtml(item.category) + "</b></span>" +
            "<strong>" + escapeHtml(item.title) + "</strong>" +
            '<span class="guest-search-snippet">' + escapeHtml(item.snippet) + "</span></a>"
          );
        })
        .join("");
      results.classList.add("open");
    }

    input.addEventListener("input", render);
    input.addEventListener("focus", render);
    document.addEventListener("click", function (e) {
      if (!wrap.contains(e.target)) results.classList.remove("open");
    });
  }

  global.TFFGuestSearch = { init: init, index: INDEX };
})(typeof window !== "undefined" ? window : global);