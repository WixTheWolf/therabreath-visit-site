/** Presentation graphics — inline SVG + image maps (no runtime network for icons) */
window.PRES_GFX = {
  bubbles:
    '<svg class="pres-gfx-bubbles" viewBox="0 0 120 80" width="120" height="80" aria-hidden="true">' +
    '<circle cx="28" cy="52" r="9" fill="#d32f2f" opacity="0.9"/>' +
    '<circle cx="36" cy="38" r="9" fill="#43a047" opacity="0.9"/>' +
    '<circle cx="28" cy="24" r="9" fill="#fbc02d" opacity="0.9"/>' +
    '<circle cx="36" cy="10" r="9" fill="#f57c00" opacity="0.9"/>' +
    '<circle cx="44" cy="22" r="9" fill="#8e24aa" opacity="0.9"/>' +
    "</svg>",

  wave:
    '<svg class="pres-gfx-wave" viewBox="0 0 1440 48" preserveAspectRatio="none" aria-hidden="true">' +
    '<path d="M0,28 C240,8 480,44 720,24 C960,4 1200,40 1440,20 L1440,48 L0,48 Z" fill="currentColor"/>' +
    "</svg>",

  /** Minimal line icons for schedule & feature blocks */
  svg: {
    tour:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">' +
      '<path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6"/></svg>',
    present:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">' +
      '<rect x="3" y="4" width="18" height="14" rx="2"/><path d="M7 20h10M12 18v2"/></svg>',
    break:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">' +
      '<path d="M6 8h12v8a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4V8z"/><path d="M6 8V6a2 2 0 0 1 2-2h1M18 8V6a2 2 0 0 0-2-2h-1"/></svg>',
    taste:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">' +
      '<path d="M9 3v8l-4 9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2l-4-9V3"/><path d="M9 3h6"/></svg>',
    lunch:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">' +
      '<path d="M4 11h16M4 11a2 2 0 0 1 2-2h1v9a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-7M20 11V7a2 2 0 0 0-2-2h-1v11"/></svg>',
    qa:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">' +
      '<path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/></svg>',
    chat:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">' +
      '<path d="M8 10h8M8 14h5"/><path d="M21 12a8 8 0 0 1-8 8H6l-4 3V6a8 8 0 0 1 8-8h5a8 8 0 0 1 8 8z"/></svg>',
    pillars:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">' +
      '<rect x="3" y="8" width="4" height="13"/><rect x="10" y="4" width="4" height="17"/><rect x="17" y="10" width="4" height="11"/></svg>',
    calendar:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">' +
      '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/></svg>',
    mail:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">' +
      '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
    shield:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">' +
      '<path d="M12 3l8 3v6c0 5-3.5 9-8 9s-8-4-8-9V6l8-3z"/></svg>',
    bulb:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">' +
      '<path d="M9 18h6M10 22h4"/><path d="M12 2a7 7 0 0 1 4 12.7V17H8v-2.3A7 7 0 0 1 12 2z"/></svg>',
    gear:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">' +
      '<circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    handshake:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">' +
      '<path d="M4 12l4 4 4-6 4 6 4-4"/></svg>',
  },

  icon: function (name) {
    var svg = (PRES_GFX.svg && PRES_GFX.svg[name]) || PRES_GFX.svg.qa;
    return '<span class="pres-icon" aria-hidden="true">' + svg + "</span>";
  },

  pillars: {
    1: {
      image: "/assets/companies/tff/facility.jpg",
      bg: "/assets/companies/tff/therabreath-production-room.jpg",
      icon: "shield",
    },
    2: {
      image: "/assets/visit/flavor-development-lab.jpg",
      bg: "/assets/portfolio/fresh-herbal-mint.jpg",
      icon: "bulb",
    },
    3: {
      image: "/assets/visit/bottling-quality-line.jpg",
      bg: "/assets/companies/tff/therabreath-production-room.jpg",
      icon: "gear",
    },
    4: {
      image: "/assets/companies/therabreath/complete-rinse.jpg",
      bg: "/assets/visit/therabreath-lineup.png",
      icon: "handshake",
    },
  },

  /** Per-question band photos — adds variety across 26 Q&A slides */
  qaBands: {
    1: "/assets/companies/tff/facility.jpg",
    2: "/assets/visit/bottling-quality-line.jpg",
    3: "/assets/companies/tff/therabreath-production-room.jpg",
    4: "/assets/visit/norco-facility-exterior.jpg",
    5: "/assets/companies/tff/facility.jpg",
    6: "/assets/portfolio/fresh-herbal-mint.jpg",
    7: "/assets/portfolio/garden-mint.jpg",
    8: "/assets/visit/flavor-development-lab.jpg",
    9: "/assets/visit/tasting-workshop-room.jpg",
    10: "/assets/portfolio/fresh-herbal-mint.jpg",
    11: "/assets/visit/bottling-quality-line.jpg",
    12: "/assets/companies/tff/therabreath-production-room.jpg",
    13: "/assets/visit/norco-facility-exterior.jpg",
    14: "/assets/companies/therabreath/complete-rinse.jpg",
    15: "/assets/visit/therabreath-lineup.png",
    16: "/assets/companies/tff/facility.jpg",
  },

  strategicBands: [
    "/assets/companies/therabreath/oxyd8-hero.jpg",
    "/assets/companies/therabreath/complete-rinse.jpg",
    "/assets/visit/therabreath-lineup.png",
    "/assets/portfolio/garden-mint.jpg",
  ],

  images: [
    "/assets/companies/tff/therabreath-production-room.jpg",
    "/assets/visit/norco-facility-exterior.jpg",
    "/assets/companies/tff/oral-care.png",
    "/assets/visit/tasting-workshop-room.jpg",
    "/assets/companies/tff/facility.jpg",
    "/assets/visit/flavor-development-lab.jpg",
    "/assets/visit/bottling-quality-line.jpg",
    "/assets/visit/therabreath-lineup.png",
    "/assets/portfolio/hibiscus-lemonade.jpg",
    "/assets/portfolio/garden-mint.jpg",
    "/assets/portfolio/fresh-herbal-mint.jpg",
    "/assets/companies/tff/certifications.png",
    "/assets/companies/therabreath/oxyd8-hero.jpg",
    "/assets/companies/therabreath/complete-rinse.jpg",
    "/assets/bottles/clean-mint.png",
    "/assets/bottles/revitalizing-mint.png",
    "/assets/bottles/rainforest-mint.png",
    "/assets/bottles/dazzling-mint.png",
    "/assets/bottles/tingling-mint.png",
    "/assets/bottles/overnight.png",
  ],
};
