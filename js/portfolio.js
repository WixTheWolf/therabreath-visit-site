(function () {
  var data = window.TFFPortfolio;
  if (!data) return;

  var COL_ORDER = ["production", "presented", "pipeline", "genalpha"];
  var COL_NUM = { production: "01", presented: "02", pipeline: "03", genalpha: "04" };
  var COL_GRID = {
    production: "port-mosaic--4",
    presented: "port-mosaic--3",
    pipeline: "port-mosaic--4 port-mosaic--pipeline",
    genalpha: "port-mosaic--4"
  };

  var chapters = document.getElementById("port-chapters");
  var modal = document.getElementById("port-modal");
  var statsEl = document.getElementById("port-stats");
  var dock = document.getElementById("port-dock");
  var searchInput = document.getElementById("port-search-input");
  var emptyEl = document.getElementById("port-empty");
  var surpriseBtn = document.getElementById("port-surprise");
  var sparkleEl = document.getElementById("port-sparkle");

  var activeFilter = "all";
  var searchQuery = "";
  var visibleSlugs = [];
  var modalIndex = -1;
  var tiltEnabled = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function colColor(col) {
    return data.collections[col] ? data.collections[col].color : "#008fd3";
  }

  function mintCode(c) {
    if (!c || c.collection !== "pipeline") return "";
    var m = (c.tag || "").match(/M(\d)/);
    return m ? "M" + m[1] : "";
  }

  function shortTag(c) {
    if (c.collection === "production") return c.status === "in_production" ? "On shelf" : "Production";
    if (c.collection === "pipeline") return mintCode(c) || "Pipeline";
    if (c.collection === "genalpha") return "Gen Alpha";
    return (c.season && data.seasons[c.season]) ? data.seasons[c.season].label : "Presented";
  }

  function matchesSearch(c, q) {
    if (!q) return true;
    var hay = [
      c.name, c.slug, c.tag, c.positioning, c.story, c.note, c.feel,
      c.tffCode, c.usage, mintCode(c)
    ].filter(Boolean).join(" ").toLowerCase();
    return hay.indexOf(q) !== -1;
  }

  function isVisible(c) {
    if (activeFilter !== "all" && c.collection !== activeFilter) return false;
    return matchesSearch(c, searchQuery);
  }

  function refreshVisibleSlugs() {
    visibleSlugs = data.concepts.filter(isVisible).map(function (c) { return c.slug; });
  }

  function renderStats() {
    if (!statsEl) return;
    var total = data.concepts.length;
    statsEl.innerHTML =
      '<div class="port-stat port-stat--total"><b id="port-count">0</b><span>Total flavors</span></div>' +
      COL_ORDER.map(function (id) {
        var col = data.collections[id];
        var n = data.byCollection(id).length;
        return (
          '<button type="button" class="port-stat port-stat--chip" data-jump="' + id + '" style="--chip:' + col.color + '">' +
          '<b>' + n + "</b><span>" + col.label + "</span></button>"
        );
      }).join("");

    statsEl.querySelectorAll("[data-jump]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.dataset.jump;
        setFilter(id);
        var el = document.getElementById("chapter-" + id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

    var counter = document.getElementById("port-count");
    if (counter) animateCounter(counter, total);
  }

  function animateCounter(el, target) {
    var start = null;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / 1400, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function updateDockCounts() {
    if (!dock) return;
    dock.querySelectorAll(".port-dock-count").forEach(function (span) {
      var key = span.dataset.count;
      if (key === "all") span.textContent = data.concepts.length;
      else span.textContent = data.byCollection(key).length;
    });
  }

  function cardFootSub(c) {
    if (c.collection === "production" && c.usage) return c.usage;
    return c.positioning || teaser(c);
  }

  function renderCard(c) {
    var btn = document.createElement("button");
    var isProd = c.collection === "production";
    btn.type = "button";
    btn.className =
      "port-card" +
      (data.hasImage(c) ? "" : " port-card--sku") +
      (isProd ? " port-card--production" : " port-card--concept");
    btn.dataset.slug = c.slug;
    btn.dataset.collection = c.collection;
    btn.setAttribute("aria-label", "View " + c.name);

    var code = mintCode(c);
    var badge = c.status === "in_production"
      ? '<span class="port-card-badge">On shelf</span>'
      : code
        ? '<span class="port-card-badge port-card-badge--mint">' + code + "</span>"
        : "";

    var isBottle = c.collection === "production" && data.hasImage(c);
    var media;
    if (isBottle) {
      media = '<img src="' + data.imageUrl(c) + '" alt="" loading="lazy" decoding="async" />';
    } else if (data.hasImage(c)) {
      media = '<img src="' + data.imageUrl(c) + '" alt="" loading="lazy" decoding="async" />';
    } else {
      media =
        '<div class="port-card-sku">' +
          '<span class="port-card-name">' + c.name + "</span>" +
          (c.tffCode ? '<span class="port-card-code">' + c.tffCode + "</span>" : "") +
          (c.usage ? '<span class="port-card-usage">' + c.usage + "</span>" : "") +
        "</div>";
    }

    var imgClass = "port-card-img";
    if (isBottle) imgClass += " port-card-img--bottle";
    else if (!data.hasImage(c)) imgClass += " port-card-img--text";

    btn.innerHTML =
      '<div class="' + imgClass + '" style="--card-accent:' + colColor(c.collection) + '">' +
        media +
        badge +
        '<div class="port-card-shine" aria-hidden="true"></div>' +
      '</div>' +
      '<div class="port-card-foot">' +
        '<span class="port-card-foot-tag">' + shortTag(c) + "</span>" +
        "<strong>" + c.name + "</strong>" +
        "<span>" + cardFootSub(c) + "</span>" +
      "</div>";

    btn.addEventListener("click", function () { openModal(c.slug); });
    if (tiltEnabled) bindTilt(btn);
    return btn;
  }

  function teaser(c) {
    if (c.feel) return c.feel.length > 72 ? c.feel.slice(0, 72) + "…" : c.feel;
    if (c.story && c.story.length > 72) return c.story.slice(0, 72) + "…";
    return c.story || "";
  }

  function bindTilt(card) {
    card.addEventListener("mousemove", function (e) {
      var r = card.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      card.style.setProperty("--tilt-x", (y * -6).toFixed(2) + "deg");
      card.style.setProperty("--tilt-y", (x * 6).toFixed(2) + "deg");
    });
    card.addEventListener("mouseleave", function () {
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
    });
  }

  function renderChapters() {
    if (!chapters) return;
    chapters.innerHTML = "";
    COL_ORDER.forEach(function (colId) {
      var col = data.collections[colId];
      var items = data.byCollection(colId);
      var section = document.createElement("section");
      section.className = "port-chapter";
      section.id = "chapter-" + colId;
      section.dataset.collection = colId;

      var extra = colId === "pipeline"
        ? '<a class="port-chapter-cta" href="/taste">Taste Samples A-E July 8 →</a>'
        : "";

      section.innerHTML =
        '<div class="port-chapter-head">' +
          '<span class="port-chapter-num" aria-hidden="true">' + COL_NUM[colId] + "</span>" +
          '<div class="port-chapter-copy">' +
            '<span class="port-chapter-badge" style="background:' + col.color + '">' + col.label + "</span>" +
            "<h2>" + col.label + "</h2>" +
            "<p>" + col.desc + "</p>" +
            '<span class="port-chapter-count">' + items.length + " flavors</span>" +
          "</div>" +
          extra +
        "</div>" +
        '<div class="port-mosaic ' + COL_GRID[colId] + '" id="mosaic-' + colId + '"></div>';

      chapters.appendChild(section);
      var grid = section.querySelector(".port-mosaic");
      items.forEach(function (c) {
        grid.appendChild(renderCard(c));
      });
    });
  }

  function applyFilters() {
    refreshVisibleSlugs();
    var any = false;
    document.querySelectorAll(".port-chapter").forEach(function (section) {
      var col = section.dataset.collection;
      var showChapter = activeFilter === "all" || activeFilter === col;
      var chapterVisible = false;
      section.querySelectorAll(".port-card").forEach(function (card) {
        var c = data.bySlug(card.dataset.slug);
        var show = showChapter && c && isVisible(c);
        card.hidden = !show;
        card.classList.toggle("port-card--hidden", !show);
        if (show) chapterVisible = true;
      });
      section.hidden = !chapterVisible;
      if (chapterVisible) any = true;
    });
    if (emptyEl) emptyEl.hidden = any;
    observeCards();
  }

  function setFilter(col) {
    activeFilter = col;
    if (dock) {
      dock.querySelectorAll("button").forEach(function (b) {
        b.classList.toggle("active", b.dataset.col === col);
      });
    }
    applyFilters();
  }

  function openModal(slug) {
    var c = data.bySlug(slug);
    if (!c || !modal) return;
    refreshVisibleSlugs();
    modalIndex = visibleSlugs.indexOf(slug);
    if (modalIndex < 0) modalIndex = 0;

    fillModal(c);
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
    history.replaceState(null, "", "#" + slug);
  }

  function fillModal(c) {
    var hero = modal.querySelector(".port-modal-hero img");
    var tag = modal.querySelector(".port-modal-tag");
    var title = modal.querySelector(".port-modal-content h2");
    var pos = modal.querySelector(".port-modal-pos");
    var feel = modal.querySelector(".port-modal-feel");
    var story = modal.querySelector(".port-modal-story");
    var note = modal.querySelector(".port-modal-note");
    var indexEl = document.getElementById("port-modal-index");
    var actions = document.getElementById("port-modal-actions");

    var heroWrap = modal.querySelector(".port-modal-hero");
    if (data.hasImage(c)) {
      heroWrap.style.display = "";
      heroWrap.classList.toggle("bottle-hero", c.collection === "production");
      hero.src = data.imageUrl(c);
      hero.alt = c.name + (c.collection === "production" ? " bottle" : "");
    } else {
      heroWrap.style.display = "none";
      heroWrap.classList.remove("bottle-hero");
      hero.removeAttribute("src");
      hero.alt = "";
    }

    tag.textContent = c.tag;
    tag.style.background = colColor(c.collection);
    title.textContent = c.name;
    if (indexEl) {
      indexEl.textContent = visibleSlugs.length
        ? (modalIndex + 1) + " of " + visibleSlugs.length
        : "";
    }

    var prod = modal.querySelector(".port-modal-prod");
    if (c.collection === "production" && prod) {
      pos.textContent = c.positioning || "";
      pos.style.display = "none";
      prod.style.display = "";
      prod.innerHTML =
        '<div class="port-modal-prod-row port-modal-prod-row--name"><span>Flavor</span><strong>' + c.name + "</strong></div>" +
        (c.usage ? '<div class="port-modal-prod-row port-modal-prod-row--usage"><span>Usage level</span><strong>' + c.usage + "</strong></div>" : "") +
        (c.tffCode ? '<div class="port-modal-prod-row"><span>TFF code</span><strong>' + c.tffCode + "</strong></div>" : "");
    } else {
      pos.textContent = c.positioning || "";
      pos.style.display = c.positioning ? "" : "none";
      if (prod) {
        if (c.tffCode) {
          prod.style.display = "";
          prod.innerHTML =
            '<div class="port-modal-prod-row"><span>TFF flavor</span><strong>' + c.tffCode + "</strong></div>" +
            (c.usage ? '<div class="port-modal-prod-row"><span>Usage level</span><strong>' + c.usage + "</strong></div>" : "");
        } else {
          prod.style.display = "none";
          prod.innerHTML = "";
        }
      }
    }

    if (c.feel) {
      feel.style.display = "";
      feel.innerHTML = "<strong>Sensory story</strong>" + c.feel;
    } else {
      feel.style.display = "none";
    }

    story.textContent = c.story || "";
    note.innerHTML = "<strong>TFF note ·</strong> " + (c.note || "");

    if (actions) {
      actions.innerHTML = c.collection === "pipeline"
        ? '<a class="port-modal-btn primary" href="/taste">Flavor Flight · ' + mintCode(c) + "</a>" +
          '<a class="port-modal-btn" href="/concepts">Prototype reference</a>'
        : c.collection === "production"
          ? '<a class="port-modal-btn" href="/lakewood">Lakewood parity context</a>'
          : "";
      actions.style.display = actions.innerHTML ? "" : "none";
    }
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("open");
    document.body.style.overflow = "";
    history.replaceState(null, "", location.pathname + location.search);
  }

  function stepModal(dir) {
    if (!visibleSlugs.length) return;
    modalIndex = (modalIndex + dir + visibleSlugs.length) % visibleSlugs.length;
    var c = data.bySlug(visibleSlugs[modalIndex]);
    if (c) {
      fillModal(c);
      history.replaceState(null, "", "#" + c.slug);
    }
  }

  function burstSparkle(x, y) {
    if (!sparkleEl || !tiltEnabled) return;
    sparkleEl.innerHTML = "";
    var colors = ["#008fd3", "#5fb832", "#e85d8a", "#6c5ce7", "#f58220"];
    for (var i = 0; i < 18; i++) {
      var s = document.createElement("span");
      s.style.left = x + "px";
      s.style.top = y + "px";
      s.style.background = colors[i % colors.length];
      s.style.setProperty("--dx", (Math.random() - 0.5) * 120 + "px");
      s.style.setProperty("--dy", (Math.random() - 0.5) * 120 + "px");
      sparkleEl.appendChild(s);
    }
    sparkleEl.classList.add("burst");
    setTimeout(function () { sparkleEl.classList.remove("burst"); }, 700);
  }

  function surpriseMe() {
    refreshVisibleSlugs();
    if (!visibleSlugs.length) return;
    var slug = visibleSlugs[Math.floor(Math.random() * visibleSlugs.length)];
    var card = document.querySelector('.port-card[data-slug="' + slug + '"]');
    if (card) {
      card.classList.add("port-card--pop");
      setTimeout(function () { card.classList.remove("port-card--pop"); }, 600);
      card.scrollIntoView({ behavior: "smooth", block: "center" });
      var r = card.getBoundingClientRect();
      burstSparkle(r.left + r.width / 2, r.top + r.height / 2);
    }
    setTimeout(function () { openModal(slug); }, 400);
  }

  if (modal) {
    modal.querySelector(".port-modal-close").addEventListener("click", closeModal);
    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeModal();
    });
    document.getElementById("port-modal-prev").addEventListener("click", function () { stepModal(-1); });
    document.getElementById("port-modal-next").addEventListener("click", function () { stepModal(1); });
    document.addEventListener("keydown", function (e) {
      if (!modal.classList.contains("open")) return;
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowLeft") stepModal(-1);
      if (e.key === "ArrowRight") stepModal(1);
    });
  }

  var revealObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -30px 0px" });

  function observeCards() {
    document.querySelectorAll(".port-card:not(.visible)").forEach(function (el, i) {
      el.style.transitionDelay = (i % 8) * 0.04 + "s";
      revealObs.observe(el);
    });
  }

  if (dock) {
    dock.querySelectorAll("button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var col = btn.dataset.col;
        setFilter(col);
        if (col === "all") {
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }
        var el = document.getElementById("chapter-" + col);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

    var chapterObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && activeFilter === "all") {
          var col = entry.target.dataset.collection;
          dock.querySelectorAll("button").forEach(function (b) {
            b.classList.toggle("active", b.dataset.col === col);
          });
        }
      });
    }, { threshold: 0.15, rootMargin: "-100px 0px -55% 0px" });

    document.querySelectorAll(".port-chapter").forEach(function (ch) { chapterObs.observe(ch); });
  }

  if (searchInput) {
    var searchTimer;
    searchInput.addEventListener("input", function () {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(function () {
        searchQuery = searchInput.value.trim().toLowerCase();
        applyFilters();
      }, 120);
    });
  }

  if (surpriseBtn) surpriseBtn.addEventListener("click", surpriseMe);

  /* Ambient canvas */
  var canvas = document.getElementById("port-canvas");
  if (canvas && tiltEnabled) {
    var ctx = canvas.getContext("2d");
    var orbs = [];
    var hues = [[0, 143, 211], [232, 93, 138], [108, 92, 231], [95, 184, 50], [42, 157, 143]];

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function init() {
      orbs = [];
      for (var i = 0; i < 20; i++) {
        orbs.push({
          x: Math.random(), y: Math.random(),
          r: Math.random() * 70 + 35,
          rgb: hues[i % hues.length],
          vx: (Math.random() - 0.5) * 0.00012,
          vy: (Math.random() - 0.5) * 0.00012,
          a: Math.random() * 0.045 + 0.02
        });
      }
    }

    function draw() {
      if (!ctx) return;
      var w = canvas.width;
      var h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      orbs.forEach(function (o) {
        o.x += o.vx;
        o.y += o.vy;
        if (o.x < -0.1 || o.x > 1.1) o.vx *= -1;
        if (o.y < -0.1 || o.y > 1.1) o.vy *= -1;
        var cx = o.x * w;
        var cy = o.y * h;
        var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, o.r);
        var c = "rgba(" + o.rgb.join(",") + ",";
        g.addColorStop(0, c + o.a + ")");
        g.addColorStop(1, c + "0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy, o.r, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }

    resize();
    init();
    draw();
    window.addEventListener("resize", resize);
  }

  function checkHash() {
    var slug = location.hash.replace("#", "");
    if (slug && data.bySlug(slug)) openModal(slug);
  }

  renderStats();
  updateDockCounts();
  renderChapters();
  applyFilters();
  checkHash();
  window.addEventListener("hashchange", checkHash);
})();