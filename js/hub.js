(function () {
  var canvas = document.getElementById("hub-glow");
  var scheduleEl = document.getElementById("hub-schedule");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Soft lab light field */
  if (canvas && !reduceMotion) {
    var ctx = canvas.getContext("2d");
    var orbs = [
      { x: 0.25, y: 0.15, r: 0.28, c: [0, 143, 211], s: 0.00008 },
      { x: 0.78, y: 0.35, r: 0.22, c: [95, 184, 50], s: -0.00006 },
      { x: 0.55, y: 0.72, r: 0.2, c: [245, 130, 32], s: 0.00005 },
    ];
    var t = 0;

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw() {
      var w = window.innerWidth;
      var h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);
      orbs.forEach(function (o, i) {
        var ox = (o.x + Math.sin(t * o.s * 1200 + i) * 0.06) * w;
        var oy = (o.y + Math.cos(t * o.s * 1200 + i * 1.5) * 0.05) * h;
        var rad = o.r * Math.min(w, h);
        var g = ctx.createRadialGradient(ox, oy, 0, ox, oy, rad);
        g.addColorStop(0, "rgba(" + o.c.join(",") + ",0.09)");
        g.addColorStop(1, "rgba(" + o.c.join(",") + ",0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      });
      t += 0.016;
      requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener("resize", resize);
  }

  /* Schedule from canonical content */
  if (scheduleEl && window.BOI && BOI.schedule) {
    scheduleEl.innerHTML = BOI.schedule
      .map(function (item, i) {
        var time =
          item.time + (item.end && item.time.indexOf("–") === -1 ? "–" + item.end : "");
        return (
          '<article class="hub-slot hub-reveal" role="listitem" style="--slot-accent:' +
          item.accent +
          ";transition-delay:" +
          i * 0.06 +
          's" data-index="' +
          i +
          '">' +
          '<span class="hub-slot-time"><span class="hub-slot-dot" aria-hidden="true"></span>' +
          time +
          "</span>" +
          "<h4>" +
          item.title +
          "</h4>" +
          "<p>" +
          item.desc +
          "</p></article>"
        );
      })
      .join("");

    highlightNow();
  }

  function highlightNow() {
    if (!scheduleEl || !window.BOI) return;
    var slots = scheduleEl.querySelectorAll(".hub-slot");
    slots.forEach(function (s) {
      s.classList.remove("is-now");
    });
    /* Workshop day: soft highlight first item before 10am local */
    var now = new Date();
    var isWorkshopDay =
      now.getFullYear() === 2026 && now.getMonth() === 6 && now.getDate() === 8;
    if (!isWorkshopDay) return;
    var hour = now.getHours();
    var min = now.getMinutes();
    var idx = 0;
    if (hour >= 13) idx = 5;
    else if (hour > 11 || (hour === 11 && min >= 30)) idx = 4;
    else if (hour > 10 || (hour === 10 && min >= 30)) idx = 3;
    else if (hour === 10 && min >= 15) idx = 2;
    else if (hour >= 10) idx = 1;
    else if (hour >= 9) idx = 0;
    if (slots[idx]) slots[idx].classList.add("is-now");
  }

  /* Reveal on scroll */
  var revealEls = document.querySelectorAll(".hub-tile, .hub-slot");
  if (revealEls.length && "IntersectionObserver" in window) {
    revealEls.forEach(function (el) {
      el.classList.add("hub-reveal");
    });
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
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* Feature tile cursor shine */
  var feature = document.querySelector(".hub-tile-feature");
  if (feature && !reduceMotion) {
    feature.addEventListener("pointermove", function (e) {
      var r = feature.getBoundingClientRect();
      var x = ((e.clientX - r.left) / r.width) * 100;
      var y = ((e.clientY - r.top) / r.height) * 100;
      feature.style.setProperty("--mx", x + "%");
      feature.style.setProperty("--my", y + "%");
    });
  }

  /* Subtle hero parallax (desktop) */
  var hero = document.querySelector(".hub-hero");
  if (hero && window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reduceMotion) {
    window.addEventListener(
      "mousemove",
      function (e) {
        var cx = (e.clientX / window.innerWidth - 0.5) * 8;
        var cy = (e.clientY / window.innerHeight - 0.5) * 6;
        hero.style.transform = "translate(" + cx + "px," + cy + "px)";
      },
      { passive: true }
    );
  }
})();