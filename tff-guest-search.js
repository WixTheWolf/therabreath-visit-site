/**
 * Guest-safe site search — curated public pages only (no team portal index).
 */
(function (global) {
  var INDEX = [
    { title: "July 8 agenda", category: "Visit", href: "/agenda", snippet: "Simple morning schedule for email and calendar invites — arrive 8:00, depart 12:30.", keywords: "agenda schedule invite email calendar morning" },
    { title: "Workshop agenda", category: "Visit", href: "/workshop", snippet: "Half-day flow, four pillars, hosts, tasting block, logistics.", keywords: "workshop agenda pillars hosts materials" },
    { title: "Your visit guide", category: "Visit", href: "/visit", snippet: "Block-by-block morning guide — capabilities first, tasting second.", keywords: "visit guide day-of morning flow" },
    { title: "Lakewood site parity", category: "Program", href: "/lakewood", snippet: "Four-rung validation ladder for taste consistency across sites.", keywords: "lakewood parity site transfer triangle" },
    { title: "Blind Flavor Mapping", category: "Tasting", href: "/mystery", snippet: "Match coded cups M1–M10 to prototype codenames before reveal.", keywords: "mystery blind mapping coded cups" },
    { title: "Prototype Scorecard", category: "Tasting", href: "/score", snippet: "Rate all ten prototypes after reveal — liking, uniqueness, intent.", keywords: "score scorecard rating sensory" },
    { title: "Ten workshop directions", category: "Tasting", href: "/concepts", snippet: "Preview stability tiers and QC status — cup codes stay blind.", keywords: "concepts prototypes directions M1 M10" },
    { title: "Slide deck", category: "Print", href: "/slides", snippet: "Twenty printable slides — welcome, pillars, tasting, concepts, next steps.", keywords: "slides slide deck presentation print display" },
    { title: "Station signs", category: "Print", href: "/stations", snippet: "Tasting station tent cards for three prototype groups.", keywords: "stations signs print tasting tents" },
    { title: "QR print sheet", category: "Print", href: "/qr", snippet: "QR codes for visit guide, workshop, mapping, scorecard, passport.", keywords: "qr codes print scan room" },
    { title: "Visitor passport", category: "Print", href: "/passport", snippet: "Pocket agenda, checklist, and scoring notes.", keywords: "passport pocket print agenda" },
    { title: "Executive one-pager", category: "Print", href: "/onepager", snippet: "Capabilities summary for procurement leave-behind.", keywords: "onepager one-pager executive summary print" },
    { title: "Welcome packet", category: "Print", href: "/booklet", snippet: "Partnership PDFs, formulas, COAs, sensory protocols.", keywords: "booklet welcome packet binder pdfs" },
    { title: "Co-creation worksheet", category: "Print", href: "/worksheet", snippet: "Bench lab worksheet for the 10:30 co-creation block.", keywords: "worksheet co-creation lab bench" },
    { title: "Triangle test kit", category: "Lakewood", href: "/triangle", snippet: "ISO 4120 triangle protocol for Lakewood site parity.", keywords: "triangle test iso sensory lakewood" },
    { title: "Blind comparison kit", category: "Lakewood", href: "/blind", snippet: "Duo-trio and paired attribute scales when triangle flags a difference.", keywords: "blind paired comparison lakewood fingerprint" },
    { title: "The Flavor Factory", category: "Company", href: "/flavor-factory", snippet: "Family-owned Norco facility — development through production.", keywords: "tff flavor factory facility norco tour" },
    { title: "TheraBreath brand context", category: "Company", href: "/therabreath-brand", snippet: "Brand portfolio and oral-care positioning.", keywords: "therabreath brand oxyd-8 portfolio" },
    { title: "Chlorite + flavor", category: "Technical", href: "/chlorite-flavor", snippet: "Why sodium chlorite changes flavor stability rules.", keywords: "chlorite flavor stability sodium oral care" },
    { title: "Company hub", category: "Company", href: "/companies", snippet: "TFF and TheraBreath profiles in one place.", keywords: "companies profiles hub" },
    { title: "Workshop hosts", category: "Visit", href: "/workshop#hosts", snippet: "Dan, Alex, Kelly, Ryan — who leads each block on July 8.", keywords: "hosts team bios dan alex kelly ryan" },
    { title: "Four pillars", category: "Visit", href: "/workshop#capabilities", snippet: "Resiliency, innovation, operations, and partnership deep dives.", keywords: "pillars capabilities resiliency innovation operations" },
    { title: "Morning agenda", category: "Visit", href: "/agenda", snippet: "8:00 tour through 12:30 depart — timed blocks for July 8.", keywords: "agenda schedule timeline morning" }
  ];

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function searchText(item) {
    return [item.title, item.category, item.snippet, item.keywords || "", item.href]
      .join(" ")
      .toLowerCase();
  }

  function scoreMatch(item, query) {
    var text = searchText(item);
    var q = query.toLowerCase().trim();
    if (!q) return 0;
    if (text.indexOf(q) >= 0) return 1;
    var words = q.split(/\s+/).filter(Boolean);
    if (!words.length) return 0;
    var hits = 0;
    words.forEach(function (w) {
      if (text.indexOf(w) >= 0) hits++;
    });
    return hits / words.length;
  }

  function init(wrapId, inputId, resultsId) {
    var wrap = document.getElementById(wrapId);
    var input = document.getElementById(inputId);
    var results = document.getElementById(resultsId);
    if (!wrap || !input || !results) return;

    var activeIndex = -1;

    function setOpen(open) {
      wrap.classList.toggle("is-open", open);
      input.setAttribute("aria-expanded", open ? "true" : "false");
      if (!open) {
        activeIndex = -1;
        updateActiveHighlight();
      }
    }

    function hitsForQuery(q) {
      return INDEX.map(function (item) {
        return { item: item, score: scoreMatch(item, q) };
      })
        .filter(function (row) {
          return row.score > 0;
        })
        .sort(function (a, b) {
          return b.score - a.score;
        })
        .slice(0, 10);
    }

    function updateActiveHighlight() {
      var links = results.querySelectorAll(".guest-search-hit");
      links.forEach(function (link, i) {
        link.classList.toggle("is-active", i === activeIndex);
        if (i === activeIndex) link.setAttribute("aria-selected", "true");
        else link.removeAttribute("aria-selected");
      });
    }

    function render() {
      var q = (input.value || "").trim();
      if (!q) {
        results.innerHTML = "";
        results.classList.remove("open");
        setOpen(false);
        return;
      }

      var hits = hitsForQuery(q);
      if (!hits.length) {
        results.innerHTML =
          '<p class="guest-search-empty">No matches for “' +
          escapeHtml(q) +
          '” — try <strong>slides</strong>, visit, Lakewood, or scorecard.</p>';
        results.classList.add("open");
        setOpen(true);
        activeIndex = -1;
        return;
      }

      results.innerHTML = hits
        .map(function (row, i) {
          var item = row.item;
          return (
            '<a class="guest-search-hit" role="option" href="' +
            item.href +
            '" data-index="' +
            i +
            '">' +
            '<span class="guest-search-meta"><b>' +
            escapeHtml(item.category) +
            "</b></span>" +
            "<strong>" +
            escapeHtml(item.title) +
            "</strong>" +
            '<span class="guest-search-snippet">' +
            escapeHtml(item.snippet) +
            "</span></a>"
          );
        })
        .join("");
      results.classList.add("open");
      setOpen(true);
      activeIndex = -1;
    }

    input.setAttribute("role", "combobox");
    input.setAttribute("aria-autocomplete", "list");
    input.setAttribute("aria-expanded", "false");
    input.setAttribute("aria-controls", resultsId);
    results.setAttribute("role", "listbox");

    input.addEventListener("input", render);
    input.addEventListener("focus", render);

    input.addEventListener("keydown", function (e) {
      var links = results.querySelectorAll(".guest-search-hit");
      if (!links.length) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        activeIndex = Math.min(activeIndex + 1, links.length - 1);
        updateActiveHighlight();
        links[activeIndex].scrollIntoView({ block: "nearest" });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        activeIndex = Math.max(activeIndex - 1, 0);
        updateActiveHighlight();
        links[activeIndex].scrollIntoView({ block: "nearest" });
      } else if (e.key === "Enter" && activeIndex >= 0) {
        e.preventDefault();
        global.location.href = links[activeIndex].getAttribute("href");
      } else if (e.key === "Escape") {
        results.classList.remove("open");
        setOpen(false);
        input.blur();
      }
    });

    results.addEventListener("mousedown", function (e) {
      e.preventDefault();
    });

    document.addEventListener("click", function (e) {
      if (!wrap.contains(e.target)) {
        results.classList.remove("open");
        setOpen(false);
      }
    });
  }

  global.TFFGuestSearch = { init: init, index: INDEX, scoreMatch: scoreMatch };
})(typeof window !== "undefined" ? window : global);