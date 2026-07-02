"""
Rebuild july-8-briefing.pdf — designed 2-page TheraBreath pre-visit briefing.
Run: python3 _prepare-july8-logos.py && python3 _build-july8-pdf.py
"""
import os

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)

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

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, "booklet/documents/july-8-briefing.pdf")
TFF_LOGO = os.path.join(ROOT, "assets/companies/logos/tff-logo.png")
TB_LOGO = os.path.join(ROOT, "assets/companies/logos/therabreath-logo.png")
TOTAL_PAGES = 2

BLUE = colors.HexColor("#008fd3")
GREEN = colors.HexColor("#5fb832")
ORANGE = colors.HexColor("#f58220")
INK = colors.HexColor("#0a1628")
MUTED = colors.HexColor("#5c6678")
LINE = colors.HexColor("#e2e9ec")
PAPER = colors.HexColor("#f8fafc")
SKY = colors.HexColor("#f0f9fd")
MINT = colors.HexColor("#f4faf0")
LAVENDER = colors.HexColor("#f6f4fc")
PILLAR_COLORS = [BLUE, GREEN, ORANGE, INK]

PAGE_W, PAGE_H = letter
MARGIN_L = 0.62 * inch
MARGIN_R = 0.62 * inch
MARGIN_T = 0.88 * inch
MARGIN_B = 0.78 * inch


def build_styles():
    base = getSampleStyleSheet()
    return {
        "kicker": ParagraphStyle(
            "kicker", parent=base["Normal"], fontName="Helvetica-Bold",
            fontSize=8, textColor=BLUE, spaceAfter=5, letterSpacing=1.1,
        ),
        "title": ParagraphStyle(
            "title", parent=base["Heading1"], fontName="Helvetica-Bold",
            fontSize=22, textColor=INK, leading=26, spaceAfter=3,
        ),
        "subtitle": ParagraphStyle(
            "subtitle", parent=base["Normal"], fontName="Helvetica",
            fontSize=10, textColor=MUTED, leading=13, spaceAfter=8,
        ),
        "body": ParagraphStyle(
            "body", parent=base["Normal"], fontName="Helvetica",
            fontSize=9, textColor=INK, leading=12.5, spaceAfter=5,
        ),
        "muted": ParagraphStyle(
            "muted", parent=base["Normal"], fontName="Helvetica",
            fontSize=8, textColor=MUTED, leading=11, spaceAfter=4,
        ),
        "bullet": ParagraphStyle(
            "bullet", parent=base["Normal"], fontName="Helvetica",
            fontSize=8.5, textColor=INK, leading=11.5, leftIndent=11, spaceAfter=2,
        ),
        "topic": ParagraphStyle(
            "topic", parent=base["Normal"], fontName="Helvetica",
            fontSize=8.5, textColor=INK, leading=12, spaceAfter=4,
        ),
        "qcompact": ParagraphStyle(
            "qcompact", parent=base["Normal"], fontName="Helvetica",
            fontSize=8, textColor=INK, leading=11, spaceAfter=3,
        ),
        "callout": ParagraphStyle(
            "callout", parent=base["Normal"], fontName="Helvetica",
            fontSize=8.5, textColor=INK, leading=12,
        ),
    }


def draw_top_accent(canvas):
    canvas.saveState()
    width = PAGE_W
    canvas.setFillColor(BLUE)
    canvas.rect(0, PAGE_H - 5, width * 0.45, 5, fill=1, stroke=0)
    canvas.setFillColor(GREEN)
    canvas.rect(width * 0.45, PAGE_H - 5, width * 0.3, 5, fill=1, stroke=0)
    canvas.setFillColor(ORANGE)
    canvas.rect(width * 0.75, PAGE_H - 5, width * 0.25, 5, fill=1, stroke=0)
    canvas.restoreState()


