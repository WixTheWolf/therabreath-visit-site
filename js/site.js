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

  /* Nav highlight */
  var path = location.pathname.replace(/\/$/, "") || "/";
  document.querySelectorAll(".boi-nav-links a").forEach(function (a) {
    var href = a.getAttribute("href");
    if (href === path || (path === "/index.html" && href === "/")) a.classList.add("on");
  });
})();