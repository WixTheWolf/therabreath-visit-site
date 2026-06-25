/**
 * Workshop prototype concepts — stability tiers + blind mapping metadata.
 */
(function (global) {
  var SET_META = {
    version: 4,
    label: "July 8 workshop · mint platform tasting v4",
    updated: "2026-06-24"
  };

  var CIPHER_ANSWER = {
    1: 3, 2: 5, 3: 1, 4: 4, 5: 2
  };

  var CIPHER_DISPLAY_ORDER = [3, 5, 1, 4, 2];

  var CIPHERS = [
    { id: 1, code: "01", name: "ATLAS", hue: "#008fd3", glyph: "◆" },
    { id: 2, code: "02", name: "BIRCH", hue: "#5fb832", glyph: "◇" },
    { id: 3, code: "03", name: "CORAL", hue: "#f58220", glyph: "○" },
    { id: 4, code: "04", name: "DRIFT", hue: "#2a9d8f", glyph: "△" },
    { id: 5, code: "05", name: "EMBER", hue: "#c45c26", glyph: "□" }
  ];

  var SENSORY_TAGS = [
    "Mint-forward", "Sweet", "Icy / cooling", "Herbal", "Floral",
    "Spicy / warm", "Crisp / green", "Creamy / smooth", "Clinical fresh", "Light / delicate"
  ];

  var STABILITY = {
    stable: { label: "QC cleared", short: "Stable lane", class: "stable", desc: "Mint-forward or proven chlorite builders." },
    watch: { label: "Stability review", short: "Stability review", class: "watch", desc: "Worth tasting for direction; retain study in progress." },
    flagged: { label: "Retain review", short: "Retain review", class: "flagged", desc: "Workshop pour for sensory discussion." }
  };

  var concepts = [
    {
      id: 1, code: "M1", name: "Fresh Herbal Mint",
      sub: "Black tea · lavender · lemon · eucalyptus · spearmint · peppermint · ginger",
      station: 2, stability: "watch",
      qcNote: "Tea-herbal layering with lemon and ginger — workshop pour for directional feedback in chlorite.",
      hostNotes: ["Black Tea", "Lavender", "Lemon", "Eucalyptus", "Spearmint", "Peppermint", "Ginger"]
    },
    {
      id: 2, code: "M2", name: "Grove Mint",
      sub: "Rosemary · ylang ylang · palmarosa · eucalyptus · spearmint · peppermint",
      station: 2, stability: "watch",
      qcNote: "Woody-herbal grove character with floral lift — retain study in progress.",
      hostNotes: ["Rosemary", "Ylang Ylang", "Palmarosa", "Eucalyptus", "Spearmint", "Peppermint"]
    },
    {
      id: 3, code: "M3", name: "Botanical Mint",
      sub: "Wintergreen · tea tree · rosewood · lavender · eucalyptus · lemongrass · peppermint",
      station: 2, stability: "watch",
      qcNote: "Botanical clinical-fresh profile — wintergreen and tea tree under retain review.",
      hostNotes: ["Wintergreen", "Tea Tree", "Rosewood", "Lavender", "Eucalyptus", "Lemongrass", "Peppermint"]
    },
    {
      id: 4, code: "M4", name: "Immunity Mint",
      sub: "Lemon · ginger · peppermint",
      station: 2, stability: "watch",
      qcNote: "Bright lemon-ginger lift over peppermint — wellness cue, retain study in progress.",
      hostNotes: ["Lemon", "Ginger", "Peppermint"]
    },
    {
      id: 5, code: "M5", name: "Garden Mint",
      sub: "Lavender · citronellal · spearmint · peppermint",
      station: 2, stability: "watch",
      qcNote: "Floral-garden calm with citronellal freshness — lavender retain review in chlorite.",
      hostNotes: ["Lavender", "Citronellal", "Spearmint", "Peppermint"]
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

  global.TFFConcepts = {
    concepts: concepts,
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
    activeList: function () {
      return concepts.filter(function (c) { return c.active !== false; });
    },
    cipherList: function () {
      return CIPHERS.slice();
    }
  };
})(typeof window !== "undefined" ? window : global);