"""
Rebuild breath-of-innovation-presentation.pdf — simple pre-visit heads-up for TheraBreath.
Run: python _build-presentation-pdf.py
"""
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "booklet" / "documents" / "breath-of-innovation-presentation.pdf"
TOTAL_PAGES = 2

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
        "kicker": ParagraphStyle(
            "kicker",
            parent=base["Normal"],
            fontName="Helvetica-Bold",
            fontSize=8,
            textColor=BLUE,
            spaceAfter=6,
            letterSpacing=1.0,
        ),
        "title": ParagraphStyle(
            "title",
            parent=base["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=22,
            textColor=INK,
            leading=26,
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
            fontSize=14,
            textColor=INK,
            leading=18,
            spaceBefore=2,
            spaceAfter=8,
        ),
        "body": ParagraphStyle(
            "body",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=10.5,
            textColor=INK,
            leading=15,
            spaceAfter=8,
        ),
        "muted": ParagraphStyle(
            "muted",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=9.5,
            textColor=MUTED,
            leading=14,
            spaceAfter=6,
        ),
        "bullet": ParagraphStyle(
            "bullet",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=10,
            textColor=INK,
            leading=14,
            leftIndent=12,
            spaceAfter=5,
        ),
    }


def header_band(styles):
    data = [[
        Paragraph('<font color="#0a1628"><b>THE FLAVOR FACTORY</b></font>', styles["muted"]),
        Paragraph('<font color="#008fd3"><b>→</b></font>', styles["muted"]),
        Paragraph('<font color="#0a1628"><b>TheraBreath Team</b></font>', styles["muted"]),
    ]]
    t = Table(data, colWidths=[2.3 * inch, 0.3 * inch, 2.3 * inch])
    t.setStyle(TableStyle([
        ("ALIGN", (0, 0), (-1, -1), "LEFT"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LINEBELOW", (0, 0), (-1, 0), 2, INK),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 8),
    ]))
    return t


def schedule_table(styles):
    rows = [
        ["Suggested time", "What we'll do"],
        ["9:00 AM", "Arrive · 2058 Second Street — facility tour first"],
        ["9:00–9:25", "Facility tour — production and quality areas"],
        ["9:30–10:15", "Presentation — open discussion on the topics below"],
        ["10:15–10:30", "Break"],
        ["10:30–11:15", "Tasting — five mint platforms (M1–M5); directional feedback"],
        ["11:30–1:00", "Lunch off site — your hosts take the group"],
        ["1:00 PM+", "Open Q&A — your questions, your pace"],
    ]
    data = []
    for i, row in enumerate(rows):
        if i == 0:
            data.append([Paragraph(f"<b>{c}</b>", styles["muted"]) for c in row])
        else:
            data.append([
                Paragraph(f'<font color="#008fd3"><b>{row[0]}</b></font>', styles["body"]),
                Paragraph(row[1], styles["body"]),
            ])
    t = Table(data, colWidths=[1.5 * inch, 5.3 * inch])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), PAPER),
        ("BOX", (0, 0), (-1, -1), 0.75, LINE),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, LINE),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
    ]))
    return t


def topics_block(styles):
    topics = [
        (
            "Resiliency",
            "Can we keep pace as your volumes grow? Capacity, backup plans, and quality certifications.",
            BLUE,
        ),
        (
            "Innovation",
            "Flavor work inside your products — including oral-care chemistry and new directions worth exploring.",
            GREEN,
        ),
        (
            "Operations",
            "How we develop, produce, and release flavors from one Norco facility — with clear documentation.",
            ORANGE,
        ),
        (
            "Partnership",
            "How we communicate, invest, and plan with you over the long term.",
            INK,
        ),
    ]
    rows = []
    for title, desc, accent in topics:
        rows.append([
            Paragraph(
                f'<b>{title}</b><br/><font size="9" color="#5c6678">{desc}</font>',
                styles["body"],
            )
        ])
    t = Table(rows, colWidths=[6.8 * inch])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), PAPER),
        ("BOX", (0, 0), (-1, -1), 0.75, LINE),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, LINE),
        ("LEFTPADDING", (0, 0), (-1, -1), 12),
        ("RIGHTPADDING", (0, 0), (-1, -1), 12),
        ("TOPPADDING", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
        ("LINEBELOW", (0, 0), (0, 0), 3, BLUE),
        ("LINEBELOW", (0, 1), (0, 1), 3, GREEN),
        ("LINEBELOW", (0, 2), (0, 2), 3, ORANGE),
        ("LINEBELOW", (0, 3), (0, 3), 3, INK),
    ]))
    return t


