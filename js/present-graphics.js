/** Inline SVG graphics — always render, no network dependency */
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
    '<path d="M0,24 C360,48 720,0 1080,24 C1260,36 1380,40 1440,24 L1440,48 L0,48 Z" fill="currentColor" opacity="0.12"/>' +
    "</svg>",

  icons: {
    tour: "🏭",
    present: "📊",
    break: "☕",
    taste: "🧪",
    lunch: "🍽",
    qa: "💬",
    resiliency: "🛡",
    innovation: "💡",
    operations: "⚙",
    partnership: "🤝",
  },

  pillars: {
    1: { image: "/assets/companies/tff/facility.jpg", bg: "/assets/companies/tff/certifications.png" },
    2: { image: "/assets/visit/flavor-development-lab.jpg", bg: "/assets/portfolio/fresh-herbal-mint.jpg" },
    3: { image: "/assets/visit/bottling-quality-line.jpg", bg: "/assets/companies/tff/therabreath-production-room.jpg" },
    4: { image: "/assets/visit/therabreath-lineup.png", bg: "/assets/companies/therabreath/complete-rinse.jpg" },
  },

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
    "/assets/bottles/clean-mint.png",
    "/assets/bottles/revitalizing-mint.png",
    "/assets/bottles/rainforest-mint.png",
    "/assets/bottles/dazzling-mint.png",
    "/assets/bottles/tingling-mint.png",
    "/assets/bottles/overnight.png",
  ],
};
