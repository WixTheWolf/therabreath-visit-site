/**
 * July 8 visit packet — numbered chapters and index entries.
 * Guest-facing only: no internal playbooks, formula PDFs, or wrong-file links.
 * PDF paths resolve under /booklet/documents/
 */
(function (global) {
  var CHAPTERS = [
    {
      num: 1,
      title: "Partnership & prep",
      subtitle: "Context · agenda · what to expect",
      accent: "#008fd3"
    },
    {
      num: 2,
      title: "July 8 schedule",
      subtitle: "Suggested times · passport · presentation",
      accent: "#5fb832"
    },
    {
      num: 3,
      title: "Operations & facility",
      subtitle: "Qualifications · traceability · certifications",
      accent: "#f58220"
    },
    {
      num: 4,
      title: "Innovation & portfolio",
      subtitle: "Flavor gallery · seasonal directions · chlorite context",
      accent: "#008fd3"
    },
    {
      num: 5,
      title: "Sensory & Lakewood",
      subtitle: "Validation framework · site parity · test kits",
      accent: "#5fb832"
    },
    {
      num: 6,
      title: "Quality & documentation",
      subtitle: "Spec format · COAs · sample release examples",
      accent: "#5b6b8a"
    },
    {
      num: 7,
      title: "Live workshop tools",
      subtitle: "Phones · tasting · scoring · QRs",
      accent: "#008fd3"
    }
  ];

  var ITEMS = [
    { n: 1, ch: 1, title: "Partnership overview · PDF", type: "pdf", file: "01-together-we-win-partnership.pdf", desc: "Four pillars, July 8 agenda, and Lakewood validation path — working session framing." },
    { n: 2, ch: 1, title: "Executive one-pager", type: "site", href: "/onepager", desc: "Single-page summary for procurement — print from the visit site." },
    { n: 3, ch: 1, title: "July 8 meeting prep", type: "site", href: "/prepare", desc: "Suggested agenda, discussion highlights, and how to prepare before you arrive." },
    { n: 4, ch: 1, title: "10 questions for your team", type: "site", href: "/prepare#strategic-questions", desc: "Partnership and growth topics — prepare thoughtful answers before July 8." },
    { n: 5, ch: 1, title: "Breath of Innovation · day-of hub", type: "site", href: "/visit", desc: "Live schedule, presentation, portfolio, and tasting tools." },

    { n: 6, ch: 2, title: "Suggested agenda · PDF", type: "pdf", file: "suggested-agenda-therabreath.pdf", desc: "Shareable schedule with discussion topics from your email threads." },
    { n: 7, ch: 2, title: "Visitor passport", type: "site", href: "/passport", desc: "Pocket follow-along — checklist, notes, and scoring lines." },
    { n: 8, ch: 2, title: "The Flavor Factory · capabilities", type: "site", href: "/flavor-factory", desc: "Norco facility overview — certifications, single-site model, tour context." },
    { n: 9, ch: 2, title: "Live presentation + print slides", type: "site", href: "/present", desc: "9:30 AM · four pillars · open Q&A. /slides is the print backup." },

    { n: 10, ch: 3, title: "Norco facility survey", type: "pdf", file: "04-norco-facility-survey.pdf", desc: "Supplier quality system assessment for Church & Dwight qualification." },
    { n: 11, ch: 3, title: "NOP certificate addendum · product list", type: "pdf", file: "12-nop-cert-addendum.pdf", desc: "Organic certification listing for procurement review." },

    { n: 12, ch: 4, title: "Flavor portfolio gallery · live", type: "site", href: "/portfolio", desc: "53 flavors — on-shelf SKUs, presented concepts, pipeline M1–M5, Gen Alpha." },
    { n: 13, ch: 4, title: "Seasonal flavors · oral care directions", type: "pdf", file: "05-seasonal-flavors-oral-care.pdf", desc: "Seasonal and limited-edition rinse directions for discussion." },
    { n: 14, ch: 4, title: "Chlorite & flavor overview", type: "site", href: "/chlorite-flavor", desc: "Why oxidative oral-care bases need a different flavor approach — guest summary." },

    { n: 15, ch: 5, title: "Sensory validation framework", type: "pdf", file: "09-sensory-validation-framework.pdf", desc: "Triangle, blind, and panel protocols with brand teams." },
    { n: 16, ch: 5, title: "Lakewood sensory validation · one-pager", type: "pdf", file: "10-lakewood-sensory-validation.pdf", desc: "Site parity program summary for mouthrinse production." },
    { n: 17, ch: 5, title: "Lakewood parity plan · full proposal", type: "site", href: "/lakewood", desc: "Eight-variant transfer program and timeline." },
    { n: 18, ch: 5, title: "Triangle test form · TheraBreath", type: "pdf", file: "11-triangle-test-form.pdf", desc: "ISO 4120 form for post-visit pilots." },
    { n: 19, ch: 5, title: "Triangle test kit · print", type: "site", href: "/triangle", desc: "Full triangle protocol packet for scheduling." },
    { n: 20, ch: 5, title: "Blind comparison kit · print", type: "site", href: "/blind", desc: "Blind protocol forms when triangle flags a difference." },

    { n: 21, ch: 6, title: "Sample spec sheet · MI-18727", type: "pdf", file: "13-spec-sheet-example.pdf", desc: "Representative flavor specification format." },
    { n: 22, ch: 6, title: "Certificate of analysis · MI lot", type: "pdf", file: "coas/coa-mi.pdf", desc: "Production COA example — mint blend mouthwash flavor." },
    { n: 23, ch: 6, title: "Certificate of analysis · PE lot", type: "pdf", file: "coas/coa-pe.pdf", desc: "Production COA example — peppermint oil." },
    { n: 24, ch: 6, title: "Certificate of analysis · TR lot", type: "pdf", file: "coas/coa-tr.pdf", desc: "Production COA example — citrus terpenes blend." },
    { n: 25, ch: 6, title: "Sample documentation · MI-22008", type: "pdf", file: "samples/MI-22008-sample.pdf", desc: "Sample-release COA — winter spice mint type flavor." },
    { n: 26, ch: 6, title: "Sample documentation · PE-22004", type: "pdf", file: "samples/PE-22004-sample.pdf", desc: "Sample-release COA — peppermint vanilla type flavor." },
    { n: 27, ch: 6, title: "Peppermint vanilla flavor reference", type: "pdf", file: "samples/peppermint-vanilla-flavor.pdf", desc: "Product attribute sheet — documentation format example." },

    { n: 28, ch: 7, title: "Blind flavor mapping · /mystery", type: "site", href: "/mystery", desc: "Coded cups M1–M5 — match taste before reveal." },
    { n: 29, ch: 7, title: "Prototype scorecard · /score", type: "site", href: "/score", desc: "Rate prototypes 1–9 after names are shown." },
    { n: 30, ch: 7, title: "Tasting station signs", type: "site", href: "/stations", desc: "Print signs for the 10:30 tasting — mapping and score QRs." },
    { n: 31, ch: 7, title: "QR print sheet · all scan codes", type: "site", href: "/qr", desc: "Postcards for visit home, booklet, mystery, and score." }
  ];

  var AGENDA = [
    { time: "9:00–9:25", label: "Facility tour", note: "2058 Second Street · production, QC, TheraBreath room" },
    { time: "9:30–10:15", label: "TFF presentation", note: "Conference room across the street · four pillars" },
    { time: "10:15–10:30", label: "Break", note: "Reset before tasting" },
    { time: "10:30–11:15", label: "Tasting · five mint platforms", note: "Cups M1–M5 · blind mapping · then scorecard" },
    { time: "11:30–1:00", label: "Lunch off site", note: "Hosts take the group · back 1:00 PM" },
    { time: "1:00+", label: "Open discussion & Q&A", note: "Lakewood · procurement · your pace" }
  ];

  var HOSTS = (global.TFFTeam
    ? (global.TFFTeam.visitHosts ? global.TFFTeam.visitHosts() : global.TFFTeam.members).map(function (m) {
        return { name: m.name, role: m.title, desc: m.desc };
      })
    : [
        { name: "Dan Wixted", role: "President", desc: "" },
        { name: "Alex Wixted", role: "Operations", desc: "" },
        { name: "Ryan Wixted", role: "Quality and Regulatory", desc: "" },
        { name: "Matt Wixted", role: "Production Manager", desc: "" }
      ]);

  function href(item) {
    if (item.type === "pdf") return "/booklet/documents/" + item.file;
    return item.href || "#";
  }

  function typeLabel(item) {
    if (item.type === "pdf") return "PDF";
    if (item.href && item.href.indexOf("/passport") === 0) return "Print";
    return "Site";
  }

  global.TFFBooklet = {
    chapters: CHAPTERS,
    items: ITEMS,
    agenda: AGENDA,
    hosts: HOSTS,
    href: href,
    typeLabel: typeLabel
  };
})(typeof window !== "undefined" ? window : global);
