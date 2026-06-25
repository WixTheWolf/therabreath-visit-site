/**
 * Renders topic clusters + unified search (pages + optional talk-track index).
 */
(function (global) {
  var DIR = global.SiteDirectory;
  if (!DIR) return;

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function isAuthed() {
    return global.TFF && global.TFF.isAuthed && global.TFF.isAuthed();
  }

  function itemHref(item) {
    if (item.external) return item.href;
    if (item.internal && !isAuthed()) {
      return "/gate?return=" + encodeURIComponent(item.href);
    }
    return item.href;
  }

  function flattenItems(opts) {
    var showInternal = !opts || opts.showInternal !== false;
    var list = [];
    DIR.clusters.forEach(function (cluster) {
      cluster.items.forEach(function (item) {
        if (item.internal && !showInternal) return;
        list.push({
          cluster: cluster,
          item: item,
          blob:
            cluster.title +
            " " +
            cluster.desc +
            " " +
            item.title +
            " " +
            item.desc +
            " " +
            (item.keywords || "") +
            " " +
            (item.path || "")
        });
      });
    });
    return list;
  }

  function scoreMatch(blob, query) {
    var t = blob.toLowerCase();
    var words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (!words.length) return 0;
    var hits = 0;
    words.forEach(function (w) {
      if (t.indexOf(w) !== -1) hits++;
    });
    return hits / words.length;
  }

  function renderClusters(containerId, opts) {
    var el = document.getElementById(containerId);
    if (!el) return;
    var showInternal = opts && opts.showInternal;
    var compact = opts && opts.compact;

    var html = DIR.clusters
      .map(function (cluster) {
        var items = cluster.items.filter(function (item) {
          return showInternal || !item.internal;
        });
        if (!items.length) return "";

        var cards = items
          .map(function (item) {
            var href = itemHref(item);
            var lock = item.internal ? '<span class="dir-lock">Team</span>' : "";
            var hot = item.hot ? '<span class="dir-hot">Key</span>' : "";
            var ext = item.external ? ' target="_blank" rel="noopener"' : "";
            var cls = "dir-card" + (item.internal ? " internal" : "") + (item.hot ? " hot" : "");
            if (compact) {
              return (
                '<a class="' +
                cls +
                '" href="' +
                href +
                '"' +
                ext +
                ">" +
                lock +
                hot +
                "<b>" +
                escapeHtml(item.title) +
                "</b>" +
                (item.path && item.path !== "docx" ? '<em>' + escapeHtml(item.path) + "</em>" : "") +
                "</a>"
              );
            }
            return (
              '<a class="' +
              cls +
              '" href="' +
              href +
              '"' +
              ext +
              ">" +
              lock +
              hot +
              "<h3>" +
              escapeHtml(item.title) +
              "</h3>" +
              "<p>" +
              escapeHtml(item.desc) +
              "</p>" +
              (item.path ? '<em>' + escapeHtml(item.path) + "</em>" : "") +
              "</a>"
            );
          })
          .join("");

        return (
          '<section class="dir-cluster" id="' +
          cluster.id +
          '" style="--cluster-accent:' +
          cluster.accent +
          '">' +
          '<div class="dir-cluster-head">' +
          "<h2>" +
          escapeHtml(cluster.title) +
          "</h2>" +
          "<p>" +
          escapeHtml(cluster.desc) +
          "</p>" +
          "</div>" +
          '<div class="dir-grid' +
          (compact ? " compact" : "") +
          '">' +
          cards +
          "</div></section>"
        );
      })
      .join("");

    el.innerHTML = html;
  }

  function renderJumpNav(navId, opts) {
    var el = document.getElementById(navId);
    if (!el) return;
    var showInternal = opts && opts.showInternal;
    el.innerHTML = DIR.clusters
      .filter(function (c) {
        return c.items.some(function (item) {
          return showInternal || !item.internal;
        });
      })
      .map(function (c) {
        return (
          '<a href="#' +
          c.id +
          '" style="--jump-accent:' +
          c.accent +
          '">' +
          escapeHtml(c.title) +
          "</a>"
        );
      })
      .join("");
  }

  function initSearch(inputId, resultsId, opts) {
    var input = document.getElementById(inputId);
    var results = document.getElementById(resultsId);
    var wrap = input ? input.closest(".dir-search, .cmd-search-wrap") : null;
    if (!input || !results) return;

    var showInternal = !opts || opts.showInternal !== false;
    var includeIndex = opts && opts.includeIndex;
    var pageItems = flattenItems({ showInternal: showInternal });
    var talkIndex = [];
    var loaded = !includeIndex;

    function setOpen(open) {
      if (wrap) wrap.classList.toggle("is-open", open);
    }

    function searchPages(q) {
      return pageItems
        .map(function (row) {
          return { kind: "page", score: scoreMatch(row.blob, q), cluster: row.cluster, item: row.item };
        })
        .filter(function (m) {
          return m.score > 0;
        });
    }

    function searchTalk(q) {
      if (!talkIndex.length) return [];
      return talkIndex
        .map(function (it) {
          return {
            kind: "talk",
            score: scoreMatch(it.q + " " + it.snippet + " " + it.category, q),
            talk: it
          };
        })
        .filter(function (m) {
          return m.score > 0;
        });
    }

    function render(q) {
      var query = (q || "").trim();
      if (!query) {
        results.innerHTML = "";
        results.classList.remove("open");
        setOpen(false);
        return;
      }
      if (!loaded) {
        results.innerHTML = '<p class="dir-search-empty">Loading talk tracks…</p>';
        results.classList.add("open");
        setOpen(true);
        return;
      }

      var matches = searchPages(query).concat(searchTalk(query));
      matches.sort(function (a, b) {
        return b.score - a.score;
      });
      matches = matches.slice(0, 14);

      if (!matches.length) {
        results.innerHTML =
          '<p class="dir-search-empty">No matches for “' + escapeHtml(query) + "” — try Lakewood, chlorite, tasting, or capacity.</p>";
        results.classList.add("open");
        setOpen(true);
        return;
      }

      results.innerHTML = matches
        .map(function (m) {
          if (m.kind === "page") {
            var item = m.item;
            var href = itemHref(item);
            var tag = item.internal ? "Team · " + m.cluster.title : m.cluster.title;
            return (
              '<a class="dir-search-hit cmd-search-hit" href="' +
              href +
              '">' +
              '<span class="dir-search-meta">' +
              escapeHtml(tag) +
              "</span>" +
              "<strong>" +
              escapeHtml(item.title) +
              "</strong>" +
              '<span class="dir-search-snippet">' +
              escapeHtml(item.desc) +
              "</span></a>"
            );
          }
          var t = m.talk;
          return (
            '<a class="dir-search-hit cmd-search-hit talk" href="' +
            t.href +
            "?q=" +
            encodeURIComponent(query) +
            '">' +
            '<span class="dir-search-meta">Talk track · ' +
            escapeHtml(t.category) +
            "</span>" +
            "<strong>" +
            escapeHtml(t.q) +
            "</strong>" +
            '<span class="dir-search-snippet">' +
            escapeHtml(t.snippet) +
            "</span></a>"
          );
        })
        .join("");
      results.classList.add("open");
      setOpen(true);
    }

    if (includeIndex && isAuthed()) {
      fetch("/search-index.json")
        .then(function (r) {
          return r.json();
        })
        .then(function (data) {
          talkIndex = data;
          loaded = true;
          render(input.value);
        })
        .catch(function () {
          loaded = true;
          render(input.value);
        });
    } else {
      loaded = true;
    }

    input.addEventListener("input", function () {
      render(input.value);
    });
    input.addEventListener("focus", function () {
      if (input.value.trim()) render(input.value);
    });
    input.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        results.classList.remove("open");
        setOpen(false);
        input.blur();
      }
    });
    document.addEventListener("click", function (e) {
      if (wrap && !wrap.contains(e.target) && !e.target.closest(".cmd-search-wrap, .dir-search")) {
        results.classList.remove("open");
        setOpen(false);
      }
    });
    results.addEventListener("mousedown", function (e) {
      e.preventDefault();
    });
  }

  global.DirectoryUI = {
    renderClusters: renderClusters,
    renderJumpNav: renderJumpNav,
    initSearch: initSearch,
    flattenItems: flattenItems
  };
})();