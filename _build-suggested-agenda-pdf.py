"""
Rebuild suggested-agenda-therabreath.pdf — shareable agenda for TheraBreath guests.
Run: python _build-suggested-agenda-pdf.py
"""
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

OUT = "booklet/documents/suggested-agenda-therabreath.pdf"
TOTAL_PAGES = 4

BLUE = colors.HexColor("#008fd3")
GREEN = colors.HexColor("#5fb832")
ORANGE = colors.HexColor("#f58220")
INK = colors.HexColor("#0a1628")
MUTED = colors.HexColor("#5c6678")
LINE = colors.HexColor("#e2e9ec")
PAPER = colors.HexColor("#f8fafc")


def build_styles():
    base = getSampleStyleSheet()
    return {
        "footer": ParagraphStyle(
            "footer",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=7.5,
            textColor=MUTED,
            alignment=TA_CENTER,
            leading=10,
        ),
        "kicker": ParagraphStyle(
            "kicker",
            parent=base["Normal"],
            fontName="Helvetica-Bold",
            fontSize=8,
            textColor=BLUE,
            spaceAfter=6,
            letterSpacing=1.2,
        ),
        "title": ParagraphStyle(
            "title",
            parent=base["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=24,
            textColor=INK,
            leading=28,
            spaceAfter=8,
        ),
        "subtitle": ParagraphStyle(
            "subtitle",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=11,
            textColor=MUTED,
            leading=15,
            spaceAfter=12,
        ),
        "h2": ParagraphStyle(
            "h2",
            parent=base["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=15,
            textColor=INK,
            leading=19,
            spaceBefore=2,
            spaceAfter=8,
        ),
        "body": ParagraphStyle(
            "body",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=10,
            textColor=INK,
            leading=14,
            spaceAfter=6,
        ),
        "muted": ParagraphStyle(
            "muted",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=9,
            textColor=MUTED,
            leading=13,
            spaceAfter=5,
        ),
        "bullet": ParagraphStyle(
            "bullet",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=9.5,
            textColor=INK,
            leading=13,
            leftIndent=12,
            bulletIndent=0,
            spaceAfter=3,
        ),
        "quote": ParagraphStyle(
            "quote",
            parent=base["Normal"],
            fontName="Helvetica-Oblique",
            fontSize=9,
            textColor=MUTED,
            leading=13,
            leftIndent=10,
            rightIndent=10,
            spaceAfter=4,
        ),
        "cite": ParagraphStyle(
            "cite",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=8,
            textColor=BLUE,
            leading=11,
            leftIndent=10,
            spaceAfter=8,
        ),
    }


def header_band(styles):
    data = [[
        Paragraph('<font color="#0a1628"><b>THE FLAVOR FACTORY</b></font>', styles["muted"]),
        Paragraph('<font color="#008fd3"><b>×</b></font>', styles["muted"]),
        Paragraph('<font color="#0a1628"><b>TheraBreath</b></font>', styles["muted"]),
    ]]
    t = Table(data, colWidths=[2.2 * inch, 0.25 * inch, 2.2 * inch])
    t.setStyle(TableStyle([
        ("ALIGN", (0, 0), (-1, -1), "LEFT"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LINEBELOW", (0, 0), (-1, 0), 2, INK),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 8),
    ]))
    return t


def agenda_rows(styles):
    """Suggested schedule with topics tied to email threads."""
    rows = [
        ["Suggested time", "Session", "Topics we can cover"],
        [
            "9:00 AM",
            "Arrive · check in",
            "2058 Second Street · facility tour first · casual business attire · closed-toe shoes",
        ],
        [
            "9:00–9:25",
            "Facility tour",
            "Production, QC, TheraBreath room — single-site dev + manufacturing + quality",
        ],
        [
            "9:30–10:15",
            "TFF presentation",
            "Four pillars your team asked to see — resiliency, innovation, operations, partnership",
        ],
        [
            "10:15–10:30",
            "Break",
            "Reset before tasting",
        ],
        [
            "10:30–11:15",
            "Tasting",
            "Ten workshop prototypes · Flavor Flight Challenge · Flavor Flight results admin",
        ],
        [
            "11:30–1:00",
            "Lunch off site",
            "Your hosts take the group · back by 1:00 PM",
        ],
        [
            "1:00 PM+",
            "Open discussion & Q&A",
            "Lakewood parity · procurement · growth · chlorite innovation · your pace",
        ],
    ]
    data = []
    for i, row in enumerate(rows):
        if i == 0:
            data.append([Paragraph(f"<b>{c}</b>", styles["muted"]) for c in row])
        else:
            data.append([
                Paragraph(f'<font color="#008fd3"><b>{row[0]}</b></font>', styles["body"]),
                Paragraph(f"<b>{row[1]}</b>", styles["body"]),
                Paragraph(row[2], styles["muted"]),
            ])
    t = Table(data, colWidths=[1.35 * inch, 1.55 * inch, 3.4 * inch])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), PAPER),
        ("BOX", (0, 0), (-1, -1), 0.75, LINE),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, LINE),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    return t


