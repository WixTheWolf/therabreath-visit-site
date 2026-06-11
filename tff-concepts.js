/**
 * Workshop prototype concepts — stability tiers + Blind Flavor Mapping metadata.
 * Bump setMeta.version when cup lineup or codes change before the visit.
 */
(function (global) {
  var SET_META = {
    version: 3,
    label: "July 8 workshop · blind mapping v3",
    updated: "2026-06-11"
  };

  /*
   * Answer key — cup concept id → correct cipher id (scrambled; NOT 1:1 with cup number).
   * M1 is NOT cipher 01. Re-bump SET_META.version if you change this map.
   */
  var CIPHER_ANSWER = {
    1: 8, 2: 5, 3: 1, 4: 10, 5: 4,
    6: 2, 7: 9, 8: 3, 9: 6, 10: 7
  };

  /* Guest UI display order — ciphers shuffled so 01 is not first pick */
  var CIPHER_DISPLAY_ORDER = [8, 3, 10, 1, 5, 7, 2, 9, 4, 6];

  /* Neutral codenames — no flavor cues. Guests map cup codes (M1–M10) to ciphers by taste alone. */
  var CIPHERS = [
    { id: 1, code: "01", name: "ATLAS", hue: "#008fd3", glyph: "◆" },
    { id: 2, code: "02", name: "BIRCH", hue: "#5fb832", glyph: "◇" },
    { id: 3, code: "03", name: "CORAL", hue: "#f58220", glyph: "○" },
    { id: 4, code: "04", name: "DRIFT", hue: "#2a9d8f", glyph: "△" },
    { id: 5, code: "05", name: "EMBER", hue: "#c45c26", glyph: "□" },
    { id: 6, code: "06", name: "HAZE", hue: "#7b6ba8", glyph: "◈" },
    { id: 7, code: "07", name: "PRISM", hue: "#00b4d8", glyph: "✦" },
    { id: 8, code: "08", name: "RIDGE", hue: "#0077b6", glyph: "▲" },
    { id: 9, code: "09", name: "FROST", hue: "#90e0ef", glyph: "❄" },
    { id: 10, code: "10", name: "MERIDIAN", hue: "#1e6b3a", glyph: "◎" }
  ];

  var SENSORY_TAGS = [
    "Mint-forward", "Sweet", "Icy / cooling", "Herbal", "Floral",
    "Spicy / warm", "Crisp / green", "Creamy / smooth", "Clinical fresh", "Light / delicate"
  ];

  var STABILITY = {
    stable: {
      label: "QC cleared",
      short: "Stable lane",
      class: "stable",
      desc: "Mint-forward or proven chlorite builders — retain testing underway or aligned with current line practice."
    },
    watch: {
      label: "Prototype · testing",
      short: "Stability TBD",
      class: "watch",
      desc: "Worth tasting for direction; full 4°C / RT / 40°C retain not complete. What you taste today may not equal shelf life."
    },
    flagged: {
      label: "QC concern",
      short: "QC flagged",
      class: "flagged",
      desc: "QC does not believe this profile will hold in sodium chlorite as formulated — workshop pour for sensory discussion only."
    }
  };

  /* To swap flavors: edit entries below, set active:false to hide, bump SET_META.version */
  var concepts = [
    {
      id: 1, code: "M1", name: "Spearmint Garden", sub: "Sweet spearmint + green herb",
      station: 2, stability: "stable",
      qcNote: "Spearmint + soft herbal — closest to proven mint lanes in chlorite.",
      hostNotes: ["Spearmint + soft herbal — garden-fresh lift, clean peppermint close"]
    },
    {
      id: 2, code: "M2", name: "Green Tea Fresh", sub: "Green tea + spearmint",
      station: 2, stability: "watch",
      qcNote: "Green tea character can oxidize — retain study in progress.",
      hostNotes: ["Green tea + spearmint — steamed leaf, light botanical body"]
    },
    {
      id: 3, code: "M3", name: "Crisp Cucumber Mint", sub: "Cucumber + cooling mint",
      station: 2, stability: "flagged",
      qcNote: "QC concern: watery/cucumber notes may not survive chlorite shelf — prototype only.",
      hostNotes: ["Cucumber + cooling mint — crisp watery top, long cooling finish"]
    },
    {
      id: 4, code: "M4", name: "Warm Ginger Mint", sub: "Ginger + peppermint",
      station: 2, stability: "watch",
      qcNote: "Spice warmth without citrus — monitoring spice note fade in retain.",
      hostNotes: ["Ginger + peppermint — warm root spice, gentle sweetness"]
    },
    {
      id: 5, code: "M5", name: "Vanilla Mint Silk", sub: "Vanilla + peppermint",
      station: 2, stability: "flagged",
      qcNote: "QC concern: vanilla complexes still challenged by chlorite oxidation — taste for direction, not release.",
      hostNotes: ["Vanilla + peppermint — creamy smooth, warm round sweetness"]
    },
    {
      id: 6, code: "M6", name: "Overnight Calm Mint", sub: "Chamomile + lavender + mint",
      station: 3, stability: "flagged",
      qcNote: "QC concern: floral chamomile/lavender may degrade — evening positioning exploratory only.",
      hostNotes: ["Chamomile + lavender + mint — soft florals, evening calm cue"]
    },
    {
      id: 7, code: "M7", name: "Crystal Whitening Mint", sub: "Bright peppermint + icy cool",
      station: 3, stability: "stable",
      qcNote: "Mint-dominant whitening cue — QC comfortable with chlorite architecture.",
      hostNotes: ["Bright peppermint + icy cool — immediate hit, whitening brightness"]
    },
    {
      id: 8, code: "M8", name: "Icy Peak Refresh", sub: "Extra-cooling signature mint",
      station: 3, stability: "stable",
      qcNote: "Classic line extension — cooling actives + mint oils in known-stable range.",
      hostNotes: ["Extra-cooling signature mint — peak icy hit, classic TB cooling length"]
    },
    {
      id: 9, code: "M9", name: "Winter Frost", sub: "Peppermint + vanilla · LE",
      station: 3, stability: "watch",
      qcNote: "Seasonal LE — vanilla component under retain watch; mint shell likely stable.",
      hostNotes: ["Peppermint + vanilla LE — sharp mint, subtle creamy warmth"]
    },
    {
      id: 10, code: "M10", name: "Healthy Gums Herbal", sub: "Eucalyptus + tea tree",
      station: 3, stability: "watch",
      qcNote: "Herbal actives intensity vs. chlorite — clinical-fresh direction needs retain proof.",
      hostNotes: ["Eucalyptus + tea tree — clinical herbal fresh, gum-health cue"]
    }
  ];

  function byId(id) {
    return concepts.filter(function (c) { return c.id === +id; })[0];
  }

  function cipherById(id) {
    return CIPHERS.filter(function (c) { return c.id === +id; })[0];
  }

  function answerCipherFor(conceptId) {
    return CIPHER_ANSWER[+conceptId] || +conceptId;
  }

  function cipherDisplayList() {
    return CIPHER_DISPLAY_ORDER.map(function (id) {
      return cipherById(id);
    }).filter(Boolean);
  }

  function shuffledCodes(seed) {
    var arr = concepts.map(function (c) { return c.code; });
    var s = seed || Date.now();
    for (var i = arr.length - 1; i > 0; i--) {
      s = (s * 9301 + 49297) % 233280;
      var j = Math.floor((s / 233280) * (i + 1));
      var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }

  global.TFFConcepts = {
    list: concepts,
    ciphers: CIPHERS,
    sensoryTags: SENSORY_TAGS,
    SET_META: SET_META,
    STABILITY: STABILITY,
    byId: byId,
    cipherById: cipherById,
    answerCipherFor: answerCipherFor,
    cipherDisplayList: cipherDisplayList,
    CIPHER_ANSWER: CIPHER_ANSWER,
    setMeta: function () { return SET_META; },
    stabilityMeta: function (key) { return STABILITY[key] || STABILITY.watch; },
    shuffledCodes: shuffledCodes,
    activeList: function () {
      return concepts.filter(function (c) { return c.active !== false; });
    },
    cipherList: function () {
      return CIPHERS.slice();
    }
  };
})(typeof window !== "undefined" ? window : global);