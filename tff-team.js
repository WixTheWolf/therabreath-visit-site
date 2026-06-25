/**
 * TFF team roster — canonical titles and bios for the TheraBreath visit site.
 */
(function (global) {
  var VISIT_HOST_IDS = ["dan", "alex", "ryan", "matt"];

  var TEAM = [
    {
      id: "dan",
      name: "Dan Wixted",
      title: "President",
      desc:
        "Dan started The Flavor Factory and has spent more than 40 years in the flavor industry. He sets the standards for how projects are handled and stays close to every customer relationship. When a project is complicated, Dan is usually the first person in the room.",
      visitRole: "Partnership vision and commercial alignment"
    },
    {
      id: "alex",
      name: "Alex Wixted",
      title: "Operations",
      desc:
        "Alex keeps projects moving from first request through production. He coordinates between teams, manages project flow, and makes sure nothing falls through between the sample conversation and the production order.",
      visitRole: "Scheduling, production flow, and capacity"
    },
    {
      id: "kelly",
      name: "Kelly Ziegler",
      title: "Office Manager",
      desc:
        "Kelly is usually the first person a customer talks to. She handles communication, scheduling, and the coordination details that keep projects on track from the first email through the final order.",
      visitRole: "Customer support and documentation coordination"
    },
    {
      id: "ryan",
      name: "Ryan Wixted",
      title: "Quality and Regulatory",
      desc:
        "Ryan manages the quality systems and regulatory documentation that customers rely on for supplier qualification, allergen statements, COAs, and label support. If it involves a document or a certification, it goes through Ryan.",
      visitRole: "QC, documentation, and compliance"
    },
    {
      id: "matt",
      name: "Matt Wixted",
      title: "Production Manager",
      desc:
        "Matt bridges sample approval and production. If a sample gets approved, Matt is the one making sure the first production batch matches it. He owns the path from bench to batch.",
      visitRole: "Warehouse, compounding, shipping/receiving, and floor execution"
    }
  ];

  function byId(id) {
    for (var i = 0; i < TEAM.length; i++) {
      if (TEAM[i].id === id) return TEAM[i];
    }
    return null;
  }

  function visitHosts() {
    return TEAM.filter(function (m) {
      return VISIT_HOST_IDS.indexOf(m.id) !== -1;
    });
  }

  function hostNamesShort() {
    return "Dan, Alex, Ryan, and Matt";
  }

  function hostListComma() {
    return visitHosts().map(function (m) {
      return m.name;
    }).join(", ");
  }

  function hostListWithTitles() {
    return visitHosts().map(function (m) {
      return m.name + " (" + m.title + ")";
    }).join(" · ");
  }

  function hostContactLines() {
    return visitHosts().map(function (m) {
      return m.name + ", " + m.title;
    }).join("<br />");
  }

  function hostCardsHtml() {
    return visitHosts().map(function (m) {
      return (
        '<div class="host"><b>' +
        m.name +
        '</b><span>' +
        m.title +
        '</span><p class="host-desc">' +
        m.desc +
        "</p></div>"
      );
    }).join("");
  }

  function rosterHtml() {
    return TEAM.map(function (m) {
      return "<p><strong>" + m.name + "</strong>, " + m.title + " — " + m.desc + "</p>";
    }).join("");
  }

  global.TFFTeam = {
    members: TEAM,
    visitHostIds: VISIT_HOST_IDS,
    visitHosts: visitHosts,
    byId: byId,
    hostNamesShort: hostNamesShort,
    hostListComma: hostListComma,
    hostListWithTitles: hostListWithTitles,
    hostContactLines: hostContactLines,
    hostCardsHtml: hostCardsHtml,
    rosterHtml: rosterHtml
  };
})(typeof window !== "undefined" ? window : global);