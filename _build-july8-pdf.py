"""
Rebuild july-8-briefing.pdf — self-contained briefing for TheraBreath email attach.
Matches /july8 page content: agenda, discussion, questions, outcomes for both teams.
Run: python3 _build-july8-pdf.py
"""
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import PageBreak, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

OUT = "booklet/documents/july-8-briefing.pdf"
TOTAL_PAGES = 6

BLUE = colors.HexColor("#008fd3")
INK = colors.HexColor("#0a1628")
MUTED = colors.HexColor("#5c6678")
LINE = colors.HexColor("#e2e9ec")
PAPER = colors.HexColor("#f8fafc")
PURPLE = colors.HexColor("#6c5ce7")

STRATEGIC_QUESTIONS = [
    ("What does success look like for TheraBreath in 3–5 years?",
     "Helps us align investments and capabilities with the brand's future direction."),
    ("What are your biggest growth challenges?",
     "Identifies obstacles where TFF can provide support or solutions."),
    ("What separates your best suppliers from everyone else?",
     "Provides a roadmap for becoming a stronger strategic partner."),
    ("How can suppliers better support your resiliency goals?",
     "Reveals expectations around continuity planning and supply security."),
    ("What innovation opportunities excite you most?",
     "Focuses future development on the highest-value opportunities."),
    ("What oral care trends are currently underappreciated?",
     "Helps uncover emerging opportunities before competitors."),
    ("What sensory attributes matter most to consumers today?",
     "Guides flavor development and product experience decisions."),
    ("What could The Flavor Factory do to become an even stronger partner?",
     "Creates an opportunity for honest feedback and improvement."),
    ("How would you like sensory validation data presented?",
     "Ensures testing efforts provide useful, actionable information."),
    ("After today's visit, what would make you most confident in our ability to support future growth?",
     "Reveals remaining concerns and what matters most going forward."),
]

DISCUSSION_TOPICS = [
    ("Lakewood site parity", "Ross Conroy · Jun 2026", [
        "Validation plan for Lakewood mouthrinse production",
        "How to know if taste differs between sites — triangle test (ISO 4120)",
        "If there is a difference — blind paired profiling, flavor fingerprint",
        "Consumer validation for Tier-A SKUs (Icy Mint, Dazzling Mint, Sparkle Mint)",
        "Support for eight variants on trial timeline (Icy/Mild/Rainforest → Sparkle mid-Sep)",
        "Panel location, reference site per SKU, and sensory parity sign-off workflow",
    ]),
    ("Competitive calibration", "Ross & Nelly · Feb–Mar 2026", [
        "Listerine Extra Mild tier evaluation across Cool Mint, Freshburst, Total Care",
        "Business-owner framing and TFF's holistic oral-care lexicon",
        "GA-22131 garlic functional — efficacy POV, chlorite stability, familiar pleasant odors",
        "Open items: allicin/DADS references and chlorite stability read on functional directions",
    ]),
    ("Capabilities & partnership", "Ongoing threads", [
        "Four pillars your team asked to see — working review, not a sales pitch",
        "Scalability if TheraBreath volume doubles or triples — honest capacity conversation",
        "Sensory science support beyond Lakewood — triangle, blind, expert screening, CLT/HUT",
        "Sodium chlorite flavor architecture — stability, vanilla directions, mint layering",
    ]),
]

OUTCOMES_TB = [
    "A clear, firsthand view of our facility, team, and how we operate day to day",
    "Documented answers on resiliency, innovation, operations, and partnership",
    "Directional sensory feedback on five workshop mint prototypes (M1–M5)",
    "Alignment on Lakewood parity path, panel design, and timeline through September",
    "Confidence (or clarity on gaps) about TFF as a long-term partner as volumes grow",
    "Follow-up email within 24 hours with next steps, named owners, and open items",
]

OUTCOMES_TFF = [
    "Your team's view of success for TheraBreath in 3–5 years and where flavor partners add value",
    "Honest feedback on what separates your best suppliers — so we know what great looks like",
    "Clarity on resiliency expectations, growth scenarios, and how you want sensory data presented",
    "Prioritized innovation directions — competitive calibration, chlorite work, seasonal, adjacencies",
    "Agreement on Lakewood validation steps, reference sites, and sign-off workflow per variant",
    "Named next steps and owners on both sides before everyone leaves Norco",
]


