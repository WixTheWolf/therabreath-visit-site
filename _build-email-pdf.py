"""
Rebuild july-8-email-packet.pdf — single PDF to attach or link in the TheraBreath email.
Run: python _build-email-pdf.py
Optional: TFF_SITE_URL=https://your-project.vercel.app python _build-email-pdf.py
"""
import os

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import PageBreak, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

OUT = "booklet/documents/july-8-email-packet.pdf"
SITE_URL = os.environ.get("TFF_SITE_URL", "https://therabreath-visit-site.vercel.app").rstrip("/")
TOTAL_PAGES = 4

BLUE = colors.HexColor("#008fd3")
GREEN = colors.HexColor("#5fb832")
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
            fontSize=14, textColor=INK, leading=18, spaceAfter=8,
        ),
        "body": ParagraphStyle(
            "body", parent=base["Normal"], fontName="Helvetica",
            fontSize=10, textColor=INK, leading=14, spaceAfter=6,
        ),
        "muted": ParagraphStyle(
            "muted", parent=base["Normal"], fontName="Helvetica",
            fontSize=9, textColor=MUTED, leading=13, spaceAfter=5,
        ),
        "bullet": ParagraphStyle(
            "bullet", parent=base["Normal"], fontName="Helvetica",
            fontSize=9.5, textColor=INK, leading=13, leftIndent=12, spaceAfter=3,
        ),
        "qnum": ParagraphStyle(
            "qnum", parent=base["Normal"], fontName="Helvetica-Bold",
            fontSize=9, textColor=PURPLE, leading=12,
        ),
        "qtext": ParagraphStyle(
            "qtext", parent=base["Normal"], fontName="Helvetica-Bold",
            fontSize=9.5, textColor=INK, leading=13, spaceAfter=2,
        ),
        "qwhy": ParagraphStyle(
            "qwhy", parent=base["Normal"], fontName="Helvetica",
            fontSize=8.5, textColor=MUTED, leading=12, spaceAfter=8,
        ),
        "link": ParagraphStyle(
            "link", parent=base["Normal"], fontName="Helvetica-Bold",
            fontSize=9.5, textColor=BLUE, leading=13, spaceAfter=4,
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
        ["Time", "Session", "Focus"],
        ["9:00–9:25", "Facility tour", "2058 Second Street · production, QC, TheraBreath room"],
        ["9:30–10:15", "TFF presentation", "Four pillars · conference room across the street"],
        ["10:15–10:30", "Break", "Reset before tasting"],
        ["10:30–11:15", "Tasting", "Flavor Flight Challenge · Samples A-E · admin results"],
        ["11:30–1:00", "Lunch off site", "Hosts take the group · back 1:00 PM"],
        ["1:00+", "Open discussion", "Lakewood · procurement · your pace"],
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
    t = Table(data, colWidths=[1.2 * inch, 1.5 * inch, 3.6 * inch])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), PAPER),
        ("BOX", (0, 0), (-1, -1), 0.75, LINE),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, LINE),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 7),
        ("RIGHTPADDING", (0, 0), (-1, -1), 7),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    return t