def email_topics_block(styles):
    """Questions and statements from Ross / Nelly email threads."""
    sections = [
        (
            "Lakewood site parity · Ross Conroy · Jun 2026",
            [
                '"What validation plan do you propose for Lakewood mouthrinse production?"',
                "How to know if there is or is not a taste difference between sites (triangle test, ISO 4120)",
                "If there is a difference — how to characterize it (blind paired profiling, flavor fingerprint)",
                "Consumer validation methods for Tier-A SKUs (Icy Mint, Dazzling Mint, Sparkle Mint)",
                "Support for eight variants on trial timeline (Icy/Mild/Rainforest → Sparkle mid-Sep)",
                "Panel location, reference site per SKU, and sensory parity sign-off workflow",
            ],
        ),
        (
            "Competitive calibration · Ross & Nelly · Feb–Mar 2026",
            [
                '"This is being seen as a competitive threat… directed towards our core FRESH BREATH — MILD MINT variant" (Ross, Feb 6)',
                "Listerine Extra Mild tier evaluation across Cool Mint, Freshburst, Total Care",
                "Nelly asked for business-owner framing and TFF's holistic oral-care lexicon",
                "GA-22131 garlic functional — efficacy POV, chlorite stability, familiar pleasant odors",
                "Open items: allicin/DADS references and chlorite stability read on functional directions",
            ],
        ),
        (
            "Capabilities & partnership · ongoing threads",
            [
                "Four pillars your team asked to see — not a sales pitch, a working review",
                "Virtual procurement session before the visit (topics TBD with your team)",
                "Scalability if TheraBreath volume doubles or triples — honest capacity conversation",
                "Sensory science support beyond Lakewood — triangle, blind, expert screening, CLT/HUT",
                "Sodium chlorite flavor architecture — stability, vanilla directions, mint layering",
            ],
        ),
    ]
    story = []
    for title, bullets in sections:
        story.append(Paragraph(title, styles["h2"]))
        for b in bullets:
            story.append(Paragraph(f"• {b}", styles["bullet"]))
        story.append(Spacer(1, 0.08 * inch))
    return story


def page_footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(LINE)
    canvas.setLineWidth(0.5)
    canvas.line(0.75 * inch, 0.65 * inch, letter[0] - 0.75 * inch, 0.65 * inch)
    canvas.setFont("Helvetica", 7.5)
    canvas.setFillColor(MUTED)
    canvas.drawCentredString(
        letter[0] / 2,
        0.45 * inch,
        f"Suggested agenda · Church & Dwight / TheraBreath · July 8, 2026 · {canvas.getPageNumber()} of {TOTAL_PAGES}",
    )
    canvas.restoreState()