def build_styles():
    base = getSampleStyleSheet()
    return {
        "kicker": ParagraphStyle(
            "kicker", parent=base["Normal"], fontName="Helvetica-Bold",
            fontSize=8, textColor=BLUE, spaceAfter=6, letterSpacing=1.0,
        ),
        "title": ParagraphStyle(
            "title", parent=base["Heading1"], fontName="Helvetica-Bold",
            fontSize=22, textColor=INK, leading=26, spaceAfter=8,
        ),
        "subtitle": ParagraphStyle(
            "subtitle", parent=base["Normal"], fontName="Helvetica",
            fontSize=10.5, textColor=MUTED, leading=14, spaceAfter=10,
        ),
        "h2": ParagraphStyle(
            "h2", parent=base["Heading2"], fontName="Helvetica-Bold",
            fontSize=13, textColor=INK, leading=17, spaceAfter=6,
        ),
        "h3": ParagraphStyle(
            "h3", parent=base["Heading3"], fontName="Helvetica-Bold",
            fontSize=10.5, textColor=INK, leading=14, spaceAfter=4,
        ),
        "body": ParagraphStyle(
            "body", parent=base["Normal"], fontName="Helvetica",
            fontSize=9.5, textColor=INK, leading=13, spaceAfter=5,
        ),
        "muted": ParagraphStyle(
            "muted", parent=base["Normal"], fontName="Helvetica",
            fontSize=8.5, textColor=MUTED, leading=12, spaceAfter=4,
        ),
        "bullet": ParagraphStyle(
            "bullet", parent=base["Normal"], fontName="Helvetica",
            fontSize=9, textColor=INK, leading=12, leftIndent=12, spaceAfter=2,
        ),
        "qtext": ParagraphStyle(
            "qtext", parent=base["Normal"], fontName="Helvetica-Bold",
            fontSize=9, textColor=INK, leading=12, spaceAfter=1,
        ),
        "qwhy": ParagraphStyle(
            "qwhy", parent=base["Normal"], fontName="Helvetica",
            fontSize=8, textColor=MUTED, leading=11, spaceAfter=6,
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


def agenda_table(styles):
    rows = [
        ["Time", "Session", "What we'll do"],
        ["9:00 AM", "Arrive · check in", "2058 Second Street · name badges · safety briefing"],
        ["9:00–9:25", "Facility tour", "Production, QC, dedicated TheraBreath room — dev + mfg + quality under one roof"],
        ["9:30–10:15", "TFF presentation", "Four pillars — resiliency, innovation, operations, partnership"],
        ["10:15–10:30", "Break", "Reset before tasting"],
        ["10:30–11:15", "Tasting", "Five prototypes (M1–M5) · blind mapping · scorecard · directional feedback only"],
        ["11:30–1:00", "Lunch off site", "Hosts take the group · back by 1:00 PM"],
        ["1:00+", "Open discussion", "Lakewood · procurement · growth · chlorite · your pace"],
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
    t = Table(data, colWidths=[1.05 * inch, 1.35 * inch, 3.85 * inch])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), PAPER),
        ("BOX", (0, 0), (-1, -1), 0.75, LINE),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, LINE),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]))
    return t


def bullets(styles, items):
    return [Paragraph(f"• {item}", styles["bullet"]) for item in items]


def questions_block(styles, start, end):
    story = []
    for i, (question, why) in enumerate(STRATEGIC_QUESTIONS[start:end], start=start + 1):
        story.append(Paragraph(f'<font color="#6c5ce7"><b>{i}.</b></font> {question}', styles["qtext"]))
        story.append(Paragraph(why, styles["qwhy"]))
    return story


def topic_block(styles, title, meta, points):
    story = [
        Paragraph(title, styles["h3"]),
        Paragraph(meta, styles["muted"]),
    ]
    story.extend(bullets(styles, points))
    story.append(Spacer(1, 0.08 * inch))
    return story


def page_footer(canvas, _doc):
    canvas.saveState()
    canvas.setStrokeColor(LINE)
    canvas.setLineWidth(0.5)
    canvas.line(0.75 * inch, 0.65 * inch, letter[0] - 0.75 * inch, 0.65 * inch)
    canvas.setFont("Helvetica", 7.5)
    canvas.setFillColor(MUTED)
    canvas.drawCentredString(
        letter[0] / 2, 0.45 * inch,
        f"July 8 visit briefing · Church & Dwight / TheraBreath · {canvas.getPageNumber()} of {TOTAL_PAGES}",
    )
    canvas.restoreState()


