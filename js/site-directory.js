/** Canonical site map — topic clusters for /find and /toolkit */
window.SiteDirectory = {
  clusters: [
    {
      id: "july8",
      title: "July 8 · Schedule & day-of",
      desc: "Arrival, tour, lunch, Q&A — guest-facing visit flow",
      accent: "#008fd3",
      items: [
        { href: "/", title: "Visit home", desc: "July 8 landing · schedule · quick links", path: "/", keywords: "agenda index home arrival" },
        { href: "/visit", title: "Breath of Innovation hub", desc: "Day-of timeline · pillars · deep dives", path: "/visit", keywords: "schedule your day boi" },
        { href: "/brief", title: "Pre-visit brief", desc: "What to expect · how to prepare", path: "/brief", keywords: "prepare before arrive" },
        { href: "/tour", title: "Facility tour map", desc: "9:00 AM walk-through · 2058 Second Street", path: "/tour", keywords: "tour production qc", internal: true },
        { href: "/passport", title: "Visitor passport", desc: "Pocket follow-along for guests", path: "/passport", keywords: "passport handout print" },
        { href: "/booklet/documents/suggested-agenda-therabreath.docx", title: "Suggested agenda (Word)", desc: "Bullet schedule for calendar invites", path: "docx", keywords: "agenda word download", external: true }
      ]
    },
    {
      id: "presentation",
      title: "Presentation & pillars",
      desc: "Live slides, print deck, speaker notes",
      accent: "#006da3",
      items: [
        { href: "/present", title: "Live presentation", desc: "9:30 AM · four pillars · Top 10 Q&A · reveal points", path: "/present", keywords: "slides projector qa pillars", hot: true },
        { href: "/slides", title: "Print slide deck", desc: "20-slide room backup + scoring sheet", path: "/slides", keywords: "print paper deck" },
        { href: "/workshop", title: "Full workshop page", desc: "Long-form capabilities overview", path: "/workshop", keywords: "workshop experience" },
        { href: "/packet", title: "Speaker packet", desc: "Full talk tracks · TFF presenters only", path: "/packet", keywords: "speaker script password", internal: true }
      ]
    },
    {
      id: "tasting",
      title: "Tasting · 10:30 AM",
      desc: "Blind mapping, scorecard, stations, live admin",
      accent: "#f58220",
      items: [
        { href: "/taste", title: "Tasting hub", desc: "Gateway to mapping + scorecard", path: "/taste", keywords: "tasting 1030 sensory" },
        { href: "/mystery", title: "Blind Flavor Mapping", desc: "Match coded cups M1–M5 before reveal", path: "/mystery", keywords: "blind mystery mapping m1 m2 m3 m4 m5", hot: true },
        { href: "/score", title: "Prototype scorecard", desc: "Rate prototypes after host reveal", path: "/score", keywords: "score scorecard rating", hot: true },
        { href: "/concepts", title: "Five mint platforms", desc: "M1–M5 architecture · post-reveal reference", path: "/concepts", keywords: "concepts m1 m5 mint platforms" },
        { href: "/stations", title: "Tasting station signs", desc: "Three station tent cards for the room", path: "/stations", keywords: "stations signs print room" },
        { href: "/labels", title: "Sample kit labels", desc: "Cup codes M1–M5 stickers", path: "/labels", keywords: "labels stickers samples M1 M5", internal: true },
        { href: "/worksheet", title: "Co-creation worksheet", desc: "Lab block form for iterations", path: "/worksheet", keywords: "worksheet co-creation bench", internal: true },
        { href: "/mystery-live", title: "Blind Mapping live", desc: "See guest matches · export CSV", path: "/mystery-live", keywords: "live admin mystery realtime", internal: true, hot: true },
        { href: "/score-live", title: "Live sensory summary", desc: "Room aggregate + per-rater detail", path: "/score-live", keywords: "live admin score aggregate", internal: true, hot: true }
      ]
    },
    {
      id: "lakewood",
      title: "Lakewood site parity",
      desc: "Validation ladder, triangle + blind kits, tracking",
      accent: "#5fb832",
      items: [
        { href: "/lakewood", title: "Parity proposal", desc: "Eight-variant validation ladder for Ross", path: "/lakewood", keywords: "lakewood site parity validation ross", hot: true },
        { href: "/triangle", title: "Triangle test kit", desc: "ISO 4120 · ballots · tally · calculator", path: "/triangle", keywords: "triangle iso 4120 sensory test" },
        { href: "/blind", title: "Blind comparison kit", desc: "Duo-trio escalation when triangle flags", path: "/blind", keywords: "blind duo trio paired comparison" },
        { href: "/lakewood-tracker", title: "Variant tracker", desc: "8 SKUs · steps · pass/flag notes", path: "/lakewood-tracker", keywords: "tracker variants sku status", internal: true },
        { href: "/lakewood-reply", title: "Reply to Ross", desc: "Copy-ready Lakewood alignment email", path: "/lakewood-reply", keywords: "email reply ross alignment", internal: true }
      ]
    },
    {
      id: "flavors",
      title: "Flavor portfolio & R&D",
      desc: "53 flavors, chlorite science, competitive intel",
      accent: "#0d9488",
      items: [
        { href: "/portfolio", title: "Flavor portfolio", desc: "Production SKUs · concepts · pipeline M1–M5 · Gen Alpha", path: "/portfolio", keywords: "flavors portfolio gallery skus mint", hot: true },
        { href: "/chlorite-flavor", title: "Chlorite flavor science", desc: "OXYD-8 stability · compound classes · workshop strategy", path: "/chlorite-flavor", keywords: "chlorite oxyd8 sodium stability formulation" },
        { href: "/intensity-tiers", title: "Listerine + GA-22131", desc: "Competitive intensity · garlic functional archive", path: "/intensity-tiers", keywords: "listerine garlic ga-22131 competitive mild", internal: true }
      ]
    },
    {
      id: "company",
      title: "Company & brand",
      desc: "TFF capabilities, TheraBreath brand, partnership context",
      accent: "#5b6b8a",
      items: [
        { href: "/companies", title: "Company hub", desc: "TFF + TheraBreath profiles side by side", path: "/companies", keywords: "companies partnership profiles" },
        { href: "/flavor-factory", title: "The Flavor Factory", desc: "Norco capabilities · certifications", path: "/flavor-factory", keywords: "tff flavor factory norco supplier" },
        { href: "/therabreath-brand", title: "TheraBreath brand hub", desc: "OXYD-8 · categories · bottle lineup", path: "/therabreath-brand", keywords: "therabreath brand products oxyd8" },
        { href: "/booklet", title: "Welcome booklet", desc: "Numbered PDF index · partnership · COAs", path: "/booklet", keywords: "booklet welcome binder pdf documents" },
        { href: "/onepager", title: "Executive one-pager", desc: "Procurement leave-behind summary", path: "/onepager", keywords: "onepager executive procurement summary" },
        { href: "/partnership", title: "Partnership brief", desc: "Relationship · portfolio · qualification threads", path: "/partnership", keywords: "partnership church dwight cd", internal: true },
        { href: "/therabreath", title: "TheraBreath file index", desc: "Flavor codes · qualification map", path: "/therabreath", keywords: "customer file codes qualification", internal: true }
      ]
    },
    {
      id: "print",
      title: "Print & room materials",
      desc: "Handouts, QR sheet, signs before July 8",
      accent: "#7c3aed",
      items: [
        { href: "/qr", title: "QR code print sheet", desc: "Hub · mapping · scorecard · passport links", path: "/qr", keywords: "qr print codes room display" },
        { href: "/passport", title: "Visitor passport", desc: "Folded pocket follow-along", path: "/passport", keywords: "passport print guest" },
        { href: "/stations", title: "Station signs", desc: "Three tasting station tent cards", path: "/stations", keywords: "stations print signs" },
        { href: "/slides", title: "Slide deck printout", desc: "20 slides + scoring sheet", path: "/slides", keywords: "slides print deck" },
        { href: "/onepager", title: "Executive one-pager", desc: "Single-page procurement summary", path: "/onepager", keywords: "onepager print leave-behind" }
      ]
    },
    {
      id: "team-prep",
      title: "TFF team · Prep & talk tracks",
      desc: "Answers, questions, kickoff, follow-up",
      accent: "#0a1628",
      items: [
        { href: "/toolkit", title: "Command center", desc: "Internal hub · search · live status", path: "/toolkit", keywords: "toolkit command center internal", internal: true, hot: true },
        { href: "/answers", title: "Prepared answers", desc: "Searchable talk tracks by pillar · Lakewood · logistics", path: "/answers", keywords: "answers talk tracks qa responses capacity chlorite", internal: true, hot: true },
        { href: "/questions", title: "Questions checklist", desc: "What to ask TheraBreath · check off as you go", path: "/questions", keywords: "questions ask checklist procurement", internal: true },
        { href: "/kickoff", title: "July 8 prep call", desc: "Screen-share links for Ross + Nelly call", path: "/kickoff", keywords: "kickoff prep call ross nelly", internal: true },
        { href: "/followup", title: "24h follow-up email", desc: "Thank-you template · copy-ready", path: "/followup", keywords: "followup email thank you", internal: true },
        { href: "/hospitality", title: "Hospitality guide", desc: "Banners · gift baskets · catering cues", path: "/hospitality", keywords: "hospitality swag catering baskets", internal: true }
      ]
    },
    {
      id: "team-run",
      title: "TFF team · Run July 8",
      desc: "Run-of-show, pocket cheat sheet, tour",
      accent: "#c45c26",
      items: [
        { href: "/host", title: "Full run-of-show", desc: "Minute-by-minute · expandable blocks", path: "/host", keywords: "host run of show ros timing", internal: true, hot: true },
        { href: "/pocket", title: "Pocket ROS", desc: "Foldable one-page cheat sheet for Dan", path: "/pocket", keywords: "pocket cheat sheet print fold", internal: true },
        { href: "/tour", title: "Facility tour map", desc: "9:00 AM route and talking points", path: "/tour", keywords: "tour map facility 900", internal: true },
        { href: "/gate", title: "Team sign-in", desc: "Password gate to internal tools", path: "/gate", keywords: "gate login team password", internal: true }
      ]
    }
  ]
};