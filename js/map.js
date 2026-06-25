(function () {
  var STORAGE_KEY = "tff-mystery-v4";
  var concepts = TFFConcepts.activeList();
  var ciphers = TFFConcepts.cipherDisplayList();
  var tags = TFFConcepts.sensoryTags;
  var nameOk = false;
  var pickCup = null;
  var pickCipher = null;
  var pickTags = [];

  function loadState() {
    return TFFStorage.get(STORAGE_KEY, { player: "", nameLocked: false, guesses: {} }) ||
      { player: "", nameLocked: false, guesses: {} };
  }

  function saveState(data) { TFFStorage.set(STORAGE_KEY, data); }

  function setSyncStatus(kind, text) {
    var pill = document.getElementById("sync-pill");
    if (!pill) return;
    pill.className = "boi-sync " + kind;
    pill.textContent = text;
  }

  function syncLive() {
    var state = loadState();
    if (!state.player || !state.nameLocked) return;
    setSyncStatus("pending", "Syncing…");
    TFFMysterySync.push(state, function (data, status) {
      if (data && data.ok) setSyncStatus("ok", "Live · synced to sensory summary");
      else if (status === 503) setSyncStatus("err", "Saved here · live board needs KV");
      else setSyncStatus("err", "Offline · saved on this phone");
    });
  }

  function unlockPanels(on) {
    ["roster-panel", "log-panel", "dossier-panel"].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.classList.toggle("dim", !on);
    });
    var gate = document.getElementById("gate");
    if (gate) gate.style.display = on ? "none" : "block";
  }

  function applyNameLock() {
    var state = loadState();
    nameOk = !!(state.player && state.nameLocked);
    var input = document.getElementById("player");
    var panel = document.getElementById("name-panel");
    if (input) input.value = state.player || "";
    if (input) input.disabled = nameOk;
    var btn = document.getElementById("name-save");
    if (btn) { btn.textContent = nameOk ? "Locked" : "Begin"; btn.disabled = nameOk; }
    if (panel) panel.classList.toggle("locked", nameOk);
    unlockPanels(nameOk);
    if (nameOk) syncLive();
    else setSyncStatus("wait", "Enter name to begin blind mapping");
  }

  function renderRoster() {
    var el = document.getElementById("roster");
    if (!el) return;
    el.innerHTML = ciphers.map(function (c) {
      return '<div class="boi-cipher-tile" style="--tile-hue:' + c.hue + '">' +
        '<span class="glyph">' + c.glyph + '</span>' +
        '<span class="num">' + c.code + '</span>' +
        '<span class="name">' + c.name + '</span></div>';
    }).join("");
  }

  function renderPickers() {
    var state = loadState();
    var used = Object.keys(state.guesses || {});

    var cupEl = document.getElementById("cup-pick");
    if (cupEl) {
      cupEl.innerHTML = concepts.map(function (c) {
        var usedCup = used.indexOf(c.code) >= 0;
        return '<button type="button" class="boi-pick-btn' + (pickCup === c.code ? " is-on" : "") +
          '"' + (usedCup ? " disabled" : "") + ' data-cup="' + c.code + '">' + c.code + '</button>';
      }).join("");
    }

    var cipherEl = document.getElementById("cipher-pick");
    if (cipherEl) {
      cipherEl.innerHTML = ciphers.map(function (c) {
        return '<button type="button" class="boi-pick-btn' + (pickCipher === c.id ? " is-on" : "") +
          '" data-cipher="' + c.id + '"><span class="cn">' + c.name + '</span><span>' + c.code + '</span></button>';
      }).join("");
    }

    var tagEl = document.getElementById("tag-pick");
    if (tagEl) {
      tagEl.innerHTML = tags.map(function (t) {
        var on = pickTags.indexOf(t) >= 0;
        return '<button type="button" class="boi-tag-btn' + (on ? " is-on" : "") + '" data-tag="' + t + '">' + t + '</button>';
      }).join("");
    }

    var submit = document.getElementById("submit-guess");
    if (submit) submit.disabled = !(nameOk && pickCup && pickCipher);

    document.querySelectorAll("[data-cup]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (btn.disabled) return;
        pickCup = btn.dataset.cup;
        renderPickers();
      });
    });
    document.querySelectorAll("[data-cipher]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        pickCipher = +btn.dataset.cipher;
        renderPickers();
      });
    });
    document.querySelectorAll("[data-tag]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var t = btn.dataset.tag;
        var i = pickTags.indexOf(t);
        if (i >= 0) pickTags.splice(i, 1);
        else pickTags.push(t);
        renderPickers();
      });
    });
  }

  function renderDossier() {
    var state = loadState();
    var entries = concepts.filter(function (c) {
      return state.guesses[c.code] && state.guesses[c.code].guess;
    });

    var countEl = document.getElementById("dossier-count");
    if (countEl) {
      countEl.textContent = entries.length + " cup" + (entries.length === 1 ? "" : "s") + " logged";
    }

    var dossier = document.getElementById("dossier");
    if (!dossier) return;

    if (!entries.length) {
      dossier.innerHTML = '<div class="boi-empty">No entries yet — taste a cup, then record your match.</div>';
      return;
    }

    dossier.innerHTML = entries.map(function (c) {
      var g = state.guesses[c.code];
      var cipher = TFFConcepts.cipherById(g.guess);
      var tagStr = (g.tags && g.tags.length) ? g.tags.join(" · ") : "No notes";
      return '<div class="boi-entry">' +
        '<span class="cup">' + c.code + '</span>' +
        '<span class="arrow">→</span>' +
        '<div class="cipher-chip">' +
        '<span class="cipher-dot" style="background:' + cipher.hue + '">' + cipher.glyph + '</span>' +
        '<div><b>' + cipher.name + '</b><small>' + cipher.code + ' · ' + tagStr + '</small></div>' +
        '</div>' +
        '<span class="sealed">Sealed</span></div>';
    }).join("");
  }

  function submitGuess() {
    if (!nameOk || !pickCup || !pickCipher) return;
    var concept = concepts.filter(function (c) { return c.code === pickCup; })[0];
    var state = loadState();
    state.guesses[pickCup] = {
      guess: pickCipher,
      correct: pickCipher === TFFConcepts.answerCipherFor(concept.id),
      revealed: true,
      tags: pickTags.slice()
    };
    saveState(state);
    pickCup = null;
    pickCipher = null;
    pickTags = [];
    renderPickers();
    renderDossier();
    syncLive();
  }

  function renderHost() {
    var table = document.getElementById("host-table");
    if (!table) return;
    table.innerHTML =
      "<tr><th>Cup</th><th>Codename</th><th>Concept</th><th>QC</th><th>Host note</th></tr>" +
      concepts.map(function (c) {
        var cipher = TFFConcepts.cipherById(TFFConcepts.answerCipherFor(c.id));
        var m = TFFConcepts.stabilityMeta(c.stability);
        var note = (c.hostNotes && c.hostNotes[0]) ? c.hostNotes[0] : c.qcNote;
        return "<tr><td><b>" + c.code + "</b></td><td>" + cipher.code + " " + cipher.name +
          "</td><td>" + String(c.id).padStart(2, "0") + " " + c.name +
          "</td><td><span class=\"boi-tag-qc " + m.class + "\">" + m.short + "</span></td>" +
          "<td>" + note + "</td></tr>";
      }).join("");
  }

  function showHostKey() {
    document.getElementById("host-gate").style.display = "none";
    document.getElementById("host").classList.add("show");
    document.getElementById("host-err").classList.remove("show");
    document.getElementById("host-pw").value = "";
    document.getElementById("host-btn").textContent = "Host key · unlocked";
  }

  function hideHostKey() {
    document.getElementById("host").classList.remove("show");
    document.getElementById("host-gate").style.display = "none";
    document.getElementById("host-btn").textContent = "Host key";
  }

  function requestHostKey() {
    if (typeof TFF !== "undefined" && TFF.isAuthed && TFF.isAuthed()) {
      showHostKey();
      return;
    }
    hideHostKey();
    document.getElementById("host-gate").style.display = "block";
    document.getElementById("host-pw").focus();
  }

  window.resetGame = function () {
    if (!confirm("Clear all blind mapping entries on this device?")) return;
    TFFStorage.remove(STORAGE_KEY);
    nameOk = false;
    pickCup = null;
    pickCipher = null;
    pickTags = [];
    applyNameLock();
    renderPickers();
    renderDossier();
  };

  document.getElementById("name-save").addEventListener("click", function () {
    var name = document.getElementById("player").value.trim();
    if (!name) { alert("Please enter your name for the live board."); return; }
    var state = loadState();
    state.player = name;
    state.nameLocked = true;
    saveState(state);
    applyNameLock();
    renderPickers();
    renderDossier();
  });

  document.getElementById("player").addEventListener("keydown", function (e) {
    if (e.key === "Enter") document.getElementById("name-save").click();
  });

  document.getElementById("submit-guess").addEventListener("click", submitGuess);

  document.getElementById("host-btn").addEventListener("click", function () {
    if (document.getElementById("host").classList.contains("show")) hideHostKey();
    else requestHostKey();
  });

  document.getElementById("host-lock-btn").addEventListener("click", hideHostKey);

  document.getElementById("host-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var pw = document.getElementById("host-pw").value;
    var btn = document.getElementById("host-unlock-btn");
    var err = document.getElementById("host-err");
    err.classList.remove("show");
    btn.disabled = true;
    btn.textContent = "Checking…";
    TFF.login(pw).then(function (ok) {
      btn.disabled = false;
      btn.textContent = "Show answers";
      if (ok) showHostKey();
      else {
        err.classList.add("show");
        document.getElementById("host-pw").value = "";
        document.getElementById("host-pw").focus();
      }
    });
  });

  renderRoster();
  applyNameLock();
  renderPickers();
  renderDossier();
  renderHost();
})();