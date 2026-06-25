"""
Rebuild 01-together-we-win-partnership.pdf — guest-facing leave-behind for TheraBreath.
Run: python _build-partnership-pdf.py
"""
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    KeepTogether,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

OUT = "booklet/documents/01-together-we-win-partnership.pdf"

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
            fontSize=26,
            textColor=INK,
            leading=30,
            spaceAfter=10,
        ),
        "subtitle": ParagraphStyle(
            "subtitle",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=11,
            textColor=MUTED,
            leading=15,
            spaceAfter=14,
        ),
        "h2": ParagraphStyle(
            "h2",
            parent=base["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=16,
            textColor=INK,
            leading=20,
            spaceBefore=4,
            spaceAfter=10,
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
            leftIndent=14,
            bulletIndent=0,
            spaceAfter=4,
        ),
        "pill": ParagraphStyle(
            "pill",
            parent=base["Normal"],
            fontName="Helvetica-Bold",
            fontSize=8,
            textColor=INK,
            alignment=TA_CENTER,
            leading=10,
        ),
    }


def header_band():
    data = [[
        Paragraph('<font color="#0a1628"><b>THE FLAVOR FACTORY</b></font>', build_styles()["muted"]),
        Paragraph('<font color="#008fd3"><b>×</b></font>', build_styles()["muted"]),
        Paragraph('<font color="#0a1628"><b>TheraBreath</b></font>', build_styles()["muted"]),
    ]]
    t = Table(data, colWidths=[2.2 * inch, 0.25 * inch, 2.2 * inch])
    t.setStyle(TableStyle([
        ("ALIGN", (0, 0), (-1, -1), "LEFT"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LINEBELOW", (0, 0), (-1, 0), 2, INK),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 8),
    ]))
    return t


def pillar_cards(styles):
    items = [
        ("Resiliency", "Capacity, redundancy, and supply continuity as volumes grow."),
        ("Innovation", "Oral-care flavor work inside sodium chlorite chemistry."),
        ("Operations", "Single-site traceability from sample through production."),
        ("Partnership", "Aligned communication, investment, and shared growth."),
    ]
    rows = []
    for title, desc in items:
        rows.append([
            Paragraph(f'<b>{title}</b><br/><font size="9" color="#5c6678">{desc}</font>', styles["body"])
        ])
    t = Table(rows, colWidths=[7.3 * inch])
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


def agenda_table(styles):
    rows = [
        ["Time", "Session", "Focus"],
        ["9:00–9:25 AM", "Facility tour", "2058 Second Street · production, QC, TheraBreath room"],
        ["9:30–10:15 AM", "TFF presentation", "Four pillars · conference room across the street"],
        ["10:15–10:30 AM", "Break", "Reset before tasting"],
        ["10:30–11:15 AM", "Tasting", "Ten prototypes · blind mapping · scorecard"],
        ["11:30 AM–1:00 PM", "Lunch off site", "Hosts take the group"],
        ["1:00 PM onward", "Open Q&A", "Your topics · wrap when ready"],
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
    t = Table(data, colWidths=[1.45 * inch, 1.65 * inch, 3.2 * inch])
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


def lakewood_table(styles):
    rows = [
        ["Step", "What we run", "When it applies"],
        ["1", "Expert sensory screen", "Same / different vs reference, per variant"],
        ["2", "Triangle test (ISO 4120)", "Statistical difference check"],
        ["3", "Blind paired profiling", "Only if triangle flags a difference"],
        ["4", "Consumer validation", "Priority SKUs where difference is confirmed"],
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
    t = Table(data, colWidths=[0.55 * inch, 2.4 * inch, 3.35 * inch])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), PAPER),
        ("BOX", (0, 0), (-1, -1), 0.75, LINE),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, LINE),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
    ]))
    return t


def page_footer(canvas, doc, page_num, total=3):
    canvas.saveState()
    canvas.setStrokeColor(LINE)
    canvas.setLineWidth(0.5)
    canvas.line(0.75 * inch, 0.65 * inch, letter[0] - 0.75 * inch, 0.65 * inch)
    canvas.setFont("Helvetica", 7.5)
    canvas.setFillColor(MUTED)
    canvas.drawCentredString(
        letter[0] / 2,
        0.45 * inch,
        f"Confidential · Prepared for Church & Dwight / TheraBreath · July 2026 · {page_num} of {total}",
    )
    canvas.restoreState()


def on_page(canvas, doc):
    page_footer(canvas, doc, canvas.getPageNumber())