def page_footer(canvas, _doc):
    canvas.saveState()
    canvas.setStrokeColor(LINE)
    canvas.setLineWidth(0.5)
    canvas.line(0.75 * inch, 0.65 * inch, letter[0] - 0.75 * inch, 0.65 * inch)
    canvas.setFont("Helvetica", 7.5)
    canvas.setFillColor(MUTED)
    canvas.drawCentredString(
        letter[0] / 2,
        0.45 * inch,
        f"From The Flavor Factory · July 8, 2026 · {canvas.getPageNumber()} of {TOTAL_PAGES}",
    )
    canvas.restoreState()


def build():
    styles = build_styles()
    doc = SimpleDocTemplate(
        str(OUT),
        pagesize=letter,
        leftMargin=0.75 * inch,
        rightMargin=0.75 * inch,
        topMargin=0.7 * inch,
        bottomMargin=0.85 * inch,
        title="What to Expect · TFF × TheraBreath · July 8, 2026",
        author="The Flavor Factory",
    )
    story = []

    story.append(header_band(styles))
    story.append(Spacer(1, 0.4 * inch))
    story.append(Paragraph("What to Expect", styles["title"]))
    story.append(Paragraph(
        "Breath of Innovation · Tuesday, July 8, 2026 · Norco, California",
        styles["subtitle"],
    ))
    story.append(Paragraph(
        "A brief overview before your July 8 visit — suggested schedule, discussion topics, "
        "and how to prepare. Full detail: <b>therabreath-visit-site.vercel.app/prepare</b>",
        styles["body"],
    ))
    story.append(Paragraph(
        "This is a <b>working session</b>, not a sales presentation. "
        "We'll show you how we operate, answer direct questions, and taste "
        "<b>five mint platforms (M1–M5)</b> for honest directional feedback.",
        styles["body"],
    ))

    story.append(Spacer(1, 0.2 * inch))
    story.append(Paragraph("YOUR DAY", styles["kicker"]))
    story.append(Paragraph("Suggested schedule", styles["h2"]))
    story.append(schedule_table(styles))
    story.append(Spacer(1, 0.08 * inch))
    story.append(Paragraph(
        "<i>All times are suggested — we'll adjust in the room to match your team's pace.</i>",
        styles["muted"],
    ))

    story.append(Spacer(1, 0.22 * inch))
    story.append(Paragraph("WHAT WE PLAN TO DISCUSS", styles["kicker"]))
    story.append(Paragraph("Four areas your team asked about", styles["h2"]))
    story.append(topics_block(styles))
    story.append(Spacer(1, 0.1 * inch))
    story.append(Paragraph("We can also cover:", styles["muted"]))
    extras = [
        "Lakewood site parity — keeping taste consistent as production expands",
        "Workshop tasting — five coded mint platforms (M1–M5); directional feedback only, not a launch decision",
        "Anything else on your list — procurement, growth, or technical topics",
    ]
    for item in extras:
        story.append(Paragraph(f"• {item}", styles["bullet"]))

    story.append(Spacer(1, 0.2 * inch))
    story.append(Paragraph("BEFORE JULY 8", styles["kicker"]))
    story.append(Paragraph("Questions welcome", styles["h2"]))
    story.append(Paragraph(
        "If anything comes up before the visit, reach out to The Flavor Factory team. "
        "We're happy to help with logistics or topics you'd like us to prioritize.",
        styles["body"],
    ))

    contact = Table([[
        Paragraph(
            "<b>The Flavor Factory</b><br/>"
            "2058 Second Street · Norco, CA 92860<br/>"
            "(951) 273-9877 · flavorfactory.net",
            styles["body"],
        )
    ]], colWidths=[6.5 * inch])
    contact.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), PAPER),
        ("BOX", (0, 0), (-1, -1), 0.75, LINE),
        ("LEFTPADDING", (0, 0), (-1, -1), 14),
        ("TOPPADDING", (0, 0), (-1, -1), 12),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 12),
        ("LINEBELOW", (0, 0), (0, 0), 3, BLUE),
    ]))
    story.append(contact)

    doc.build(story, onFirstPage=page_footer, onLaterPages=page_footer)
    print("Wrote", OUT)


if __name__ == "__main__":
    build()