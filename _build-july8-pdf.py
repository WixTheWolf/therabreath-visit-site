"""
Rebuild july-8-briefing.pdf — TheraBreath pre-visit briefing (attach to email).
Run: python3 _build-july8-pdf.py
"""
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import PageBreak, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

from _july8_briefing_content import (
    AGENDA_ROWS,
    ARRIVE_NOTE,
    DISCUSSION_TOPICS,
    OPENING,
    OUTCOMES_TB,
    OUTCOMES_TB_PREP,
    PILLARS,
    STRATEGIC_QUESTIONS,
)

OUT = "booklet/documents/july-8-briefing.pdf"
TOTAL_PAGES = 5

BLUE = colors.HexColor("#008fd3")
INK = colors.HexColor("#0a1628")
MUTED = colors.HexColor("#5c6678")
LINE = colors.HexColor("#e2e9ec")
PAPER = colors.HexColor("#f8fafc")
PURPLE = colors.HexColor("#6c5ce7")


def build_styles():
    base = getSampleStyleSheet()
    return {
        "kicker": ParagraphStyle(
            "kicker", parent=base["Normal"], fontName="Helvetica-Bold",
            fontSize=8, textColor=BLUE, spaceAfter=6, letterSpacing=1.0,
        ),
        "title": ParagraphStyle(
            "title", parent=base["Heading1"], fontName="Helvetica-Bold",
            fontSize=24, textColor=INK, leading=28, spaceAfter=6,
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
            fontSize=9.5, textColor=INK, leading=13.5, spaceAfter=6,
        ),
        "muted": ParagraphStyle(
            "muted", parent=base["Normal"], fontName="Helvetica",
            fontSize=8.5, textColor=MUTED, leading=12, spaceAfter=4,
        ),
        "bullet": ParagraphStyle(
            "bullet", parent=base["Normal"], fontName="Helvetica",
            fontSize=9, textColor=INK, leading=12.5, leftIndent=12, spaceAfter=3,
        ),
        "qtext": ParagraphStyle(
            "qtext", parent=base["Normal"], fontName="Helvetica",
            fontSize=9.5, textColor=INK, leading=13, spaceAfter=5,
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
    rows = [["Time", "Session", "What to expect"]] + list(AGENDA_ROWS)
    data = []
    for i, row in enumerate(rows):
        if i == 0:
            data.append([Paragraph(f"<b>{c}</b>", styles["muted"]) for c in row])
        else:
            data.append([
                Paragraph(f'<font color="#008fd3"><b>{row[0]}</b></font>', styles["body"]),
                Paragraph(f"<b>{row[1]}</b>", styles["body"]),
                Paragraph(row[2] or "—", styles["muted"]),
            ])
    t = Table(data, colWidths=[1.05 * inch, 1.25 * inch, 3.95 * inch])
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
    return [
        Paragraph(
            f'<font color="#6c5ce7"><b>{i}.</b></font> {q}',
            styles["qtext"],
        )
        for i, q in enumerate(STRATEGIC_QUESTIONS[start:end], start=start + 1)
    ]


def page_footer(canvas, _doc):
    canvas.saveState()
    canvas.setStrokeColor(LINE)
    canvas.setLineWidth(0.5)
    canvas.line(0.75 * inch, 0.65 * inch, letter[0] - 0.75 * inch, 0.65 * inch)
    canvas.setFont("Helvetica", 7.5)
    canvas.setFillColor(MUTED)
    canvas.drawCentredString(
        letter[0] / 2, 0.45 * inch,
        f"Your July 8 briefing · TheraBreath · {canvas.getPageNumber()} of {TOTAL_PAGES}",
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
        title="Your July 8 Briefing · TFF × TheraBreath",
        author="The Flavor Factory",
    )
    story = []

    # Page 1 — purpose + agenda
    story.append(header_band(styles))
    story.append(Spacer(1, 0.3 * inch))
    story.append(Paragraph("Your July 8 briefing", styles["title"]))
    story.append(Paragraph(
        "Breath of Innovation · Tuesday, July 8, 2026 · Norco, California",
        styles["subtitle"],
    ))
    story.append(Paragraph(OPENING, styles["body"]))
    story.append(Spacer(1, 0.04 * inch))
    story.append(Paragraph(ARRIVE_NOTE, styles["body"]))
    story.append(Spacer(1, 0.12 * inch))
    story.append(Paragraph("YOUR DAY", styles["kicker"]))
    story.append(Paragraph(
        "<i>Times are suggested — your team's priorities set the pace.</i>",
        styles["muted"],
    ))
    story.append(Spacer(1, 0.06 * inch))
    story.append(agenda_table(styles))
    story.append(Spacer(1, 0.12 * inch))
    story.append(Paragraph("FOUR PILLARS · 9:30–10:15", styles["kicker"]))
    for title, desc in PILLARS:
        story.append(Paragraph(f"• <b>{title}</b> — {desc}", styles["bullet"]))

    # Page 2 — discussion topics
    story.append(PageBreak())
    story.append(header_band(styles))
    story.append(Spacer(1, 0.12 * inch))
    story.append(Paragraph("WHAT WE WILL DIG INTO", styles["kicker"]))
    story.append(Paragraph(
        "Themes from your conversations with us — Lakewood, competitive calibration, and partnership. "
        "Bring what else matters to your team.",
        styles["muted"],
    ))
    story.append(Spacer(1, 0.06 * inch))
    for title, points in DISCUSSION_TOPICS:
        story.append(Paragraph(title, styles["h3"]))
        story.extend(bullets(styles, points))
        story.append(Spacer(1, 0.06 * inch))

    # Page 3 — questions 1–6
    story.append(PageBreak())
    story.append(header_band(styles))
    story.append(Spacer(1, 0.12 * inch))
    story.append(Paragraph("TEN QUESTIONS FOR YOUR TEAM", styles["kicker"]))
    story.append(Paragraph(
        "We will raise these in the room. Sharp answers help us align — no prep deck required on your side.",
        styles["muted"],
    ))
    story.extend(questions_block(styles, 0, 6))

    # Page 4 — questions 7–10 + outcomes
    story.append(PageBreak())
    story.append(header_band(styles))
    story.append(Spacer(1, 0.12 * inch))
    story.append(Paragraph("TEN QUESTIONS (CONTINUED)", styles["kicker"]))
    story.extend(questions_block(styles, 6, 10))
    story.append(Spacer(1, 0.1 * inch))
    story.append(Paragraph("WHAT YOU SHOULD LEAVE WITH", styles["kicker"]))
    story.extend(bullets(styles, OUTCOMES_TB))

    # Page 5 — prep + contact
    story.append(PageBreak())
    story.append(header_band(styles))
    story.append(Spacer(1, 0.12 * inch))
    story.append(Paragraph("HOW TO PREPARE", styles["kicker"]))
    prep = [
        "9:00 AM · 2058 Second Street, Norco, CA 92860 · closed-toe shoes",
        "Read the ten questions — bring your real answers, not talking points",
        "This briefing is enough — no other pre-reading required",
    ]
    story.extend(bullets(styles, prep))
    story.append(Spacer(1, 0.12 * inch))
    story.append(Paragraph("WHAT WE NEED FROM YOU", styles["kicker"]))
    story.extend(bullets(styles, OUTCOMES_TB_PREP))
    story.append(Spacer(1, 0.15 * inch))
    contact = Table([[
        Paragraph(
            "<b>The Flavor Factory</b><br/>"
            "2058 Second Street · Norco, CA 92860<br/>"
            "(951) 273-9877 · flavorfactory.net<br/><br/>"
            "<i>We built this day around what you told us matters.</i>",
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