def draw_header(canvas):
    canvas.saveState()
    y = PAGE_H - MARGIN_T + 0.12 * inch
    if os.path.isfile(TFF_LOGO):
        canvas.drawImage(TFF_LOGO, MARGIN_L, y - 0.02 * inch, width=1.55 * inch, height=0.28 * inch,
                         preserveAspectRatio=True, mask="auto")
    if os.path.isfile(TB_LOGO):
        canvas.drawImage(TB_LOGO, PAGE_W - MARGIN_R - 1.75 * inch, y - 0.04 * inch,
                         width=1.75 * inch, height=0.32 * inch, preserveAspectRatio=True, mask="auto")
    canvas.setFont("Helvetica", 11)
    canvas.setFillColor(BLUE)
    canvas.drawCentredString(PAGE_W / 2, y + 0.06 * inch, "×")
    canvas.setStrokeColor(LINE)
    canvas.setLineWidth(0.75)
    canvas.line(MARGIN_L, y - 0.14 * inch, PAGE_W - MARGIN_R, y - 0.14 * inch)
    canvas.restoreState()


def draw_footer(canvas, page_num):
    canvas.saveState()
    y_line = MARGIN_B - 0.08 * inch
    canvas.setStrokeColor(LINE)
    canvas.setLineWidth(0.5)
    canvas.line(MARGIN_L, y_line, PAGE_W - MARGIN_R, y_line)
    canvas.setFont("Helvetica", 7.5)
    canvas.setFillColor(MUTED)
    canvas.drawString(
        MARGIN_L, y_line - 0.14 * inch,
        "The Flavor Factory · 2058 Second Street, Norco, CA 92860 · (951) 273-9877",
    )
    canvas.drawRightString(
        PAGE_W - MARGIN_R, y_line - 0.14 * inch,
        f"July 8 briefing · page {page_num} of {TOTAL_PAGES}",
    )
    canvas.setFont("Helvetica-Oblique", 7)
    canvas.drawCentredString(PAGE_W / 2, y_line - 0.28 * inch, "Thank you — we look forward to July 8.")
    canvas.restoreState()


def on_page(canvas, doc):
    draw_top_accent(canvas)
    draw_header(canvas)
    draw_footer(canvas, canvas.getPageNumber())


def hero_block(styles):
    data = [[
        Paragraph('<font color="#008fd3"><b>BREATH OF INNOVATION</b></font>', styles["kicker"]),
        Paragraph("Your July 8 briefing", styles["title"]),
        Paragraph("Tuesday, July 8, 2026 · Norco, California", styles["subtitle"]),
        Paragraph(OPENING, styles["body"]),
    ]]
    t = Table(data, colWidths=[6.86 * inch])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), SKY),
        ("BOX", (0, 0), (-1, -1), 0.75, colors.HexColor("#cce9f7")),
        ("LEFTPADDING", (0, 0), (-1, -1), 14),
        ("RIGHTPADDING", (0, 0), (-1, -1), 14),
        ("TOPPADDING", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
    ]))
    return t


def arrive_callout(styles):
    t = Table([[Paragraph(ARRIVE_NOTE, styles["callout"])]], colWidths=[6.86 * inch])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.white),
        ("BOX", (0, 0), (-1, -1), 1, BLUE),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
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
    t = Table(data, colWidths=[0.72 * inch, 1.18 * inch, 4.96 * inch])
    style_cmds = [
        ("BACKGROUND", (0, 0), (-1, 0), INK),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("BOX", (0, 0), (-1, -1), 0.5, LINE),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, LINE),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 7),
        ("RIGHTPADDING", (0, 0), (-1, -1), 7),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]
    for r in range(1, len(rows)):
        if r % 2 == 0:
            style_cmds.append(("BACKGROUND", (0, r), (-1, r), PAPER))
    t.setStyle(TableStyle(style_cmds))
    return t


def pillar_grid(styles):
    cells = []
    for i, (title, desc) in enumerate(PILLARS):
        color = PILLAR_COLORS[i]
        hex_color = color.hexval() if hasattr(color, "hexval") else "#008fd3"
        cells.append(Paragraph(
            f'<b>{title}</b><br/><font size="8" color="#5c6678">{desc}</font>',
            styles["body"],
        ))
    t = Table([cells[:2], cells[2:]], colWidths=[3.38 * inch, 3.38 * inch], rowHeights=[0.52 * inch, 0.52 * inch])
    cmds = [
        ("BOX", (0, 0), (-1, -1), 0.5, LINE),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, LINE),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ("BACKGROUND", (0, 0), (-1, -1), colors.white),
    ]
    for i, color in enumerate(PILLAR_COLORS):
        row, col = divmod(i, 2)
        cmds.append(("LINEBELOW", (col, row), (col, row), 3, color))
    t.setStyle(TableStyle(cmds))
    return t


