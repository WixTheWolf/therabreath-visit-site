/**
 * Workshop prototype concepts — stability tiers + mystery game metadata.
 * Bump setMeta.version when cup lineup or codes change before the visit.
 */
(function (global) {
  var SET_META = {
    version: 1,
    label: "July 8 workshop · v1",
    updated: "2026-06-11"
  };

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
      mysteryHints: ["Garden-fresh, not fruity", "Sweet spearmint lift first", "Soft leafy green in the middle", "Clean peppermint close"]
    },
    {
      id: 2, code: "M2", name: "Green Tea Fresh", sub: "Green tea + spearmint",
      station: 2, stability: "watch",
      qcNote: "Green tea character can oxidize — retain study in progress.",
      mysteryHints: ["Steamed leaf, not citrus", "Light botanical body", "Natural and clean", "Spearmint cool finish"]
    },
    {
      id: 3, code: "M3", name: "Crisp Cucumber Mint", sub: "Cucumber + cooling mint",
      station: 2, stability: "flagged",
      qcNote: "QC concern: watery/cucumber notes may not survive chlorite shelf — prototype only.",
      mysteryHints: ["Spa-like and green", "Crisp, watery top", "Not sweet fruit", "Long cooling mint"]
    },
    {
      id: 4, code: "M4", name: "Warm Ginger Mint", sub: "Ginger + peppermint",
      station: 2, stability: "watch",
      qcNote: "Spice warmth without citrus — monitoring spice note fade in retain.",
      mysteryHints: ["Warm root spice", "Earthy, not lemon", "Gentle sweetness", "Peppermint cool out"]
    },
    {
      id: 5, code: "M5", name: "Vanilla Mint Silk", sub: "Vanilla + peppermint",
      station: 2, stability: "flagged",
      qcNote: "QC concern: vanilla complexes still challenged by chlorite oxidation — taste for direction, not release.",
      mysteryHints: ["Creamy and smooth", "Warm round sweetness", "Not candy fruit", "Peppermint cooling finish"]
    },
    {
      id: 6, code: "M6", name: "Overnight Calm Mint", sub: "Chamomile + lavender + mint",
      station: 3, stability: "flagged",
      qcNote: "QC concern: floral chamomile/lavender may degrade — evening positioning exploratory only.",
      mysteryHints: ["Evening wind-down cue", "Soft florals, low intensity", "Calm, not perfumey sweet", "Whisper-light mint"]
    },
    {
      id: 7, code: "M7", name: "Crystal Whitening Mint", sub: "Bright peppermint + icy cool",
      station: 3, stability: "stable",
      qcNote: "Mint-dominant whitening cue — QC comfortable with chlorite architecture.",
      mysteryHints: ["Immediate bright hit", "Icy clean freshness", "Whitening brightness", "Long cooling length"]
    },
    {
      id: 8, code: "M8", name: "Icy Peak Refresh", sub: "Extra-cooling signature mint",
      station: 3, stability: "stable",
      qcNote: "Classic line extension — cooling actives + mint oils in known-stable range.",
      mysteryHints: ["Peak icy hit up front", "Classic mint body", "Extra duration", "Signature TB cooling"]
    },
    {
      id: 9, code: "M9", name: "Winter Frost", sub: "Peppermint + vanilla · LE",
      station: 3, stability: "watch",
      qcNote: "Seasonal LE — vanilla component under retain watch; mint shell likely stable.",
      mysteryHints: ["Winter limited-edition feel", "Sharp peppermint", "Subtle creamy warmth", "Deep icy finish"]
    },
    {
      id: 10, code: "M10", name: "Healthy Gums Herbal", sub: "Eucalyptus + tea tree",
      station: 3, stability: "watch",
      qcNote: "Herbal actives intensity vs. chlorite — clinical-fresh direction needs retain proof.",
      mysteryHints: ["Clinical herbal fresh", "Eucalyptus clarity", "Tea tree clean note", "Soft mint gum-health cue"]
    }
  ];

  function byId(id) {
    return concepts.filter(function (c) { return c.id === +id; })[0];
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
    SET_META: SET_META,
    STABILITY: STABILITY,
    byId: byId,
    setMeta: function () { return SET_META; },
    stabilityMeta: function (key) { return STABILITY[key] || STABILITY.watch; },
    shuffledCodes: shuffledCodes,
    activeList: function () {
      return concepts.filter(function (c) { return c.active !== false; });
    }
  };
})(typeof window !== "undefined" ? window : global);