/**
 * Guest search — disabled on minimal guest site (empty index).
 */
(function (global) {
  var INDEX = [];

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function init(wrapId, inputId, resultsId) {
    var wrap = document.getElementById(wrapId);
    if (!wrap || !INDEX.length) {
      if (wrap) wrap.style.display = "none";
      return;
    }
    var input = document.getElementById(inputId);
    var results = document.getElementById(resultsId);
    if (!input || !results) return;

    function render(q) {
      var query = (q || "").trim().toLowerCase();
      if (!query) {
        results.innerHTML = "";
        results.classList.remove("open");
        return;
      }
      var hits = INDEX.filter(function (item) {
        var blob = (item.title + " " + item.snippet + " " + (item.keywords || "")).toLowerCase();
        return query.split(/\s+/).every(function (word) {
          return blob.indexOf(word) !== -1;
        });
      }).slice(0, 8);
      if (!hits.length) {
        results.innerHTML = '<p class="guest-search-empty">No matches.</p>';
        results.classList.add("open");
        return;
      }
      results.innerHTML = hits.map(function (item) {
        return (
          '<a href="' + item.href + '">' +
          '<span class="guest-search-cat">' + escapeHtml(item.category) + "</span>" +
          "<b>" + escapeHtml(item.title) + "</b>" +
          "<span>" + escapeHtml(item.snippet) + "</span></a>"
        );
      }).join("");
      results.classList.add("open");
    }

    input.addEventListener("input", function () { render(input.value); });
    input.addEventListener("focus", function () { if (input.value) render(input.value); });
    document.addEventListener("click", function (e) {
      if (!wrap.contains(e.target)) results.classList.remove("open");
    });
  }

  global.TFFGuestSearch = { init: init, index: INDEX };
})();