/** Visual assets & helpers for /present slides */
window.PRES_VIS = {
  cover: "/assets/companies/tff/therabreath-production-room.jpg",
  welcome: "/assets/visit/norco-facility-exterior.jpg",
  framing: "/assets/companies/tff/oral-care.png",
  agenda: "/assets/visit/tasting-workshop-room.jpg",
  lakewood: "/assets/visit/flavor-development-lab.jpg",
  chloriteGood: "/assets/portfolio/garden-mint.jpg",
  chloriteBad: "/assets/portfolio/hibiscus-lemonade.jpg",
  tasting: "/assets/visit/therabreath-lineup.png",
  close: "/assets/companies/tff/facility.jpg",
  strategic: "/assets/companies/therabreath/oxyd8-hero.jpg",
  pillars: {
    1: {
      color: "#008fd3",
      image: "/assets/companies/tff/certifications.png",
      bg: "/assets/companies/tff/facility.jpg",
      label: "Resiliency",
    },
    2: {
      color: "#5fb832",
      image: "/assets/visit/flavor-development-lab.jpg",
      bg: "/assets/portfolio/fresh-herbal-mint.jpg",
      label: "Innovation",
    },
    3: {
      color: "#f58220",
      image: "/assets/visit/bottling-quality-line.jpg",
      bg: "/assets/companies/tff/therabreath-production-room.jpg",
      label: "Operations",
    },
    4: {
      color: "#0a1628",
      image: "/assets/visit/therabreath-lineup.png",
      bg: "/assets/companies/therabreath/complete-rinse.jpg",
      label: "Partnership",
    },
  },
  bottles: [
    "clean-mint",
    "revitalizing-mint",
    "rainforest-mint",
    "dazzling-mint",
    "tingling-mint",
    "overnight",
  ],
  agendaIcons: ["🏭", "📊", "☕", "🧪", "🍽️", "💬"],
};

window.PRES_VIS.html = {
  visualPanel: function (src, opts) {
    opts = opts || {};
    var alt = opts.alt || "";
    var cls = opts.className || "";
    return (
      '<div class="pres-visual' + (cls ? " " + cls : "") + '" aria-hidden="true">' +
      '<img src="' + src + '" alt="' + alt + '" loading="eager" decoding="async" />' +
      '<div class="pres-visual-scrim"></div>' +
      (opts.badge ? '<div class="pres-visual-badge">' + opts.badge + "</div>" : "") +
      "</div>"
    );
  },

  bottleStrip: function () {
    return (
      '<div class="pres-bottle-strip" aria-hidden="true">' +
      PRES_VIS.bottles
        .map(function (slug) {
          return (
            '<img src="/assets/bottles/' +
            slug +
            '.png" alt="" loading="eager" decoding="async" />'
          );
        })
        .join("") +
      "</div>"
    );
  },

  pillarNum: function (n, color) {
    return (
      '<div class="pres-pillar-orb" style="--orb-color:' +
      color +
      '" aria-hidden="true"><span>' +
      n +
      "</span></div>"
    );
  },

  splitOpen: function (visualHtml, contentClass) {
    return (
      '<div class="pres-slide-split">' +
      visualHtml +
      '<div class="pres-content' +
      (contentClass ? " " + contentClass : "") +
      '">'
    );
  },

  splitClose: function () {
    return "</div></div>";
  },
};
