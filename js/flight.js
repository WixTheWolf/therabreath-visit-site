(function () {
  var STORAGE_KEY = "tff-flight-v1";
  var labels = ["A", "B", "C", "D", "E"];
  var descriptors = ["Clean", "Sweet", "Icy", "Smooth", "Herbal", "Fruity", "Bold", "Mild", "Clinical fresh", "Unique", "Too strong", "Too sweet"];
  var sweetness = ["Too low", "Just right", "Too high"];
  var aftertaste = ["Clean", "Okay", "Lingering", "Harsh"];
  var daily = ["Yes", "Maybe", "No"];
  var card = document.getElementById("flight-card");
  var progressText = document.getElementById("flight-progress-text");
  var progressBar = document.getElementById("flight-progress-bar");
  var step = 0;
  var sampleIndex = 0;

  function blankSample() {
    return {
      liking: 3,
      freshness: 3,
      cooling: 3,
      sweetness: "",
      aftertaste: "",
      character: [],
      reaction: "",
      daily: ""
    };
  }

  function initialState() {
    var samples = {};
    labels.forEach(function (label) { samples[label] = blankSample(); });
    return { guest: "", samples: samples, ranking: { first: "", second: "", third: "" }, finalComment: "", submitted: false };
  }

  function load() {
    var state = TFFStorage.get(STORAGE_KEY, null);
    if (!state || !state.samples) return initialState();
    labels.forEach(function (label) {
      if (!state.samples[label]) state.samples[label] = blankSample();
    });
    if (!state.ranking) state.ranking = { first: "", second: "", third: "" };
    return state;
  }

  function save(state) { TFFStorage.set(STORAGE_KEY, state); }
  function sampleLabel() { return labels[sampleIndex]; }

  function escapeHtml(str) {
    return String(str || "").replace(/[&<>"']/g, function (ch) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch];
    });
  }

  function setProgress(label, pct) {
    progressText.textContent = label;
    progressBar.style.width = Math.max(4, Math.min(100, pct)) + "%";
  }

  function button(text, attrs) {
    return '<button type="button" class="flight-btn" ' + (attrs || "") + ">" + text + "</button>";
  }

  function rating(name, label, value) {
    var out = '<div class="flight-field"><span class="flight-label">' + label + '</span><div class="flight-rating" role="radiogroup" aria-label="' + label + '">';
    for (var i = 1; i <= 5; i++) {
      out += '<button type="button" class="' + (value === i ? "is-on" : "") + '" data-rate="' + name + '" data-value="' + i + '">' + i + "</button>";
    }
    return out + "</div></div>";
  }

  function choices(name, options, current) {
    return '<div class="flight-choice-row">' + options.map(function (opt) {
      return '<button type="button" class="' + (current === opt ? "is-on" : "") + '" data-choice="' + name + '" data-value="' + escapeHtml(opt) + '">' + opt + "</button>";
    }).join("") + "</div>";
  }

  function wireCommon() {
    card.querySelectorAll("[data-next]").forEach(function (btn) {
      btn.addEventListener("click", function () { step = +btn.dataset.next; render(); });
    });
    card.querySelectorAll("[data-back]").forEach(function (btn) {
      btn.addEventListener("click", function () { step = +btn.dataset.back; render(); });
    });
  }

  function renderWelcome() {
    setProgress("Welcome", 4);
    card.innerHTML =
      '<div class="flight-eyebrow">Blind tasting</div>' +
      "<h1>Flavor Flight Challenge</h1>" +
      '<p class="flight-lead">Taste five blind samples. Follow each screen and share your honest freshness feedback.</p>' +
      '<div class="flight-sample-strip">' + labels.map(function (l) { return "<span>Sample " + l + "</span>"; }).join("") + "</div>" +
      button("Start flight", "data-next=\"1\"");
    wireCommon();
  }

  function renderName() {
    var state = load();
    setProgress("Enter name", 8);
    card.innerHTML =
      '<div class="flight-eyebrow">Step 1</div>' +
      "<h1>What should we call you?</h1>" +
      '<p class="flight-lead">Your name helps the host keep responses organized.</p>' +
      '<label class="flight-label" for="flight-name">Name</label>' +
      '<input class="flight-input" id="flight-name" autocomplete="name" placeholder="First name is fine" value="' + escapeHtml(state.guest) + '" />' +
      '<p class="flight-error" id="flight-name-error"></p>' +
      button("Begin Sample A", "id=\"flight-name-next\"");
    document.getElementById("flight-name-next").addEventListener("click", function () {
      var name = document.getElementById("flight-name").value.trim();
      if (!name) {
        document.getElementById("flight-name-error").textContent = "Enter your name to begin.";
        return;
      }
      state.guest = name;
      save(state);
      sampleIndex = 0;
      step = 2;
      render();
    });
    document.getElementById("flight-name").addEventListener("keydown", function (e) {
      if (e.key === "Enter") document.getElementById("flight-name-next").click();
    });
  }

  function renderTaste() {
    var label = sampleLabel();
    setProgress("Sample " + (sampleIndex + 1) + " of 5", 12 + sampleIndex * 16);
    card.innerHTML =
      '<div class="flight-eyebrow">Sample ' + (sampleIndex + 1) + " of 5</div>" +
      "<h1>Taste Sample " + label + "</h1>" +
      '<p class="flight-lead">Take a sip, notice the freshness, then rate it on the next screen.</p>' +
      '<div class="flight-sample-badge">Sample ' + label + "</div>" +
      '<div class="flight-actions two">' +
      (sampleIndex === 0 ? button("Back", "data-back=\"1\"") : button("Back", "id=\"flight-prev-sample\"")) +
      button("I tasted Sample " + label, "data-next=\"3\"") +
      "</div>";
    wireCommon();
    var prev = document.getElementById("flight-prev-sample");
    if (prev) prev.addEventListener("click", function () { sampleIndex--; step = 3; render(); });
  }

  function renderRate() {
    var state = load();
    var label = sampleLabel();
    var s = state.samples[label];
    setProgress("Sample " + (sampleIndex + 1) + " of 5", 20 + sampleIndex * 16);
    card.innerHTML =
      '<div class="flight-eyebrow">Rate Sample ' + label + "</div>" +
      "<h1>How did Sample " + label + " feel?</h1>" +
      rating("liking", "Overall liking", s.liking) +
      rating("freshness", "Freshness", s.freshness) +
      rating("cooling", "Cooling intensity", s.cooling) +
      '<div class="flight-field"><span class="flight-label">Sweetness balance</span>' + choices("sweetness", sweetness, s.sweetness) + "</div>" +
      '<div class="flight-field"><span class="flight-label">Aftertaste</span>' + choices("aftertaste", aftertaste, s.aftertaste) + "</div>" +
      '<div class="flight-field"><span class="flight-label">Flavor character <small>choose up to 3</small></span><div class="flight-chip-row">' +
      descriptors.map(function (d) {
        return '<button type="button" class="' + (s.character.indexOf(d) >= 0 ? "is-on" : "") + '" data-chip="' + escapeHtml(d) + '">' + d + "</button>";
      }).join("") + "</div></div>" +
      '<div class="flight-field"><label class="flight-label" for="flight-reaction">One-word reaction</label><input class="flight-input" id="flight-reaction" maxlength="24" placeholder="Fresh, bold, smooth..." value="' + escapeHtml(s.reaction) + '" /></div>' +
      '<div class="flight-field"><span class="flight-label">Would you use this daily?</span>' + choices("daily", daily, s.daily) + "</div>" +
      '<p class="flight-error" id="flight-rate-error"></p>' +
      '<div class="flight-actions two">' + button("Back", "data-back=\"2\"") + button(sampleIndex === labels.length - 1 ? "Rank favorites" : "Next sample", "id=\"flight-save-sample\"") + "</div>";

    wireCommon();
    card.querySelectorAll("[data-rate]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        s[btn.dataset.rate] = +btn.dataset.value;
        save(state);
        renderRate();
      });
    });
    card.querySelectorAll("[data-choice]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        s[btn.dataset.choice] = btn.dataset.value;
        save(state);
        renderRate();
      });
    });
    card.querySelectorAll("[data-chip]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var chip = btn.dataset.chip;
        var idx = s.character.indexOf(chip);
        if (idx >= 0) s.character.splice(idx, 1);
        else if (s.character.length < 3) s.character.push(chip);
        save(state);
        renderRate();
      });
    });
    document.getElementById("flight-reaction").addEventListener("input", function () {
      s.reaction = this.value.trim();
      save(state);
    });
    document.getElementById("flight-save-sample").addEventListener("click", function () {
      s.reaction = document.getElementById("flight-reaction").value.trim();
      save(state);
      if (!s.sweetness || !s.aftertaste || !s.daily || !s.reaction) {
        document.getElementById("flight-rate-error").textContent = "Complete each item before moving on.";
        return;
      }
      if (sampleIndex < labels.length - 1) {
        sampleIndex++;
        step = 2;
      } else {
        step = 4;
      }
      render();
    });
  }

  function rankSelect(place, label, current, ranking) {
    return '<label class="flight-label" for="rank-' + place + '">' + label + '</label>' +
      '<select class="flight-input" id="rank-' + place + '" data-rank="' + place + '">' +
      '<option value="">Select sample</option>' +
      labels.map(function (sample) {
        var usedElsewhere = Object.keys(ranking).some(function (key) { return key !== place && ranking[key] === sample; });
        return '<option value="' + sample + '"' + (current === sample ? " selected" : "") + (usedElsewhere ? " disabled" : "") + '>Sample ' + sample + "</option>";
      }).join("") + "</select>";
  }

  function renderRank() {
    var state = load();
    setProgress("Rank top 3", 92);
    card.innerHTML =
      '<div class="flight-eyebrow">Final choice</div>' +
      "<h1>Rank your top 3 samples</h1>" +
      '<p class="flight-lead">Pick your favorites from the blind flight.</p>' +
      '<div class="flight-rank-grid">' +
      rankSelect("first", "1st place", state.ranking.first, state.ranking) +
      rankSelect("second", "2nd place", state.ranking.second, state.ranking) +
      rankSelect("third", "3rd place", state.ranking.third, state.ranking) +
      "</div>" +
      '<div class="flight-field"><label class="flight-label" for="flight-final-comment">What would make your favorite sample better?</label><textarea class="flight-input" id="flight-final-comment" rows="4" placeholder="A little sweeter, more cooling, cleaner finish...">' + escapeHtml(state.finalComment) + "</textarea></div>" +
      '<p class="flight-error" id="flight-rank-error"></p>' +
      '<div class="flight-actions two">' + button("Back", "id=\"flight-back-last\"") + button("Submit flight", "id=\"flight-submit\"") + "</div>";

    card.querySelectorAll("[data-rank]").forEach(function (sel) {
      sel.addEventListener("change", function () {
        state.ranking[sel.dataset.rank] = sel.value;
        save(state);
        renderRank();
      });
    });
    document.getElementById("flight-final-comment").addEventListener("input", function () {
      state.finalComment = this.value.trim();
      save(state);
    });
    document.getElementById("flight-back-last").addEventListener("click", function () { sampleIndex = labels.length - 1; step = 3; render(); });
    document.getElementById("flight-submit").addEventListener("click", function () {
      state.finalComment = document.getElementById("flight-final-comment").value.trim();
      save(state);
      var ranks = [state.ranking.first, state.ranking.second, state.ranking.third];
      if (ranks.some(function (r) { return !r; }) || new Set(ranks).size !== 3) {
        document.getElementById("flight-rank-error").textContent = "Choose three different samples.";
        return;
      }
      step = 5;
      render();
      TFFFlightSync.submit(state, function () {
        var done = load();
        done.submitted = true;
        save(done);
        renderThanks();
      });
    });
  }

  function renderSubmitting() {
    setProgress("Submitting", 98);
    card.innerHTML =
      '<div class="flight-eyebrow">Almost done</div>' +
      "<h1>Submitting your flight</h1>" +
      '<p class="flight-lead">Saving your feedback for the host dashboard.</p>' +
      '<div class="flight-loader"></div>';
  }

  function renderThanks() {
    setProgress("Complete", 100);
    card.innerHTML =
      '<div class="flight-eyebrow">Complete</div>' +
      "<h1>Thank you for helping shape the next generation of freshness.</h1>" +
      '<p class="flight-lead">Please return your tasting card/cup to the host.</p>' +
      button("Start a new flight", "id=\"flight-reset\"");
    document.getElementById("flight-reset").addEventListener("click", function () {
      TFFStorage.remove(STORAGE_KEY);
      step = 0;
      sampleIndex = 0;
      render();
    });
  }

  function render() {
    if (load().submitted) return renderThanks();
    if (step === 0) return renderWelcome();
    if (step === 1) return renderName();
    if (step === 2) return renderTaste();
    if (step === 3) return renderRate();
    if (step === 4) return renderRank();
    if (step === 5) return renderSubmitting();
  }

  render();
})();
