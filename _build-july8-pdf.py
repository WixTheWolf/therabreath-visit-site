"""
Rebuild july-8-briefing.pdf — compact 2-page TheraBreath pre-visit briefing.
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
    INNOVATION_ITEMS,
    OPENING,
    OUTCOMES_TB,
    PILLARS,
    STRATEGIC_QUESTIONS,
    TOPICS_COMPACT,
)

OUT = "booklet/documents/july-8-briefing.pdf"
TOTAL_PAGES = 2

BLUE = colors.HexColor("#008fd3")
INK = colors.HexColor("#0a1628")
MUTED = colors.HexColor("#5c6678")
LINE = colors.HexColor("#e2e9ec")
PAPER = colors.HexColor("#f8fafc")


def build_styles():
    base = getSampleStyleSheet()
    return {
        "kicker": ParagraphStyle(
            "kicker", parent=base["Normal"], fontName="Helvetica-Bold",
            fontSize=7.5, textColor=BLUE, spaceAfter=4, letterSpacing=0.8,
        ),
        "title": ParagraphStyle(
            "title", parent=base["Heading1"], fontName="Helvetica-Bold",
            fontSize=20, textColor=INK, leading=24, spaceAfter=4,
        ),
        "subtitle": ParagraphStyle(
            "subtitle", parent=base["Normal"], fontName="Helvetica",
            fontSize=9.5, textColor=MUTED, leading=12, spaceAfter=6,
        ),
        "body": ParagraphStyle(
            "body", parent=base["Normal"], fontName="Helvetica",
            fontSize=8.5, textColor=INK, leading=11.5, spaceAfter=4,
        ),
        "muted": ParagraphStyle(
            "muted", parent=base["Normal"], fontName="Helvetica",
            fontSize=7.5, textColor=MUTED, leading=10.5, spaceAfter=3,
        ),
        "bullet": ParagraphStyle(
            "bullet", parent=base["Normal"], fontName="Helvetica",
            fontSize=8, textColor=INK, leading=10.5, leftIndent=10, spaceAfter=1,
        ),
        "topic": ParagraphStyle(
            "topic", parent=base["Normal"], fontName="Helvetica",
            fontSize=8, textColor=INK, leading=11, spaceAfter=3,
        ),
        "qcompact": ParagraphStyle(
            "qcompact", parent=base["Normal"], fontName="Helvetica",
            fontSize=7.5, textColor=INK, leading=10, spaceAfter=2,
        ),
    }


def header_band(styles):
    data = [[
        Paragraph('<font color="#0a1628"><b>THE FLAVOR FACTORY</b></font>', styles["muted"]),
        Paragraph('<font color="#008fd3"><b>×</b></font>', styles["muted"]),
        Paragraph('<font color="#0a1628"><b>TheraBreath</b></font>', styles["muted"]),
    ]]
    t = Table(data, colWidths=[2.2 * inch, 0.2 * inch, 2.2 * inch])
    t.setStyle(TableStyle([
        ("LINEBELOW", (0, 0), (-1, 0), 1.5, INK),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 5),
    ]))
    return t


def agenda_table(styles):
    rows = [["Time", "Session", "Focus"]] + list(AGENDA_ROWS)
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
    t = Table(data, colWidths=[0.75 * inch, 1.15 * inch, 4.35 * inch])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), PAPER),
        ("BOX", (0, 0), (-1, -1), 0.5, LINE),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, LINE),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    return t


def questions_two_col(styles):
    data = []
    for i in range(5):
        data.append([
            Paragraph(f"<b>{i + 1}.</b> {STRATEGIC_QUESTIONS[i]}", styles["qcompact"]),
            Paragraph(f"<b>{i + 6}.</b> {STRATEGIC_QUESTIONS[i + 5]}", styles["qcompact"]),
        ])
    t = Table(data, colWidths=[3.15 * inch, 3.15 * inch])
    t.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 2),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4),
        ("TOPPADDING", (0, 0), (-1, -1), 2),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    return t


def page_footer(canvas, _doc):
    canvas.saveState()
    canvas.setStrokeColor(LINE)
    canvas.line(0.65 * inch, 0.6 * inch, letter[0] - 0.65 * inch, 0.6 * inch)
    canvas.setFont("Helvetica", 7)
    canvas.setFillColor(MUTED)
    canvas.drawCentredString(
        letter[0] / 2, 0.42 * inch,
        f"July 8 briefing · TheraBreath · {canvas.getPageNumber()} of {TOTAL_PAGES}",
    )
    canvas.restoreState()


def build():
    styles = build_styles()
    doc = SimpleDocTemplate(
        OUT,
        pagesize=letter,
        leftMargin=0.65 * inch,
        rightMargin=0.65 * inch,
        topMargin=0.55 * inch,
        bottomMargin=0.72 * inch,
        title="July 8 Briefing · TFF × TheraBreath",
        author="The Flavor Factory",
    )
    story = []

    # Page 1 — day + pillars + topics
    story.append(header_band(styles))
    story.append(Spacer(1, 0.14 * inch))
    story.append(Paragraph("Your July 8 briefing", styles["title"]))
    story.append(Paragraph(
        "Breath of Innovation · Tuesday, July 8, 2026 · Norco, CA",
        styles["subtitle"],
    ))
    story.append(Paragraph(OPENING, styles["body"]))
    story.append(Paragraph(ARRIVE_NOTE, styles["body"]))
    story.append(Spacer(1, 0.06 * inch))
    story.append(Paragraph("YOUR DAY", styles["kicker"]))
    story.append(agenda_table(styles))
    story.append(Spacer(1, 0.08 * inch))
    story.append(Paragraph("FOUR PILLARS · 9:30", styles["kicker"]))
    for title, desc in PILLARS:
        story.append(Paragraph(f"• <b>{title}</b> — {desc}", styles["bullet"]))
    story.append(Spacer(1, 0.06 * inch))
    story.append(Paragraph("TOPICS WE WILL COVER", styles["kicker"]))
    for title, desc in TOPICS_COMPACT:
        story.append(Paragraph(f"<b>{title}</b> — {desc}", styles["topic"]))
    story.append(Spacer(1, 0.04 * inch))
    story.append(Paragraph("INNOVATION · FLAVOR PARTNER", styles["kicker"]))
    for item in INNOVATION_ITEMS:
        story.append(Paragraph(f"• {item}", styles["bullet"]))

    # Page 2 — questions + outcomes + contact
    story.append(PageBreak())
    story.append(header_band(styles))
    story.append(Spacer(1, 0.1 * inch))
    story.append(Paragraph("TEN QUESTIONS FOR YOUR TEAM", styles["kicker"]))
    story.append(Paragraph(
        "<i>No prep deck — bring your real answers.</i>",
        styles["muted"],
    ))
    story.append(Spacer(1, 0.04 * inch))
    story.append(questions_two_col(styles))
    story.append(Spacer(1, 0.08 * inch))
    story.append(Paragraph("WHAT YOU SHOULD LEAVE WITH", styles["kicker"]))
    for item in OUTCOMES_TB:
        story.append(Paragraph(f"• {item}", styles["bullet"]))
    story.append(Spacer(1, 0.1 * inch))
    contact = Table([[
        Paragraph(
            "<b>The Flavor Factory</b> · 2058 Second Street, Norco, CA 92860 · (951) 273-9877<br/>"
            "<i>Thank you — we look forward to July 8.</i>",
            styles["body"],
        )
    ]], colWidths=[6.7 * inch])
    contact.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), INK),
        ("TEXTCOLOR", (0, 0), (-1, -1), colors.white),
        ("LEFTPADDING", (0, 0), (-1, -1), 12),
        ("TOPPADDING", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
    ]))
    story.append(contact)

    doc.build(story, onFirstPage=page_footer, onLaterPages=page_footer)
    print("Wrote", OUT)


if __name__ == "__main__":
    build()
