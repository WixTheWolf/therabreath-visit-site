(function () {
  var qaEl = document.getElementById("pkt-qa");
  var stratEl = document.getElementById("pkt-strategic");
  var CARDS_PER_SHEET = 3;

  if (!window.BOI || !qaEl) return;

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function chunk(list, size) {
    var out = [];
    for (var i = 0; i < list.length; i += size) {
      out.push(list.slice(i, i + size));
    }
    return out;
  }

  function renderCard(card, section) {
    var bullets = (card.points || [])
      .map(function (p) {
        return "<li>" + esc(p) + "</li>";
      })
      .join("");

    return (
      '<article class="pkt-card">' +
      '<div class="pkt-card-head">' +
      '<span class="pkt-card-badge">Card ' + card.num + "</span>" +
      '<span class="pkt-card-match">Matches slide · reveal points first</span>' +
      "</div>" +
      '<h3 class="pkt-card-q">' + esc(card.question) + "</h3>" +
      (bullets
        ? '<div class="pkt-block pkt-block-screen">' +
          '<p class="pkt-label">On screen</p>' +
          '<ul class="pkt-points">' +
          bullets +
          "</ul></div>"
        : "") +
      '<div class="pkt-block pkt-block-say">' +
      '<p class="pkt-label">Say</p>' +
      '<p class="pkt-answer">' + esc(card.answer) + "</p></div>" +
      "</article>"
    );
  }

  BOI.qaSections.forEach(function (section) {
    var block = document.createElement("div");
    block.className = "pkt-pillar";
    block.dataset.pillar = String(section.num);

    var sheets = chunk(section.cards, CARDS_PER_SHEET);
    sheets.forEach(function (cards, sheetIndex) {
      var sheet = document.createElement("div");
      sheet.className = "pkt-pillar-sheet";

      var head = document.createElement("div");
      head.className =
        "pkt-pillar-head" + (sheetIndex > 0 ? " pkt-pillar-head-cont" : "");
      head.style.background = section.color;

      if (sheetIndex === 0) {
        head.innerHTML =
          '<span class="pkt-pillar-title">' +
          esc(section.pillarShort) +
          " · " +
          esc(section.pillar) +
          "</span>" +
          '<span class="pkt-pillar-range">Cards ' +
          cards[0].num +
          "–" +
          section.cards[section.cards.length - 1].num +
          "</span>";
      } else {
        head.innerHTML =
          '<span class="pkt-pillar-title">' +
          esc(section.pillarShort) +
          " · continued</span>" +
          '<span class="pkt-pillar-range">Cards ' +
          cards[0].num +
          "–" +
          cards[cards.length - 1].num +
          "</span>";
      }

      sheet.appendChild(head);

      cards.forEach(function (card) {
        var wrap = document.createElement("div");
        wrap.innerHTML = renderCard(card, section);
        sheet.appendChild(wrap.firstChild);
      });

      block.appendChild(sheet);
    });

    qaEl.appendChild(block);
  });

  BOI.strategicQuestions.forEach(function (item) {
    var row = document.createElement("div");
    row.className = "pkt-strat-item";
    var stratBullets = (item.points || [])
      .map(function (p) {
        return "<li>" + esc(p) + "</li>";
      })
      .join("");

    row.innerHTML =
      '<span class="pkt-strat-num">' + item.num + "</span>" +
      '<div class="pkt-strat-body">' +
      '<p class="pkt-strat-q">' + esc(item.question) + "</p>" +
      (stratBullets
        ? '<ul class="pkt-strat-points">' + stratBullets + "</ul>"
        : "") +
      '<p class="pkt-strat-why"><span class="pkt-label-inline">Why ask</span> ' +
      esc(item.why) +
      "</p></div>";
    stratEl.appendChild(row);
  });

  document.getElementById("pkt-print")?.addEventListener("click", function () {
    window.print();
  });

  document.getElementById("pkt-lock")?.addEventListener("click", function () {
    if (typeof TFF !== "undefined" && TFF.logout) TFF.logout();
    else location.href = "/gate";
  });
})();