def tinted_box(content, bg, border, width_in=6.86):
    t = Table([[content]], colWidths=[width_in * inch])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), bg),
        ("BOX", (0, 0), (-1, -1), 0.75, border),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ]))
    return t


def innovation_block(styles):
    rows = [[Paragraph(f"• {item}", styles["bullet"])] for item in INNOVATION_ITEMS]
    inner = Table(rows, colWidths=[6.5 * inch])
    inner.setStyle(TableStyle([
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 1),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 1),
    ]))
    return tinted_box(inner, MINT, GREEN)


def questions_two_col(styles):
    data = []
    for i in range(5):
        data.append([
            Paragraph(f'<font color="#6c5ce7"><b>{i + 1}.</b></font> {STRATEGIC_QUESTIONS[i]}', styles["qcompact"]),
            Paragraph(f'<font color="#6c5ce7"><b>{i + 6}.</b></font> {STRATEGIC_QUESTIONS[i + 5]}', styles["qcompact"]),
        ])
    t = Table(data, colWidths=[3.35 * inch, 3.35 * inch])
    t.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("BACKGROUND", (0, 0), (-1, -1), LAVENDER),
        ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#d8d2f0")),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e8e4f4")),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]))
    return t


def outcomes_block(styles):
    rows = [[Paragraph(f"✓  {item}", styles["bullet"])] for item in OUTCOMES_TB]
    inner = Table(rows, colWidths=[6.5 * inch])
    inner.setStyle(TableStyle([
        ("TEXTCOLOR", (0, 0), (-1, -1), INK),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
    ]))
    return tinted_box(inner, SKY, BLUE)


def build():
    if not os.path.isfile(TFF_LOGO) or not os.path.isfile(TB_LOGO):
        from _prepare_july8_logos import main as prep_logos  # noqa: would fail - use subprocess
        import subprocess
        subprocess.run(["python3", os.path.join(ROOT, "_prepare-july8-logos.py")], check=True)

    styles = build_styles()
    frame = Frame(
        MARGIN_L, MARGIN_B, PAGE_W - MARGIN_L - MARGIN_R, PAGE_H - MARGIN_T - MARGIN_B,
        id="main", leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0,
    )
    doc = BaseDocTemplate(
        OUT, pagesize=letter,
        title="July 8 Briefing · TFF × TheraBreath",
        author="The Flavor Factory",
    )
    doc.addPageTemplates([PageTemplate(id="all", frames=[frame], onPage=on_page)])

    story = []

    # Page 1
    story.append(hero_block(styles))
    story.append(Spacer(1, 0.08 * inch))
    story.append(arrive_callout(styles))
    story.append(Spacer(1, 0.1 * inch))
    story.append(Paragraph("YOUR DAY", styles["kicker"]))
    story.append(agenda_table(styles))
    story.append(Spacer(1, 0.1 * inch))
    story.append(Paragraph("FOUR PILLARS · 9:30", styles["kicker"]))
    story.append(pillar_grid(styles))
    story.append(Spacer(1, 0.08 * inch))
    story.append(Paragraph("TOPICS WE WILL COVER", styles["kicker"]))
    for title, desc in TOPICS_COMPACT:
        story.append(Paragraph(f"<b>{title}</b> — {desc}", styles["topic"]))
    story.append(Spacer(1, 0.06 * inch))
    story.append(Paragraph("INNOVATION · FLAVOR PARTNER", styles["kicker"]))
    story.append(innovation_block(styles))

    # Page 2
    story.append(PageBreak())
    story.append(Paragraph("TEN QUESTIONS FOR YOUR TEAM", styles["kicker"]))
    story.append(Paragraph("<i>No prep deck — bring your real answers.</i>", styles["muted"]))
    story.append(Spacer(1, 0.05 * inch))
    story.append(questions_two_col(styles))
    story.append(Spacer(1, 0.1 * inch))
    story.append(Paragraph("WHAT YOU SHOULD LEAVE WITH", styles["kicker"]))
    story.append(outcomes_block(styles))

    doc.build(story)
    print("Wrote", OUT)


if __name__ == "__main__":
    build()