def build():
    styles = build_styles()
    doc = SimpleDocTemplate(
        OUT,
        pagesize=letter,
        leftMargin=0.75 * inch,
        rightMargin=0.75 * inch,
        topMargin=0.7 * inch,
        bottomMargin=0.85 * inch,
        title="Together We Win · TFF × TheraBreath",
        author="The Flavor Factory",
    )
    story = []

    # Cover
    story.append(header_band())
    story.append(Spacer(1, 0.55 * inch))
    story.append(Paragraph("Together We Have<br/>the Power to Win", styles["title"]))
    story.append(Paragraph(
        "A capabilities partnership for TheraBreath's next chapter of growth.",
        styles["subtitle"],
    ))
    story.append(Spacer(1, 0.15 * inch))
    pills = Table([[
        Paragraph("PARTNERSHIP", styles["pill"]),
        Paragraph("SCALE", styles["pill"]),
        Paragraph("QUALITY", styles["pill"]),
        Paragraph("TASTE CONSISTENCY", styles["pill"]),
    ]], colWidths=[1.7 * inch] * 4)
    pills.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), PAPER),
        ("BOX", (0, 0), (-1, -1), 0.75, LINE),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, LINE),
        ("TOPPADDING", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
        ("LINEBELOW", (0, 0), (0, 0), 3, BLUE),
        ("LINEBELOW", (1, 0), (1, 0), 3, GREEN),
        ("LINEBELOW", (2, 0), (2, 0), 3, ORANGE),
        ("LINEBELOW", (3, 0), (3, 0), 3, INK),
    ]))
    story.append(pills)
    story.append(Spacer(1, 0.35 * inch))
    story.append(Paragraph(
        "<b>Breath of Innovation</b> · July 8, 2026 · Norco, California<br/>"
        "The Flavor Factory — development, production, and quality under one roof.",
        styles["muted"],
    ))

    # Why we're here
    story.append(Spacer(1, 0.35 * inch))
    story.append(Paragraph("WHY WE'RE MEETING", styles["kicker"]))
    story.append(Paragraph("Built for your R&amp;D and procurement team", styles["h2"]))
    story.append(Paragraph(
        "TheraBreath is scaling across rinses, toothpastes, and new production sites. "
        "This visit is a working capabilities review — not a sales pitch. "
        "You will see how we develop, manufacture, and support the flavors behind that growth, "
        "with the same Norco team from first sample to repeat order.",
        styles["body"],
    ))
    bullets = [
        "Real facility walkthrough and documented quality systems",
        "Honest answers on resiliency, innovation, operations, and partnership",
        "Directional sensory feedback on ten workshop prototypes",
        "A clear path for Lakewood site parity validation",
    ]
    for b in bullets:
        story.append(Paragraph(f"• {b}", styles["bullet"]))

    # Four pillars
    story.append(Spacer(1, 0.3 * inch))
    story.append(Paragraph("FOUR PILLARS", styles["kicker"]))
    story.append(Paragraph("What your team asked to see", styles["h2"]))
    story.append(pillar_cards(styles))

    # Agenda
    story.append(Spacer(1, 0.3 * inch))
    story.append(Paragraph("JULY 8 AGENDA", styles["kicker"]))
    story.append(Paragraph("Your day in Norco", styles["h2"]))
    story.append(Paragraph(
        "Arrive <b>9:00 AM</b> · facility tour at <b>2058 Second Street, Norco, CA 92860</b> · "
        "presentation <b>9:30 AM</b> in the conference room across from The Flavor Factory",
        styles["muted"],
    ))
    story.append(Spacer(1, 0.12 * inch))
    story.append(agenda_table(styles))
    story.append(Spacer(1, 0.1 * inch))
    story.append(Paragraph(
        "Full schedule for email: <b>therabreath-visit-site.vercel.app/agenda</b>",
        styles["muted"],
    ))

    # Lakewood
    story.append(Spacer(1, 0.28 * inch))
    story.append(Paragraph("LAKEWOOD SITE PARITY", styles["kicker"]))
    story.append(Paragraph("Protecting taste as production expands", styles["h2"]))
    story.append(Paragraph(
        "As TheraBreath scales to Lakewood, we use a four-step escalation ladder — "
        "expert screen, triangle test, descriptive profiling, and consumer validation only where data requires it.",
        styles["body"],
    ))
    story.append(lakewood_table(styles))

    # Close
    story.append(Spacer(1, 0.35 * inch))
    story.append(Paragraph("WHAT COMES NEXT", styles["kicker"]))
    story.append(Paragraph("Same trusted partner. Future-ready support.", styles["h2"]))
    story.append(Paragraph(
        "After July 8, you receive a follow-up summary within 24 hours — sensory rollup, "
        "pilot priorities, Lakewood alignment, and named owners for next steps.",
        styles["body"],
    ))
    story.append(Spacer(1, 0.2 * inch))
    close = Table([[
        Paragraph(
            "<b>The Flavor Factory</b><br/>"
            "2058 Second Street · Norco, CA 92860<br/>"
            "(951) 273-9877 · flavorfactory.net<br/><br/>"
            "Dan Wixted · Ryan Wixted · Alex Wixted · Matt Wixted · Kelly Ziegler",
            styles["body"],
        )
    ]], colWidths=[7.0 * inch])
    close.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), INK),
        ("TEXTCOLOR", (0, 0), (-1, -1), colors.white),
        ("LEFTPADDING", (0, 0), (-1, -1), 16),
        ("RIGHTPADDING", (0, 0), (-1, -1), 16),
        ("TOPPADDING", (0, 0), (-1, -1), 16),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 16),
    ]))
    story.append(close)

    doc.build(story, onFirstPage=on_page, onLaterPages=on_page)
    print("Wrote", OUT)


if __name__ == "__main__":
    build()