def build():
    styles = build_styles()
    doc = SimpleDocTemplate(
        OUT,
        pagesize=letter,
        leftMargin=0.7 * inch,
        rightMargin=0.7 * inch,
        topMargin=0.65 * inch,
        bottomMargin=0.8 * inch,
        title="July 8 Visit Briefing · TFF × TheraBreath",
        author="The Flavor Factory",
    )
    story = []

    # Page 1 — cover + agenda
    story.append(header_band(styles))
    story.append(Spacer(1, 0.28 * inch))
    story.append(Paragraph("July 8 visit briefing", styles["title"]))
    story.append(Paragraph(
        "Breath of Innovation · Tuesday, July 8, 2026 · 2058 Second Street, Norco, CA",
        styles["subtitle"],
    ))
    story.append(Paragraph(
        "Your R&amp;D and procurement colleagues asked for a <b>capabilities workshop</b> at our Norco "
        "facility — not a sales presentation. This briefing covers the suggested agenda, what we will "
        "do together, what we plan to discuss, and what both teams hope to walk away with.",
        styles["body"],
    ))
    story.append(Spacer(1, 0.06 * inch))
    story.append(Paragraph(
        "<b>Arrive 9:00 AM.</b> Facility tour first, then presentation across the street at 9:30. "
        "Casual business attire · closed-toe shoes · phone charged for the 10:30 tasting.",
        styles["body"],
    ))
    story.append(Spacer(1, 0.1 * inch))
    story.append(Paragraph("SUGGESTED AGENDA", styles["kicker"]))
    story.append(Paragraph(
        "<i>All times are suggested — we will adjust in the room to match your team's pace.</i>",
        styles["muted"],
    ))
    story.append(Spacer(1, 0.06 * inch))
    story.append(agenda_table(styles))

    # Page 2 — pillars + discussion
    story.append(PageBreak())
    story.append(header_band(styles))
    story.append(Spacer(1, 0.12 * inch))
    story.append(Paragraph("PRESENTATION · FOUR PILLARS · 9:30–10:15", styles["kicker"]))
    pillars = [
        ("Resiliency", "Capacity, continuity, certifications (SQF, GMP, FDA-registered) as volumes grow"),
        ("Innovation", "Sodium chlorite flavor architecture · chlorite-stable prototypes · competitive calibration"),
        ("Operations", "Single-site traceability · quality systems · supplier qualification documentation"),
        ("Partnership", "Communication cadence · investment alignment · Lakewood and future site transfers"),
    ]
    for title, desc in pillars:
        story.append(Paragraph(f"• <b>{title}</b> — {desc}", styles["bullet"]))
    story.append(Spacer(1, 0.12 * inch))
    story.append(Paragraph("WHAT WE PLAN TO DISCUSS", styles["kicker"]))
    story.append(Paragraph(
        "Themes from conversations with Ross Conroy and Neonila Levitsky. "
        "Bring anything else that matters to your team.",
        styles["muted"],
    ))
    for title, meta, points in DISCUSSION_TOPICS:
        story.extend(topic_block(styles, title, meta, points))

    # Page 3 — questions 1–5
    story.append(PageBreak())
    story.append(header_band(styles))
    story.append(Spacer(1, 0.12 * inch))
    story.append(Paragraph("10 QUESTIONS WE'D LIKE TO DISCUSS", styles["kicker"]))
    story.append(Paragraph(
        "We plan to ask these during the presentation or open Q&amp;A. "
        "Thoughtful answers help us align — no slides required on your side.",
        styles["muted"],
    ))
    story.extend(questions_block(styles, 0, 5))

    # Page 4 — questions 6–10
    story.append(PageBreak())
    story.append(header_band(styles))
    story.append(Spacer(1, 0.12 * inch))
    story.append(Paragraph("10 QUESTIONS (CONTINUED)", styles["kicker"]))
    story.extend(questions_block(styles, 5, 10))

    # Page 5 — outcomes
    story.append(PageBreak())
    story.append(header_band(styles))
    story.append(Spacer(1, 0.12 * inch))
    story.append(Paragraph("WHAT WE HOPE TO GET FROM THE VISIT", styles["kicker"]))
    story.append(Paragraph("For TheraBreath", styles["h2"]))
    story.extend(bullets(styles, OUTCOMES_TB))
    story.append(Spacer(1, 0.1 * inch))
    story.append(Paragraph("For The Flavor Factory", styles["h2"]))
    story.extend(bullets(styles, OUTCOMES_TFF))
    story.append(Spacer(1, 0.1 * inch))
    story.append(Paragraph("COME PREPARED", styles["kicker"]))
    prep = [
        "9:00 AM arrival — 2058 Second Street, Norco, CA 92860",
        "Casual business attire — closed-toe shoes for the production walkthrough",
        "Questions ready — review the 10 discussion questions above",
        "No other pre-reading required — this briefing has the agenda, topics, and outcomes",
    ]
    story.extend(bullets(styles, prep))

    # Page 6 — contact
    story.append(PageBreak())
    story.append(header_band(styles))
    story.append(Spacer(1, 0.2 * inch))
    story.append(Paragraph("BEFORE JULY 8", styles["kicker"]))
    story.append(Paragraph(
        "Questions welcome anytime. We look forward to a productive working session.",
        styles["body"],
    ))
    story.append(Spacer(1, 0.15 * inch))
    contact = Table([[
        Paragraph(
            "<b>The Flavor Factory</b><br/>"
            "2058 Second Street · Norco, CA 92860<br/>"
            "(951) 273-9877 · flavorfactory.net<br/><br/>"
            "Capabilities first · Tasting second · Partnership outcome third",
            styles["body"],
        )
    ]], colWidths=[6.6 * inch])
    contact.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), INK),
        ("TEXTCOLOR", (0, 0), (-1, -1), colors.white),
        ("LEFTPADDING", (0, 0), (-1, -1), 14),
        ("TOPPADDING", (0, 0), (-1, -1), 14),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 14),
    ]))
    story.append(contact)

    doc.build(story, onFirstPage=page_footer, onLaterPages=page_footer)
    print("Wrote", OUT)


if __name__ == "__main__":
    build()
