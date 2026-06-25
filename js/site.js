(function () {
  /* Ambient particles on landing */
  var canvas = document.getElementById("boi-canvas");
  if (canvas) {
    var ctx = canvas.getContext("2d");
    var particles = [];
    var count = 48;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function init() {
      particles = [];
      for (var i = 0; i < count; i++) {
        particles.push({
          x: Math.random(),
          y: Math.random(),
          r: Math.random() * 1.5 + 0.5,
          vx: (Math.random() - 0.5) * 0.0002,
          vy: (Math.random() - 0.5) * 0.0002,
          a: Math.random() * 0.35 + 0.1,
        });
      }
    }

    function draw() {
      if (!ctx) return;
      var w = canvas.width;
      var h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      particles.forEach(function (p) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > 1) p.vx *= -1;
        if (p.y < 0 || p.y > 1) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 143, 211, " + p.a + ")";
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }

    resize();
    init();
    draw();
    window.addEventListener("resize", resize);
  }

  /* Interactive pillars */
  var pillars = document.querySelectorAll(".boi-pillar");
  var detail = document.getElementById("pillar-detail");
  if (pillars.length && detail && window.BOI) {
    function showPillar(id) {
      var p = BOI.pillars.find(function (x) { return x.id === id; });
      if (!p) return;
      pillars.forEach(function (el) {
        el.classList.toggle("active", el.dataset.pillar === id);
      });
      detail.innerHTML =
        "<h3>" + p.title + "</h3><p style=\"margin:0 0 10px;color:var(--muted)\">" + p.tagline + "</p>" +
        "<ul>" + p.points.map(function (pt) { return "<li>" + pt + "</li>"; }).join("") + "</ul>";
    }
    pillars.forEach(function (el) {
      el.addEventListener("click", function () { showPillar(el.dataset.pillar); });
    });
    showPillar("resiliency");
  }

  /* Visit timeline from content */
  var timeline = document.getElementById("boi-timeline");
  if (timeline && window.BOI) {
    timeline.innerHTML = BOI.schedule.map(function (item) {
      var range = item.end ? item.time + (item.time.indexOf("–") === -1 && item.end ? "–" + item.end : "") : item.time;
      return "<li style=\"--item-accent:" + item.accent + "\"><time>" + range + "</time><div><b>" + item.title + "</b><span>" + item.desc + "</span></div><span class=\"dot\" aria-hidden=\"true\"></span></li>";
    }).join("");
  }

  /* Showcase grid — visit hub */
  var featureEl = document.getElementById("boi-showcase-feature");
  var gridEl = document.getElementById("boi-showcase-grid");
  if (window.BOI && BOI.showcase) {
    var sc = BOI.showcase;
    if (featureEl && sc.feature) {
      var f = sc.feature;
      featureEl.innerHTML =
        '<article class="boi-card boi-card-feature" style="--card-accent:' + f.accent + '">' +
        '<span class="boi-card-tag">' + f.tag + "</span>" +
        "<h3>" + f.title + "</h3>" +
        "<p>" + f.desc + "</p>" +
        (f.stat ? '<span class="boi-card-stat">' + f.stat + "</span>" : "") +
        '<span class="arrow">Explore program →</span>' +
        '<a class="stretch" href="' + f.href + '" aria-label="' + f.title + '"></a>' +
        "</article>";
    }
    if (gridEl && sc.items) {
      gridEl.innerHTML = sc.items
        .map(function (item) {
          return (
            '<article class="boi-card" style="--card-accent:' + item.accent + '">' +
            '<span class="boi-card-tag">' + item.tag + "</span>" +
            "<h3>" + item.title + "</h3>" +
            "<p>" + item.desc + "</p>" +
            '<span class="arrow">Open →</span>' +
            '<a class="stretch" href="' + item.href + '" aria-label="' + item.title + '"></a>' +
            "</article>"
          );
        })
        .join("");
    }
  }

  if (!document.querySelector('script[src*="tff-decor.js"]')) {
    var decor = document.createElement("script");
    decor.src = "/js/tff-decor.js";
    decor.defer = true;
    document.body.appendChild(decor);
  }
})();