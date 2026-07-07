(function () {
  var labels = ["A", "B", "C", "D", "E"];
  var concepts = TFFConcepts.activeList();
  var lock = document.getElementById("flight-admin-lock");
  var panel = document.getElementById("flight-admin-panel");
  var resultsEl = document.getElementById("flight-results");
  var lastData = null;

  function escapeHtml(str) {
    return String(str || "").replace(/[&<>"']/g, function (ch) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch];
    });
  }

  function sampleName(label) { return "Sample " + label; }

  function conceptForLabel(label) {
    return concepts[labels.indexOf(label)] || null;
  }

  function pct(count, total) {
    return total ? Math.round((count / total) * 100) + "%" : "0%";
  }

  function unlock() {
    lock.hidden = true;
    panel.hidden = false;
    renderKey();
    fetchResults();
  }

  function fetchResults() {
    fetch("/api/flight/live", { credentials: "same-origin" })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (!data.ok) throw new Error(data.error || "Unable to load");
        lastData = data;
        render(data);
      })
      .catch(function () {
        resultsEl.innerHTML = '<div class="flight-admin-empty">No live results yet, or live storage is not configured.</div>';
      });
  }

  function descriptorList(stats) {
    var top = (stats.topDescriptors || []).slice(0, 4);
    if (!top.length) return '<span class="muted">No descriptors yet</span>';
    return top.map(function (d) { return '<span>' + escapeHtml(d.label) + " " + d.count + "</span>"; }).join("");
  }

  function dailyIntent(stats) {
    var d = stats.daily || {};
    var total = stats.count || 0;
    return '<div class="flight-intent">' +
      '<span>Yes <b>' + pct(d.Yes || 0, total) + "</b></span>" +
      '<span>Maybe <b>' + pct(d.Maybe || 0, total) + "</b></span>" +
      '<span>No <b>' + pct(d.No || 0, total) + "</b></span>" +
      "</div>";
  }

  function scoreLine(label, value) {
    var shown = value ? value.toFixed(1) : "-";
    var width = value ? (value / 5) * 100 : 0;
    return '<div class="flight-score-line"><span>' + label + '</span><b>' + shown + '/5</b><i><em style="width:' + width + '%"></em></i></div>';
  }

  function render(data) {
    var count = data.count || 0;
    document.getElementById("flight-response-count").textContent = count;
    document.getElementById("flight-top-ranked").textContent = data.topRanked ? sampleName(data.topRanked) : "-";
    document.getElementById("flight-updated").textContent = data.updatedAt ? new Date(data.updatedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : "-";

    var stats = data.aggregate || {};
    resultsEl.innerHTML = labels.map(function (label) {
      var s = stats[label] || {};
      return '<article class="flight-result-card">' +
        '<div class="flight-result-head"><span>' + sampleName(label) + '</span><b>' + (s.count || 0) + ' responses</b></div>' +
        scoreLine("Overall liking", s.liking || 0) +
        scoreLine("Freshness", s.freshness || 0) +
        scoreLine("Cooling", s.cooling || 0) +
        '<h3>Common descriptors</h3><div class="flight-descriptor-list">' + descriptorList(s) + '</div>' +
        '<h3>Daily-use intent</h3>' + dailyIntent(s) +
        '<h3>Rank points</h3><p class="flight-rank-points">' + (s.rankPoints || 0) + '</p>' +
      "</article>";
    }).join("");
  }

  function renderKey() {
    document.getElementById("flight-key").innerHTML = labels.map(function (label) {
      var c = conceptForLabel(label);
      if (!c) return "";
      return '<div class="flight-key-row"><b>' + sampleName(label) + '</b><span>' + escapeHtml(c.name) + '</span><small>' + escapeHtml(c.sub) + '</small></div>';
    }).join("");
  }

  function csvEscape(value) {
    var s = String(value == null ? "" : value);
    return '"' + s.replace(/"/g, '""') + '"';
  }

  function exportCsv() {
    var data = lastData || {};
    var lines = [[
      "Guest", "Sample", "Flavor key", "Overall liking", "Freshness", "Cooling intensity",
      "Sweetness balance", "Aftertaste", "Descriptors", "One-word reaction", "Daily use",
      "Rank", "Final comment", "Submitted at"
    ].map(csvEscape).join(",")];

    (data.submissions || []).forEach(function (sub) {
      labels.forEach(function (label) {
        var s = (sub.samples || {})[label] || {};
        var rank = "";
        if (sub.ranking && sub.ranking.first === label) rank = "1";
        if (sub.ranking && sub.ranking.second === label) rank = "2";
        if (sub.ranking && sub.ranking.third === label) rank = "3";
        var c = conceptForLabel(label);
        lines.push([
          sub.guest, sampleName(label), c ? c.name : "", s.liking, s.freshness, s.cooling,
          s.sweetness, s.aftertaste, (s.character || []).join("; "), s.reaction, s.daily,
          rank, sub.finalComment, sub.updatedAt
        ].map(csvEscape).join(","));
      });
    });

    var blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "flavor-flight-results.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  document.getElementById("flight-admin-login").addEventListener("submit", function (e) {
    e.preventDefault();
    var err = document.getElementById("flight-admin-error");
    err.classList.remove("show");
    TFF.login(document.getElementById("flight-admin-password").value).then(function (ok) {
      if (ok) unlock();
      else err.classList.add("show");
    });
  });

  document.getElementById("flight-refresh").addEventListener("click", fetchResults);
  document.getElementById("flight-export").addEventListener("click", exportCsv);
  document.getElementById("flight-reset").addEventListener("click", function () {
    if (!confirm("Clear all live Flavor Flight results?")) return;
    fetch("/api/flight/live", { method: "DELETE", credentials: "same-origin" }).then(fetchResults);
  });

  if (TFF.isAuthed()) unlock();
})();
