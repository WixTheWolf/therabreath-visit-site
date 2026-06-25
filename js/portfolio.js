(function () {
  var data = window.TFFPortfolio;
  if (!data) return;

  var COL_ORDER = ["production", "presented", "pipeline", "genalpha"];
  var COL_NUM = { production: "01", presented: "02", pipeline: "03", genalpha: "04" };

  var mosaic = document.getElementById("port-mosaic");
  var chapters = document.getElementById("port-chapters");
  var modal = document.getElementById("port-modal");
  var counter = document.getElementById("port-count");
  var dock = document.getElementById("port-dock");

  function seasonColor(season) {
    var s = data.seasons[season];
    return s ? s.color : "#008fd3";
  }

  function colColor(col) {
    return data.collections[col] ? data.collections[col].color : "#008fd3";
  }

  function cardSize(index, total) {
    if (index === 0) return "hero-card";
    if (index === 2 || index === 5) return "wide";
    if (index === 4) return "tall";
    return "";
  }

  function teaser(c) {
    if (c.feel) return c.feel;
    if (c.story && c.story.length > 100) return c.story.slice(0, 110) + "…";
    return c.story || c.positioning || "";
  }

  function renderCard(c, index, total) {
    var size = cardSize(index, total);
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "port-card " + size + (data.hasImage(c) ? "" : " port-card--sku");
    btn.dataset.slug = c.slug;
    btn.dataset.collection = c.collection;
    btn.setAttribute("aria-label", "View " + c.name);
    var badge = c.status === "in_production"
      ? '<span class="port-card-badge">On shelf</span>'
      : "";
    var isBottle = c.collection === "production" && data.hasImage(c);
    var media;
    if (isBottle) {
      media =
        '<img src="' + data.imageUrl(c) + '" alt="' + c.name + ' bottle" loading="lazy" decoding="async" />' +
        '<span class="port-card-label">' + c.name + "</span>";
    } else if (data.hasImage(c)) {
      media =
        '<img src="' + data.imageUrl(c) + '" alt="' + c.name + '" loading="lazy" decoding="async" />';
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
      '<div class="' + imgClass + '">' +
        media +
        badge +
        '<span class="port-card-cta-float">' + (c.status === "in_production" ? "View SKU →" : "Explore story →") + '</span>' +
      '</div>';
    btn.addEventListener("click", function () { openModal(c.slug); });
    return btn;
  }

  function renderChapters() {
    if (!chapters) return;
    chapters.innerHTML = "";
    COL_ORDER.forEach(function (colId) {
      var col = data.collections[colId];
      var items = data.byCollection(colId);
      var cards = items.map(function (c, i) { return renderCard(c, i, items.length); });
      var section = document.createElement("section");
      section.className = "port-chapter";
      section.id = "chapter-" + colId;
      section.dataset.collection = colId;
      section.innerHTML =
        '<div class="port-chapter-head">' +
          '<span class="port-chapter-num" aria-hidden="true">' + COL_NUM[colId] + '</span>' +
          '<div>' +
            '<span class="port-chapter-badge" style="background:' + col.color + '">' + col.label + '</span>' +
            '<h2>' + col.label + '</h2>' +
            '<p>' + col.desc + '</p>' +
          '</div>' +
        '</div>' +
        '<div class="port-mosaic" id="mosaic-' + colId + '"></div>';
      chapters.appendChild(section);
      var grid = section.querySelector(".port-mosaic");
      cards.forEach(function (card) { grid.appendChild(card); });
    });
  }

  function openModal(slug) {
    var c = data.bySlug(slug);
    if (!c || !modal) return;
    var hero = modal.querySelector(".port-modal-hero img");
    var tag = modal.querySelector(".port-modal-tag");
    var title = modal.querySelector(".port-modal-content h2");
    var pos = modal.querySelector(".port-modal-pos");
    var feel = modal.querySelector(".port-modal-feel");
    var story = modal.querySelector(".port-modal-story");
    var note = modal.querySelector(".port-modal-note");

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
    pos.textContent = c.positioning || "";
    pos.style.display = c.positioning ? "" : "none";

    var prod = modal.querySelector(".port-modal-prod");
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

    if (c.feel) {
      feel.style.display = "";
      feel.innerHTML = "<strong>Sensory story</strong>" + c.feel;
    } else {
      feel.style.display = "none";
    }

    story.textContent = c.story || "";
    note.innerHTML = "<strong>TFF note ·</strong> " + (c.note || "");
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }

  if (modal) {
    modal.querySelector(".port-modal-close").addEventListener("click", closeModal);
    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeModal();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeModal();
    });
  }

  /* Scroll reveal */
  var revealObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  function observeCards() {
    document.querySelectorAll(".port-card").forEach(function (el, i) {
      el.style.transitionDelay = (i % 6) * 0.06 + "s";
      revealObs.observe(el);
    });
  }

  /* Counter animation */
  if (counter) {
    var target = data.concepts.length;
    var start = null;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / 1800, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      counter.textContent = Math.round(eased * target);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* Dock filter — scroll to chapter */
  if (dock) {
    dock.querySelectorAll("button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var col = btn.dataset.col;
        dock.querySelectorAll("button").forEach(function (b) { b.classList.toggle("active", b === btn); });
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
        if (entry.isIntersecting) {
          var col = entry.target.dataset.collection;
          dock.querySelectorAll("button").forEach(function (b) {
            b.classList.toggle("active", b.dataset.col === col);
          });
        }
      });
    }, { threshold: 0.2, rootMargin: "-120px 0px -50% 0px" });

    document.querySelectorAll(".port-chapter").forEach(function (ch) { chapterObs.observe(ch); });
  }

  /* Ambient canvas — soft floating light orbs */
  var canvas = document.getElementById("port-canvas");
  if (canvas) {
    var ctx = canvas.getContext("2d");
    var orbs = [];
    var hues = [
      [0, 143, 211], [232, 93, 138], [108, 92, 231],
      [95, 184, 50], [42, 157, 143]
    ];

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function init() {
      orbs = [];
      for (var i = 0; i < 24; i++) {
        orbs.push({
          x: Math.random(),
          y: Math.random(),
          r: Math.random() * 80 + 40,
          rgb: hues[i % hues.length],
          vx: (Math.random() - 0.5) * 0.00015,
          vy: (Math.random() - 0.5) * 0.00015,
          a: Math.random() * 0.05 + 0.025
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

  /* Deep link */
  function checkHash() {
    var slug = location.hash.replace("#", "");
    if (slug && data.bySlug(slug)) openModal(slug);
  }

  renderChapters();
  observeCards();
  checkHash();
  window.addEventListener("hashchange", checkHash);

  /* Nav highlight */
  var path = location.pathname.replace(/\/$/, "") || "/";
  document.querySelectorAll(".boi-nav-links a").forEach(function (a) {
    if (a.getAttribute("href") === path || (path === "/portfolio" && a.getAttribute("href") === "/portfolio")) {
      a.classList.add("on");
    }
  });
})();