def build():
    styles = build_styles()
    doc = SimpleDocTemplate(
        OUT,
        pagesize=letter,
        leftMargin=0.75 * inch,
        rightMargin=0.75 * inch,
        topMargin=0.7 * inch,
        bottomMargin=0.85 * inch,
        title="Suggested Agenda · TFF × TheraBreath · July 8, 2026",
        author="The Flavor Factory",
    )
    story = []

    # Page 1 — cover + why visiting
    story.append(header_band(styles))
    story.append(Spacer(1, 0.45 * inch))
    story.append(Paragraph("Suggested Agenda", styles["title"]))
    story.append(Paragraph(
        "Breath of Innovation · Tuesday, July 8, 2026 · Norco, California",
        styles["subtitle"],
    ))
    story.append(Paragraph(
        "<i>All times below are suggested.</i> We will adjust in the room to match your team's pace and priorities.",
        styles["muted"],
    ))
    story.append(Spacer(1, 0.2 * inch))

    story.append(Paragraph("WHY YOU'RE VISITING", styles["kicker"]))
    story.append(Paragraph("What this day is — and isn't", styles["h2"]))
    story.append(Paragraph(
        "Your R&amp;D and procurement colleagues asked for a <b>capabilities review and working session</b> "
        "at our Norco facility — not a sales presentation. You will see how we develop, manufacture, "
        "and support the flavors behind TheraBreath's growth, with the same team from first sample to repeat order.",
        styles["body"],
    ))
    reasons = [
        "<b>Four pillars</b> — resiliency, innovation, operations, and partnership (your team's ask)",
        "<b>Norco facility</b> — real walkthrough of production, QC, and TheraBreath-dedicated areas",
        "<b>Lakewood site parity</b> — sensory validation plan for mouthrinse production as you scale",
        "<b>Directional tasting</b> — ten workshop prototypes; honest feedback via blind mapping and scorecard",
        "<b>Partnership alignment</b> — growth scenarios, procurement qualification, long-term supplier fit",
        "<b>Oral-care innovation</b> — sodium chlorite flavor work, competitive calibration, functional directions",
    ]
    for r in reasons:
        story.append(Paragraph(f"• {r}", styles["bullet"]))

    story.append(Spacer(1, 0.15 * inch))
    story.append(Paragraph(
        "<b>Suggested arrival: 9:00 AM</b><br/>"
        "2058 Second Street, Norco, CA 92860 — facility tour first<br/>"
        "9:30 AM — presentation in conference room across from The Flavor Factory",
        styles["body"],
    ))

    # Page 2 — suggested schedule
    story.append(PageBreak())
    story.append(header_band(styles))
    story.append(Spacer(1, 0.2 * inch))
    story.append(Paragraph("SUGGESTED SCHEDULE", styles["kicker"]))
    story.append(Paragraph("Your day in Norco", styles["h2"]))
    story.append(agenda_rows(styles))
    story.append(Spacer(1, 0.12 * inch))

    story.append(Paragraph("PRESENTATION BLOCK · 9:30–10:15", styles["kicker"]))
    story.append(Paragraph("Four pillars — topics from your email threads", styles["h2"]))
    pillars = [
        ("Resiliency", "Capacity and continuity as volumes grow · redundancy if a supplier or equipment fails · certifications (SQF, GMP, FDA-registered facility)"),
        ("Innovation", "Sodium chlorite flavor architecture · chlorite-stable prototypes · GA-22131 garlic functional thread · competitive intensity-tier read"),
        ("Operations", "Single-site traceability from sample through production · quality systems · supplier qualification documentation"),
        ("Partnership", "Communication cadence · investment alignment · embedded support for Lakewood and future site transfers"),
    ]
    for title, desc in pillars:
        story.append(Paragraph(f"<b>{title}</b> — {desc}", styles["bullet"]))

    story.append(Spacer(1, 0.1 * inch))
    story.append(Paragraph("TASTING · 10:30–11:15", styles["kicker"]))
    story.append(Paragraph(
        "Five blind samples labeled Sample A through Sample E. Guests use the "
        "<b>Flavor Flight Challenge</b> to rate each sample and rank their top three; the team reviews "
        "<b>Flavor Flight Results Admin</b> after responses are submitted. "
        "Directional feedback only — not a final product decision.",
        styles["body"],
    ))

    # Page 3 — email subjects & questions
    story.append(PageBreak())
    story.append(header_band(styles))
    story.append(Spacer(1, 0.2 * inch))
    story.append(Paragraph("FROM YOUR EMAILS", styles["kicker"]))
    story.append(Paragraph("Subjects, questions, and statements we can address July 8", styles["h2"]))
    story.append(Paragraph(
        "These themes come from conversations with Ross Conroy (Sr. Fragrance &amp; Flavor Development) "
        "and Neonila Levitsky (Sr. Manager, Fragrance, Flavor Design &amp; Innovation). "
        "We grouped them by topic — bring anything else that matters to your team.",
        styles["muted"],
    ))
    story.extend(email_topics_block(styles))

    # Page 4 — before visit + contact
    story.append(PageBreak())
    story.append(header_band(styles))
    story.append(Spacer(1, 0.2 * inch))
    story.append(Paragraph("BEFORE JULY 8", styles["kicker"]))
    story.append(Paragraph("Questions welcome anytime", styles["h2"]))
    story.append(Paragraph(
        "If anything comes up before the visit — logistics, dietary needs, topics to prioritize, "
        "or questions about Lakewood validation — reach out to <b>The Flavor Factory team</b>. "
        "We will get you answers before July 8.",
        styles["body"],
    ))
    story.append(Spacer(1, 0.08 * inch))

    contact = Table([[
        Paragraph(
            "<b>The Flavor Factory</b><br/>"
            "2058 Second Street · Norco, CA 92860<br/>"
            "(951) 273-9877 · flavorfactory.net<br/><br/>"
            "Online visit guide:<br/>"
            "therabreath-visit-site.vercel.app",
            styles["body"],
        )
    ]], colWidths=[6.5 * inch])
    contact.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), PAPER),
        ("BOX", (0, 0), (-1, -1), 0.75, LINE),
        ("LEFTPADDING", (0, 0), (-1, -1), 14),
        ("RIGHTPADDING", (0, 0), (-1, -1), 14),
        ("TOPPADDING", (0, 0), (-1, -1), 12),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 12),
        ("LINEBELOW", (0, 0), (0, 0), 3, BLUE),
    ]))
    story.append(contact)

    story.append(Spacer(1, 0.2 * inch))
    story.append(Paragraph("HELPFUL TO KNOW", styles["kicker"]))
    story.append(Paragraph("Come prepared", styles["h2"]))
    prep = [
        "Casual business attire · closed-toe shoes for the production walkthrough",
        "Phone charged — Wi‑Fi on site for tasting tools at 10:30 AM",
        "Questions ready — technical, operational, and partnership topics welcome throughout",
        "No pre-reading required — this PDF and our visit site have what you need",
    ]
    for p in prep:
        story.append(Paragraph(f"• {p}", styles["bullet"]))

    story.append(Spacer(1, 0.15 * inch))
    story.append(Paragraph("WHAT YOU'LL LEAVE WITH", styles["kicker"]))
    story.append(Paragraph("After the visit", styles["h2"]))
    leave = [
        "A clear view of our facility, team, and how we work",
        "Documented answers on the four capability areas your team asked about",
        "A sensory summary from your scorecard submissions",
        "Follow-up email within 24 hours with next steps and named owners",
        "Lakewood parity reports per variant as trials complete through September",
    ]
    for item in leave:
        story.append(Paragraph(f"• {item}", styles["bullet"]))

    story.append(Spacer(1, 0.25 * inch))
    close = Table([[
        Paragraph(
            "<font color='#ffffff'><b>Breath of Innovation</b><br/>"
            "Capabilities first · Tasting second · Partnership outcome third<br/>"
            "<i>Suggested agenda — times may adjust in the room.</i></font>",
            styles["body"],
        )
    ]], colWidths=[6.5 * inch])
    close.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), INK),
        ("LEFTPADDING", (0, 0), (-1, -1), 16),
        ("RIGHTPADDING", (0, 0), (-1, -1), 16),
        ("TOPPADDING", (0, 0), (-1, -1), 14),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 14),
    ]))
    story.append(close)

    doc.build(story, onFirstPage=page_footer, onLaterPages=page_footer)
    print("Wrote", OUT)


if __name__ == "__main__":
    build()