def questions_block(styles, start, end):
    story = []
    for i, (question, why) in enumerate(STRATEGIC_QUESTIONS[start:end], start=start + 1):
        story.append(Paragraph(f"{i}.", styles["qnum"]))
        story.append(Paragraph(question, styles["qtext"]))
        story.append(Paragraph(why, styles["qwhy"]))
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
        f"July 8 email packet · Church & Dwight / TheraBreath · {canvas.getPageNumber()} of {TOTAL_PAGES}",
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
        title="July 8 Email Packet · TFF × TheraBreath",
        author="The Flavor Factory",
    )
    story = []

    # Page 1 — cover + links
    story.append(header_band(styles))
    story.append(Spacer(1, 0.35 * inch))
    story.append(Paragraph("Prepare for July 8", styles["title"]))
    story.append(Paragraph(
        "Breath of Innovation · Tuesday, July 8, 2026 · Norco, California",
        styles["subtitle"],
    ))
    story.append(Paragraph(
        "Your R&amp;D and procurement colleagues asked for a <b>capabilities workshop</b> at our Norco "
        "facility — not a sales presentation. This packet summarizes the suggested agenda, discussion "
        "topics, and ten questions we plan to ask so your team can prepare before you arrive.",
        styles["body"],
    ))
    story.append(Spacer(1, 0.12 * inch))
    story.append(Paragraph("ONLINE · USE ON YOUR PHONE AT THE VISIT", styles["kicker"]))
    links = [
        ("Meeting prep &amp; discussion highlights", f"{SITE_URL}/prepare"),
        ("Full visit packet index", f"{SITE_URL}/booklet"),
        ("Day-of hub · schedule &amp; tools", f"{SITE_URL}/visit"),
        ("Flavor Flight Challenge (10:30 AM)", f"{SITE_URL}/taste"),
        ("Flavor Flight Results Admin (team only)", f"{SITE_URL}/score"),
    ]
    for label, url in links:
        story.append(Paragraph(f"• <b>{label}</b><br/>{url}", styles["bullet"]))
    story.append(Spacer(1, 0.15 * inch))
    story.append(Paragraph(
        f"<b>Arrive 9:00 AM</b> · 2058 Second Street, Norco, CA 92860 · "
        "casual business attire · closed-toe shoes for the production walkthrough",
        styles["muted"],
    ))

    # Page 2 — agenda + pillars
    story.append(PageBreak())
    story.append(header_band(styles))
    story.append(Spacer(1, 0.15 * inch))
    story.append(Paragraph("SUGGESTED SCHEDULE", styles["kicker"]))
    story.append(Paragraph("Facility tour first, then four-pillar discussion", styles["h2"]))
    story.append(Paragraph(
        "<i>All times are suggested — we will adjust in the room to match your team's pace.</i>",
        styles["muted"],
    ))
    story.append(Spacer(1, 0.08 * inch))
    story.append(agenda_table(styles))
    story.append(Spacer(1, 0.15 * inch))
    story.append(Paragraph("PRESENTATION · FOUR PILLARS", styles["kicker"]))
    pillars = [
        ("Resiliency", "Capacity, continuity, and certifications as volumes grow"),
        ("Innovation", "Sodium chlorite flavor work · competitive calibration · prototypes"),
        ("Operations", "Single-site traceability · quality systems · supplier documentation"),
        ("Partnership", "Communication cadence · Lakewood support · long-term alignment"),
    ]
    for title, desc in pillars:
        story.append(Paragraph(f"• <b>{title}</b> — {desc}", styles["bullet"]))

    # Page 3 — questions 1–5
    story.append(PageBreak())
    story.append(header_band(styles))
    story.append(Spacer(1, 0.15 * inch))
    story.append(Paragraph("10 QUESTIONS FOR YOUR TEAM", styles["kicker"]))
    story.append(Paragraph("Prepare thoughtful answers", styles["h2"]))
    story.append(Paragraph(
        "We plan to ask these during the presentation or open Q&amp;A. Honest answers help us "
        "align on growth, innovation, and partnership — no slides required on your side.",
        styles["muted"],
    ))
    story.extend(questions_block(styles, 0, 5))

    # Page 4 — questions 6–10 + contact
    story.append(PageBreak())
    story.append(header_band(styles))
    story.append(Spacer(1, 0.15 * inch))
    story.append(Paragraph("10 QUESTIONS (CONTINUED)", styles["kicker"]))
    story.extend(questions_block(styles, 5, 10))
    story.append(Spacer(1, 0.1 * inch))
    story.append(Paragraph("COME PREPARED", styles["kicker"]))
    prep = [
        "Phone charged — Wi‑Fi on site for tasting tools at 10:30 AM",
        "Questions ready — technical, operational, and partnership topics welcome",
        "Lakewood parity topics from your email threads — we grouped them on the prep page",
    ]
    for p in prep:
        story.append(Paragraph(f"• {p}", styles["bullet"]))
    story.append(Spacer(1, 0.12 * inch))
    contact = Table([[
        Paragraph(
            "<b>The Flavor Factory</b><br/>"
            "2058 Second Street · Norco, CA 92860<br/>"
            "(951) 273-9877 · flavorfactory.net<br/><br/>"
            f"Full prep: <b>{SITE_URL}/prepare</b>",
            styles["body"],
        )
    ]], colWidths=[6.5 * inch])
    contact.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), INK),
        ("TEXTCOLOR", (0, 0), (-1, -1), colors.white),
        ("LEFTPADDING", (0, 0), (-1, -1), 14),
        ("TOPPADDING", (0, 0), (-1, -1), 12),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 12),
    ]))
    story.append(contact)

    doc.build(story, onFirstPage=page_footer, onLaterPages=page_footer)
    print("Wrote", OUT)
    print("Site URL embedded:", SITE_URL)


if __name__ == "__main__":
    build()
