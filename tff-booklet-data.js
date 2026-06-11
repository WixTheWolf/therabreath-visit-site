/**
 * Welcome booklet — numbered chapters and index entries.
 * PDF paths resolve under /booklet/documents/
 */
(function (global) {
  var CHAPTERS = [
    {
      num: 1,
      title: "Welcome & Partnership",
      subtitle: "Why we're here · growth vision",
      accent: "#008fd3"
    },
    {
      num: 2,
      title: "Your Visit Today",
      subtitle: "Agenda · passport · room materials",
      accent: "#5fb832"
    },
    {
      num: 3,
      title: "Operations & Facility",
      subtitle: "Norco · qualifications · traceability",
      accent: "#f58220"
    },
    {
      num: 4,
      title: "Innovation & Formulas",
      subtitle: "Portfolio · seasonal · chlorite context",
      accent: "#008fd3"
    },
    {
      num: 5,
      title: "Sensory & Validation",
      subtitle: "Lakewood · panels · triangle protocol",
      accent: "#5fb832"
    },
    {
      num: 6,
      title: "Quality & Samples",
      subtitle: "COAs · specs · representative lots",
      accent: "#5b6b8a"
    },
    {
      num: 7,
      title: "Live Workshop Tools",
      subtitle: "Phones · tasting · scoring · QRs",
      accent: "#008fd3"
    }
  ];

  var ITEMS = [
    { n: 1, ch: 1, title: "Together We Win · partnership booklet", type: "pdf", file: "01-together-we-win-partnership.pdf", desc: "Partnership vision, four pillars, and 3–5 year growth framing." },
    { n: 2, ch: 1, title: "Executive one-pager", type: "site", href: "/onepager", desc: "Single-page summary for procurement — print from the workshop site." },
    { n: 3, ch: 1, title: "Workshop experience · live site", type: "site", href: "/workshop", desc: "Room display — pillars, concepts, agenda, and feedback." },

    { n: 4, ch: 2, title: "Morning agenda · 8:00 – 12:30", type: "site", href: "/workshop#agenda", desc: "Tour, pillars, tasting, co-creation lab, depart by 12:30." },
    { n: 5, ch: 2, title: "Visitor passport", type: "site", href: "/passport", desc: "Pocket follow-along — checklist, notes, and scoring lines." },
    { n: 6, ch: 2, title: "Facility tour map", type: "site", href: "/tour", desc: "8:00 AM walk-through — mixing, QC, production, R&D." },
    { n: 7, ch: 2, title: "Slide deck + score sheet", type: "site", href: "/slides", desc: "20 slides and paper 1–9 scoring table for the room." },

    { n: 8, ch: 3, title: "The Flavor Factory · industry brochure", type: "pdf", file: "03-flavor-factory-brochure.pdf", desc: "Company overview, capabilities, and oral-care positioning." },
    { n: 9, ch: 3, title: "Norco facility survey", type: "pdf", file: "04-norco-facility-survey.pdf", desc: "Facility documentation for Church & Dwight qualification." },
    { n: 10, ch: 3, title: "NOP certificate addendum · product list", type: "pdf", file: "12-nop-cert-addendum.pdf", desc: "Organic certification listing for procurement review." },

    { n: 11, ch: 4, title: "Professional formula portfolio", type: "pdf", file: "02-professional-formula-portfolio.pdf", desc: "24-page portfolio — reference during tasting and R&D." },
    { n: 12, ch: 4, title: "Seasonal flavors · oral care directions", type: "pdf", file: "05-seasonal-flavors-oral-care.pdf", desc: "Seasonal and limited-edition rinse directions." },
    { n: 13, ch: 4, title: "Top 8 seasonal flavor ideas", type: "pdf", file: "06-seasonal-top-8-ideas.pdf", desc: "Curated seasonal concepts for co-creation." },
    { n: 14, ch: 4, title: "Seasonal rinse formulas", type: "pdf", file: "07-seasonal-rinse-formulas.pdf", desc: "Workshop-adjacent seasonal prototype notes." },
    { n: 15, ch: 4, title: "2025 seasonal concept sheet", type: "pdf", file: "08-seasonals-2025.pdf", desc: "Latest line-extension concepts under development." },
    { n: 16, ch: 4, title: "Antiseptic rinse reference", type: "pdf", file: "14-antiseptic-rinse-reference.pdf", desc: "Chlorite rinse chemistry context." },
    { n: 17, ch: 4, title: "Chlorite flavor stability guide", type: "site", href: "/chlorite-flavor", desc: "How we build flavor inside sodium chlorite systems." },

    { n: 18, ch: 5, title: "Sensory validation framework", type: "pdf", file: "09-sensory-validation-framework.pdf", desc: "Triangle, blind, and panel protocols with brand teams." },
    { n: 19, ch: 5, title: "Lakewood sensory validation · one-pager", type: "pdf", file: "10-lakewood-sensory-validation.pdf", desc: "Site parity program summary." },
    { n: 20, ch: 5, title: "Lakewood parity plan · full proposal", type: "site", href: "/lakewood", desc: "Eight-variant transfer program and timeline." },
    { n: 21, ch: 5, title: "Triangle test form · TheraBreath", type: "pdf", file: "11-triangle-test-form.pdf", desc: "ISO 4120 form for post-visit pilots." },
    { n: 22, ch: 5, title: "Triangle test kit · print", type: "site", href: "/triangle", desc: "Full triangle protocol packet for scheduling." },
    { n: 23, ch: 5, title: "Blind comparison kit · print", type: "site", href: "/blind", desc: "Blind protocol forms for formula changes." },

    { n: 24, ch: 6, title: "Sample spec sheet · MI-18727", type: "pdf", file: "13-spec-sheet-example.pdf", desc: "Representative flavor specification format." },
    { n: 25, ch: 6, title: "Certificate of analysis · MI lot", type: "pdf", file: "coas/coa-mi.pdf", desc: "Example COA — mint ingredient lot." },
    { n: 26, ch: 6, title: "Certificate of analysis · PE lot", type: "pdf", file: "coas/coa-pe.pdf", desc: "Example COA — peppermint lot." },
    { n: 27, ch: 6, title: "Certificate of analysis · TR lot", type: "pdf", file: "coas/coa-tr.pdf", desc: "Example COA — trace ingredient lot." },
    { n: 28, ch: 6, title: "Sample documentation · MI-22008", type: "pdf", file: "samples/MI-22008-sample.pdf", desc: "Representative sample release packet." },
    { n: 29, ch: 6, title: "Sample documentation · PE-22004", type: "pdf", file: "samples/PE-22004-sample.pdf", desc: "Representative sample release packet." },
    { n: 30, ch: 6, title: "Peppermint vanilla flavor reference", type: "pdf", file: "samples/peppermint-vanilla-flavor.pdf", desc: "Flavor reference documentation." },

    { n: 31, ch: 7, title: "Flavor mystery game · /mystery", type: "site", href: "/mystery", desc: "Coded cups M1–M10 — guess blind before reveal." },
    { n: 32, ch: 7, title: "Live concept scorer · /score", type: "site", href: "/score", desc: "Rate prototypes 1–9 after names are shown." },
    { n: 33, ch: 7, title: "Tasting station signs", type: "site", href: "/stations", desc: "Three station signs with mystery and score QRs." },
    { n: 34, ch: 7, title: "Sample kit labels · M1–M10", type: "site", href: "/labels", desc: "Bottle labels before the 9:30 tasting block." },
    { n: 35, ch: 7, title: "QR print sheet · all scan codes", type: "site", href: "/qr", desc: "Postcards for workshop, booklet, mystery, score." }
  ];

  var AGENDA = [
    { time: "8:00", label: "Welcome & facility tour", note: "Passports on seats · /tour" },
    { time: "8:30", label: "Pillars 1 & 3 · Resiliency + Operations", note: "Capacity, certs, traceability" },
    { time: "9:00", label: "Pillars 2 & 4 · Innovation + Partnership", note: "Chlorite stability · charter" },
    { time: "9:30", label: "Tasting · three stations", note: "/mystery blind · then /score" },
    { time: "10:30", label: "Co-creation flavor lab", note: "Top concepts to the bench" },
    { time: "12:00", label: "Action plan · depart", note: "Sample kits · out by 12:30" }
  ];

  var HOSTS = [
    { name: "Dan Wixted", role: "Partnership & facility" },
    { name: "Ryan Wixted", role: "Quality · SQF/GMP · documentation" },
    { name: "Alex Wixted", role: "R&D · innovation · co-creation" },
    { name: "Matt Wixted", role: "Workshop facilitation · digital tools" }
  ];

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