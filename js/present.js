(function () {
  var viewport = document.getElementById("pres-viewport");
  var chaptersEl = document.getElementById("pres-chapters");
  var progressEl = document.getElementById("pres-progress-fill");
  var counterEl = document.getElementById("pres-counter");
  var app = document.getElementById("pres-app");
  var slides = [];
  var index = 0;
  var hideTimer = null;
  var touchX = null;
  var touchY = null;
  var isTouch =
    window.matchMedia("(hover: none) and (pointer: coarse)").matches ||
    window.matchMedia("(max-width: 768px)").matches;

  if (isTouch) {
    document.documentElement.classList.add("pres-touch");
  }

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function makeSlide(className, html) {
    var el = document.createElement("section");
    el.className = "pres-slide" + (className ? " " + className : "");
    el.innerHTML = html;
    return el;
  }

  function bulletList(items) {
    if (!items || !items.length) return "";
    return (
      '<ul class="pres-qa-bullets">' +
      items
        .map(function (item) {
          return "<li>" + esc(item) + "</li>";
        })
        .join("") +
      "</ul>"
    );
  }

  function pillarIntroSlide(section) {
    return makeSlide(
      "pres-slide-intro",
      '<div class="pres-slide-inner" style="--pillar-color:' + section.color + '">' +
        '<div class="pres-slide-pad">' +
        '<span class="pres-pillar-badge">' + esc(section.pillarShort) + "</span>" +
        "<h1>" + esc(section.pillar) + "</h1>" +
        '<p class="pres-lead">' + esc(section.intro) + "</p>" +
        '<p class="pres-intro-hint">' + section.cards.length + " questions · tap to reveal key points</p>" +
        "</div></div>"
    );
  }

  function qaSlide(section, card) {
    return makeSlide(
      "pres-slide-qa",
      '<div class="pres-slide-inner" style="--pillar-color:' + section.color + '">' +
        '<div class="pres-slide-pad">' +
        '<p class="pres-tag">' + esc(section.pillarShort) + " · Card " + card.num + "</p>" +
        '<div class="pres-qa-stage">' +
        '<p class="pres-qa-label">Question</p>' +
        '<h2 class="pres-qa-q">' + esc(card.question) + "</h2>" +
        '<div class="pres-qa-reveal">' +
        '<p class="pres-qa-label answer">Key points</p>' +
        '<div class="pres-qa-answer">' + bulletList(card.points) + "</div>" +
        "</div>" +
        '<button type="button" class="pres-reveal-btn" data-reveal-label="Reveal points" data-hide-label="Hide points">' +
        '<span class="pres-reveal-icon" aria-hidden="true">✦</span> Reveal points</button>' +
        "</div></div></div>"
    );
  }

  function strategicIntroSlide() {
    return makeSlide(
      "pres-slide-intro pres-slide-strategic-intro",
      '<div class="pres-slide-inner" style="--pillar-color:#6c5ce7">' +
        '<div class="pres-slide-pad">' +
        '<span class="pres-pillar-badge">Discussion</span>' +
        "<h1>Top 10 strategic questions</h1>" +
        '<p class="pres-lead">Questions for TheraBreath — move beyond supplier review toward long-term partnership.</p>' +
        '<p class="pres-intro-hint">Reveal talking points before opening the floor.</p>' +
        "</div></div>"
    );
  }

  function strategicSlide(item) {
    return makeSlide(
      "pres-slide-qa pres-slide-strategic",
      '<div class="pres-slide-inner" style="--pillar-color:#6c5ce7">' +
        '<div class="pres-slide-pad">' +
        '<p class="pres-tag">Strategic discussion · ' + item.num + " of 10</p>" +
        '<div class="pres-qa-stage">' +
        '<p class="pres-qa-label">Ask TheraBreath</p>' +
        '<h2 class="pres-qa-q">' + esc(item.question) + "</h2>" +
        '<div class="pres-qa-reveal">' +
        '<p class="pres-qa-label answer">Why it matters</p>' +
        '<div class="pres-qa-answer strategic">' + bulletList(item.points) + "</div>" +
        "</div>" +
        '<button type="button" class="pres-reveal-btn strategic" data-reveal-label="Reveal points" data-hide-label="Hide">' +
        '<span class="pres-reveal-icon" aria-hidden="true">?</span> Reveal points</button>' +
        "</div></div></div>"
    );
  }

  function buildDynamicSlides() {
    if (!viewport || !window.BOI) return;
    var anchor = viewport.querySelector('[data-i="9"]') || viewport.querySelector(".pres-slide:nth-child(6)");
    var staticSlides = Array.prototype.slice.call(
      viewport.querySelectorAll(".pres-slide:not(.pres-slide-dynamic)")
    );
    var afterOverview = staticSlides[4];
    if (!afterOverview) return;

    var frag = document.createDocumentFragment();
    var slideIndices = [];

    BOI.qaSections.forEach(function (section) {
      var intro = pillarIntroSlide(section);
      intro.classList.add("pres-slide-dynamic");
      frag.appendChild(intro);
      section.cards.forEach(function (card) {
        var slide = qaSlide(section, card);
        slide.classList.add("pres-slide-dynamic");
        frag.appendChild(slide);
      });
    });

    frag.appendChild(strategicIntroSlide());
    frag.lastChild.classList.add("pres-slide-dynamic");

    BOI.strategicQuestions.forEach(function (item) {
      var slide = strategicSlide(item);
      slide.classList.add("pres-slide-dynamic");
      frag.appendChild(slide);
    });

    var lakewood = staticSlides[5];
    if (lakewood) viewport.insertBefore(frag, lakewood);

    slides = Array.prototype.slice.call(viewport.querySelectorAll(".pres-slide"));
    slides.forEach(function (s, i) {
      s.dataset.i = String(i);
    });

    buildChaptersFromSlides();
  }

  function buildChaptersFromSlides() {
    if (!window.BOI) return;
    var ch = [];
    var i = 0;

    ch.push({ id: "welcome", label: "Welcome", slides: [0, 1, 2] });
    ch.push({ id: "day", label: "Your day", slides: [3] });
    ch.push({ id: "overview", label: "Overview", slides: [4] });

    var cursor = 5;
    BOI.qaSections.forEach(function (section) {
      var ids = [cursor];
      cursor += 1;
      section.cards.forEach(function () {
        ids.push(cursor);
        cursor += 1;
      });
      ch.push({
        id: "pillar-" + section.num,
        label: section.pillarShort.replace("Pillar ", "P"),
        slides: ids,
      });
    });

    var stratStart = cursor;
    var stratSlides = [stratStart];
    for (var s = 0; s < BOI.strategicQuestions.length; s++) {
      stratSlides.push(stratStart + 1 + s);
    }
    ch.push({ id: "strategic", label: "Top 10", slides: stratSlides });
    cursor = stratStart + 1 + BOI.strategicQuestions.length;

    var tail = [];
    for (var t = cursor; t < slides.length; t++) tail.push(t);
    if (tail.length >= 3) {
      ch.push({ id: "depth", label: "Deep dives", slides: tail.slice(0, 3) });
      ch.push({ id: "close", label: "Close", slides: tail.slice(3) });
    } else if (tail.length) {
      ch.push({ id: "close", label: "Close", slides: tail });
    }

    BOI.chapters = ch;
  }

  function chapterForSlide(i) {
    if (!window.BOI || !BOI.chapters) return null;
    var ch = BOI.chapters;
    for (var c = 0; c < ch.length; c++) {
      if (ch[c].slides.indexOf(i) !== -1) return ch[c];
    }
    return null;
  }

  function buildChapters() {
    if (!chaptersEl || !window.BOI || !BOI.chapters) return;
    chaptersEl.innerHTML = '<p class="pres-chapters-label">Chapters</p>';
    BOI.chapters.forEach(function (ch) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "pres-chapter-btn";
      btn.textContent = ch.label;
      btn.dataset.slide = String(ch.slides[0]);
      btn.addEventListener("click", function () {
        show(parseInt(btn.dataset.slide, 10));
        flashChrome();
      });
      chaptersEl.appendChild(btn);
    });
  }

  function updateChapters() {
    if (!chaptersEl || !BOI.chapters) return;
    var ch = chapterForSlide(index);
    Array.prototype.forEach.call(chaptersEl.querySelectorAll(".pres-chapter-btn"), function (btn) {
      var start = parseInt(btn.dataset.slide, 10);
      var match = ch && BOI.chapters.some(function (c) {
        return c.id === ch.id && c.slides.indexOf(start) !== -1;
      });
      btn.classList.toggle("on", match && start === ch.slides[0]);
    });
  }

  function isQaSlide(slide) {
    return slide && slide.classList.contains("pres-slide-qa");
  }

  function isRevealed(slide) {
    return slide && slide.classList.contains("revealed");
  }

  function revealLabel(btn, slide, revealing) {
    if (!btn) return;
    var icon = slide.classList.contains("pres-slide-strategic") ? "?" : "✦";
    var label = revealing
      ? btn.dataset.hideLabel
      : isTouch
        ? "Tap to reveal points"
        : btn.dataset.revealLabel || "Reveal points";
    btn.setAttribute("aria-expanded", revealing ? "true" : "false");
    btn.innerHTML =
      '<span class="pres-reveal-icon" aria-hidden="true">' + icon + "</span> " + label;
  }

  function syncRevealHeight(slide) {
    var answer = slide && slide.querySelector(".pres-qa-answer");
    if (!answer) return;
    if (slide.classList.contains("revealed")) {
      answer.style.maxHeight = answer.scrollHeight + 32 + "px";
    } else {
      answer.style.maxHeight = "0px";
    }
  }

  function refitAfterReveal(slide) {
    syncRevealHeight(slide);
    requestAnimationFrame(function () {
      fitSlide();
      requestAnimationFrame(fitSlide);
    });
    window.setTimeout(fitSlide, 580);
  }

  function resetReveal(slide) {
    if (!slide) return;
    slide.classList.remove("revealed");
    var btn = slide.querySelector(".pres-reveal-btn");
    syncRevealHeight(slide);
    revealLabel(btn, slide, false);
  }

  function toggleReveal(slide) {
    if (!slide) return false;
    var btn = slide.querySelector(".pres-reveal-btn");
    var revealing = !slide.classList.contains("revealed");
    slide.classList.toggle("revealed", revealing);
    revealLabel(btn, slide, revealing);
    if (revealing) {
      refitAfterReveal(slide);
    } else {
      syncRevealHeight(slide);
      requestAnimationFrame(fitSlide);
    }
    updateMobileNextLabel();
    return revealing;
  }

  function bindRevealButtons() {
    slides.forEach(function (slide) {
      var btn = slide.querySelector(".pres-reveal-btn");
      var answer = slide.querySelector(".pres-qa-answer");
      if (btn && !btn.dataset.bound) {
        btn.dataset.bound = "1";
        btn.setAttribute("aria-expanded", "false");
        if (isTouch) {
          btn.dataset.revealLabel = "Tap to reveal points";
        }
        btn.addEventListener("click", function (e) {
          e.stopPropagation();
          toggleReveal(slide);
          flashChrome();
        });
      }
      if (answer && !answer.dataset.bound) {
        answer.dataset.bound = "1";
        answer.addEventListener("transitionend", function (e) {
          if (e.propertyName !== "max-height") return;
          if (slide === slides[index]) fitSlide();
        });
      }
    });
  }

  function fitSlide() {
    if (!viewport) return;
    var slide = slides[index];
    if (!slide) return;
    var inner = slide.querySelector(".pres-slide-inner");
    if (!inner) return;

    inner.style.transform = "none";
    var availH = viewport.clientHeight - 12;
    var availW = viewport.clientWidth - 12;
    var h = inner.offsetHeight;
    var w = inner.offsetWidth;
    if (!h || !w) return;
    var scale = Math.min(1, availH / h, availW / w);
    inner.style.transform = scale < 0.995 ? "scale(" + scale + ")" : "none";
  }

  function updateMobileNextLabel() {
    var nextBtn = document.getElementById("pres-next");
    if (!nextBtn || !isTouch) return;
    var slide = slides[index];
    nextBtn.textContent =
      isQaSlide(slide) && !isRevealed(slide) ? "Reveal" : "Next";
  }

  function show(i) {
    if (!slides.length) return;
    var prev = slides[index];
    if (prev && prev !== slides[i]) resetReveal(prev);

    index = Math.max(0, Math.min(slides.length - 1, i));
    slides.forEach(function (s, n) {
      s.classList.toggle("active", n === index);
      if (n !== index) {
        var inner = s.querySelector(".pres-slide-inner");
        if (inner) inner.style.transform = "none";
      }
    });
    if (progressEl) progressEl.style.width = ((index + 1) / slides.length * 100) + "%";
    if (counterEl) counterEl.textContent = (index + 1) + " / " + slides.length;
    history.replaceState(null, "", "#" + (index + 1));
    updateChapters();
    updateMobileNextLabel();
    requestAnimationFrame(fitSlide);
  }

  function next() {
    show(index + 1);
  }

  function prev() {
    show(index - 1);
  }

  function handleAdvance() {
    var slide = slides[index];
    if (isQaSlide(slide) && !isRevealed(slide)) {
      toggleReveal(slide);
      flashChrome();
      return;
    }
    next();
    flashChrome();
  }

  function toggleFullscreen() {
    var root = document.documentElement;
    if (!document.fullscreenElement) {
      root.requestFullscreen().catch(function () {});
    } else {
      document.exitFullscreen();
    }
  }

  function flashChrome() {
    if (!app) return;
    app.classList.remove("fs-chrome-hidden");
    clearTimeout(hideTimer);
    hideTimer = setTimeout(function () {
      if (document.fullscreenElement) app.classList.add("fs-chrome-hidden");
    }, 3200);
  }

  function initCanvas() {
    var canvas = document.getElementById("pres-bg-canvas");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var orbs = [
      { x: 0.2, y: 0.3, r: 0.35, c: "0,143,211", s: 0.00015 },
      { x: 0.8, y: 0.7, r: 0.3, c: "95,184,50", s: -0.00012 },
      { x: 0.5, y: 0.85, r: 0.25, c: "245,130,32", s: 0.0001 },
    ];
    var t = 0;

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw() {
      var w = canvas.clientWidth;
      var h = canvas.clientHeight;
      ctx.fillStyle = "#060d18";
      ctx.fillRect(0, 0, w, h);
      orbs.forEach(function (o, i) {
        var ox = (o.x + Math.sin(t * o.s * 1000 + i) * 0.08) * w;
        var oy = (o.y + Math.cos(t * o.s * 1000 + i * 2) * 0.06) * h;
        var rad = o.r * Math.min(w, h);
        var g = ctx.createRadialGradient(ox, oy, 0, ox, oy, rad);
        g.addColorStop(0, "rgba(" + o.c + ",0.18)");
        g.addColorStop(1, "rgba(" + o.c + ",0)");
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

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown" || e.key === "Enter") {
      e.preventDefault();
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        next();
        flashChrome();
      } else {
        handleAdvance();
      }
    } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
      e.preventDefault();
      prev();
      flashChrome();
    } else if (e.key === "Home") {
      e.preventDefault();
      show(0);
      flashChrome();
    } else if (e.key === "End") {
      e.preventDefault();
      show(slides.length - 1);
      flashChrome();
    } else if (e.key === "f" || e.key === "F") {
      e.preventDefault();
      toggleFullscreen();
    } else if (e.key === "r" || e.key === "R") {
      e.preventDefault();
      if (isQaSlide(slides[index])) toggleReveal(slides[index]);
      flashChrome();
    }
  });

  viewport?.addEventListener("touchstart", function (e) {
    if (e.target.closest(".pres-reveal-btn")) return;
    touchX = e.changedTouches[0].clientX;
    touchY = e.changedTouches[0].clientY;
  }, { passive: true });

  viewport?.addEventListener("touchend", function (e) {
    if (touchX == null || touchY == null) return;
    if (e.target.closest(".pres-reveal-btn")) {
      touchX = null;
      touchY = null;
      return;
    }
    var dx = e.changedTouches[0].clientX - touchX;
    var dy = e.changedTouches[0].clientY - touchY;
    touchX = null;
    touchY = null;
    var slide = slides[index];

    if (Math.abs(dx) < 36 && Math.abs(dy) < 36) {
      if (isQaSlide(slide) && !isRevealed(slide)) {
        toggleReveal(slide);
        flashChrome();
      }
      return;
    }

    if (Math.abs(dx) < Math.abs(dy)) return;
    if (dx < -50) handleAdvance();
    else if (dx > 50) prev();
    flashChrome();
  }, { passive: true });

  document.getElementById("pres-prev")?.addEventListener("click", function () { prev(); flashChrome(); });
  document.getElementById("pres-next")?.addEventListener("click", function () { handleAdvance(); flashChrome(); });
  document.getElementById("pres-fs")?.addEventListener("click", toggleFullscreen);
  document.querySelector(".pres-hitzone.prev")?.addEventListener("click", function () { prev(); flashChrome(); });
  document.querySelector(".pres-hitzone.next")?.addEventListener("click", function () { handleAdvance(); flashChrome(); });

  document.addEventListener("fullscreenchange", function () {
    document.documentElement.classList.toggle("pres-fs", !!document.fullscreenElement);
    if (document.fullscreenElement) flashChrome();
    else if (app) app.classList.remove("fs-chrome-hidden");
    requestAnimationFrame(fitSlide);
  });

  window.addEventListener("resize", function () { requestAnimationFrame(fitSlide); });
  window.addEventListener("orientationchange", function () {
    setTimeout(function () { requestAnimationFrame(fitSlide); }, 120);
  });
  document.addEventListener("mousemove", flashChrome);

  buildDynamicSlides();
  bindRevealButtons();
  buildChapters();

  var hash = (location.hash || "").match(/^#(\d+)$/);
  initCanvas();
  show(hash ? parseInt(hash[1], 10) - 1 : 0);

  if (document.fonts?.ready) document.fonts.ready.then(fitSlide);
})();