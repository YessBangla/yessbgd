"""
Yess Bangla — Company Profile generator (PDF + DOCX).

Produces a 17-page document in two formats from a single content model.
- PDF: clickable Contents page (anchors → sections), bookmark outline,
  semantic heading order, /Lang + tagged metadata, alt-text for images.
- DOCX: identical 17-page structure, with the official letterhead JPEG
  anchored as a full-page background on every page (behindDoc=1).
"""
from __future__ import annotations
import datetime
import os
from copy import deepcopy

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, PageBreak,
    Table, TableStyle, Image as RLImage, KeepTogether,
)
from reportlab.platypus.tableofcontents import TableOfContents
from reportlab.pdfgen import canvas as _canvas

from docx import Document
from docx.shared import Pt, Mm, Cm, RGBColor, Emu
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn, nsmap
from docx.oxml import OxmlElement

LETTERHEAD = "/dev-server/public/yess-bangla-letterhead.jpeg"
PDF_OUT = "/dev-server/public/yess-bangla-company-profile.pdf"
DOCX_OUT = "/dev-server/public/yess-bangla-company-profile.docx"

VERSION = "v1.0"
GENERATED = datetime.date.today().strftime("%d %B %Y")
DOC_TITLE = "Yess Bangla — Company Profile"
DOC_AUTHOR = "Yess Bangla Private Limited"

# ---------------------------------------------------------------------------
# Content model — list of sections; first two are special (cover + contents).
# ---------------------------------------------------------------------------

SECTIONS = [
    {
        "id": "cover",
        "kind": "cover",
        "number": None,
        "title": "Company Profile",
    },
    {
        "id": "contents",
        "kind": "contents",
        "number": None,
        "title": "Contents",
    },
    {"id": "sec01", "number": "01", "title": "Message from the Management",
     "body": [
        ("p", "At Yess Bangla, we believe a modern Bangladesh deserves a modern enterprise group — one that combines the discipline of international business with deep local insight. Over the past several years we have built a portfolio of complementary ventures spanning software, broadcast television, OTT streaming, digital journalism, organic commerce, professional services, hosting, events, talent and food — all engineered to operate to international standards while remaining rooted in the communities we serve."),
        ("p", "Our promise to clients, partners, regulators and audiences is simple: integrity in every transaction, craft in every product, and responsibility in every public action. We invest in our people, in our technology stack and in long-term relationships because that is how durable companies are built."),
        ("p", "Whether you are a multinational evaluating a partner in South Asia, a Bangladeshi enterprise modernising your operations, or an investor considering long-term collaboration, this document offers a faithful account of who we are, what we do, and the standards we hold ourselves to."),
        ("p", "— The Board of Directors, Yess Bangla Private Limited"),
     ]},
    {"id": "sec02", "number": "02", "title": "About Yess Bangla",
     "body": [
        ("p", "Yess Bangla Private Limited is a Bangladesh-incorporated private company headquartered in Mirpur, Dhaka. The group operates eleven wholly-owned and managed ventures spanning four strategic domains: Technology, Media & Broadcasting, Commerce & Lifestyle, and Professional Services."),
        ("p", "We design, build and operate digital products and services for enterprise clients, government bodies, broadcasters, advertisers and consumers. The group's combined infrastructure — engineering teams, broadcast facilities, editorial newsroom, cloud platform, logistics network and event production capability — gives us the unusual ability to take an idea from concept to nationwide rollout entirely in-house."),
        ("h3", "At a glance"),
        ("kv", [
            ("Headquarters", "Dhaka, Bangladesh"),
            ("Group ventures", "11 specialised brands"),
            ("Domains", "Technology · Media · Commerce · Services"),
            ("Engagement model", "Project, retainer, managed services, partnership"),
            ("Reach", "Nationwide Bangladesh, with diaspora & export channels"),
            ("Languages", "Bangla · English"),
        ]),
     ]},
    {"id": "sec03", "number": "03", "title": "Vision, Mission & Values",
     "body": [
        ("h3", "Vision"),
        ("p", "To be South Asia's most trusted integrated enterprise group — building products, media and services that improve everyday life and earn international respect for Bangladeshi craftsmanship."),
        ("h3", "Mission"),
        ("ul", [
            "Deliver world-class technology and media to Bangladeshi clients and audiences.",
            "Operate every venture with full legal, ethical and editorial integrity.",
            "Invest continuously in our people, processes and platforms.",
            "Create durable economic value for clients, employees, partners and shareholders.",
        ]),
        ("h3", "Core values"),
        ("dl", [
            ("Integrity.", "We say what we mean, deliver what we promise, and disclose what we know."),
            ("Craft.", "We hold ourselves to international standards in engineering, journalism and design."),
            ("Responsibility.", "We weigh the social and editorial consequences of every public action."),
            ("Service.", "Clients, audiences and partners are the centre of every operating decision."),
            ("Innovation.", "We back disciplined experimentation, not slogans."),
        ]),
     ]},
    {"id": "sec04", "number": "04", "title": "Corporate Structure",
     "body": [
        ("p", "Yess Bangla Private Limited is the parent holding company. Each venture is operated as a focused business unit with its own brand, leadership, P&L and editorial or product roadmap, while sharing central finance, HR, legal, infrastructure and brand governance functions at group level."),
        ("table", {
            "header": ["Domain", "Ventures", "Function"],
            "rows": [
                ["Technology", "Yess Soft · Yess Host", "Software engineering, web/mobile, ERP/CRM, cloud hosting"],
                ["Media & Broadcasting", "Akash TV · Akash OTT · The Daily Akash", "Satellite TV, OTT streaming, digital newspaper"],
                ["Commerce & Lifestyle", "Yess Organic Haat · Yess Food · Yess Model", "Organic marketplace, F&B, talent agency"],
                ["Professional Services", "Yess Service · Yess Event · Yess All in One Solution", "Home services, event management, integrated solutions"],
            ],
        }),
     ]},
    {"id": "sec05", "number": "05", "title": "Business Verticals & Ventures",
     "body": [
        ("p", "Each Yess Bangla venture is a stand-alone brand, with its own clients, products and editorial or product roadmap. Together they form an integrated portfolio that can address almost any modern business or consumer need."),
        ("dl", [
            ("Yess Soft · Software & IT Solutions", "Custom software, web and mobile applications, ERP, CRM and enterprise systems built for modern businesses across Bangladesh and beyond."),
            ("Akash TV · Satellite Television", "A leading Bangla-language satellite channel delivering news, entertainment, talk shows and cultural programming to millions of viewers."),
            ("Akash OTT · Streaming Platform", "A multi-device streaming service offering on-demand entertainment, originals, live channels and curated catalogues for Bangladeshi audiences worldwide."),
            ("The Daily Akash · Digital Newspaper", "An independent, digital-first national daily covering politics, business, sport, culture and technology with verified journalism and original reporting."),
            ("Yess Organic Haat · Organic Marketplace", "A direct-to-consumer organic marketplace connecting verified Bangladeshi farmers with urban households through cold-chain logistics and quality assurance."),
            ("Yess Service · Home & Professional Services", "An on-demand network of vetted electricians, plumbers, technicians, cleaners and tutors, backed by service guarantees and digital booking."),
            ("Yess Host · Hosting & Cloud Infrastructure", "Managed shared, VPS, cloud and dedicated hosting with local data residency, 24/7 monitoring and enterprise-grade security."),
        ]),
        ("pagebreak", None),
        ("dl", [
            ("Yess Event · Event Management", "Full-service event production for corporate launches, conferences, broadcast events, weddings and government programmes."),
            ("Yess Model · Modeling & Talent Agency", "A talent agency representing models, presenters and creators across advertising, broadcast, fashion and digital campaigns."),
            ("Yess Food · Food & Beverage", "An F&B brand bringing authentic Bangladeshi flavours to modern outlets and packaged formats, with rigorous quality and hygiene standards."),
            ("Yess All in One Solution · Integrated Business Solutions", "A single point of contact for clients who want to combine multiple Yess Bangla services into a coordinated programme of work."),
        ]),
     ]},
    {"id": "sec06", "number": "06", "title": "Capabilities & Service Lines",
     "body": [
        ("dl", [
            ("Software engineering", "Custom enterprise software, ERP, CRM, e-commerce, fintech, EdTech and bespoke web/mobile apps."),
            ("Broadcast media", "Satellite television production, news bulletins, talk shows, cultural programming and broadcast advertising."),
            ("Digital streaming", "OTT platform engineering, content packaging, DRM, monetisation, multi-device playback and subscriber operations."),
            ("Editorial & journalism", "National digital newsroom, investigative reporting, multimedia storytelling and editorial standards aligned with international press codes."),
            ("Cloud & infrastructure", "Managed hosting, cloud architecture, DevOps, cybersecurity, SLA-backed monitoring and disaster recovery."),
            ("E-commerce & logistics", "Direct-to-consumer marketplaces, supplier onboarding, cold-chain handling, last-mile delivery and digital payments."),
            ("Professional services", "On-demand home and business services, event production, talent management and integrated cross-venture programmes."),
            ("Brand, design & content", "Identity systems, art direction, photography, video, motion graphics and integrated campaigns across earned and paid media."),
        ]),
     ]},
    {"id": "sec07", "number": "07", "title": "Technology & Quality Standards",
     "body": [
        ("p", "We engineer and operate to international standards. Our platforms are built on modern, supported technology with documented architecture, automated testing, code review and continuous deployment. Our broadcast and editorial operations follow internationally recognised codes for accuracy, fairness and source protection."),
        ("h3", "Engineering"),
        ("ul", [
            "TypeScript / Node.js · React · Next.js · TanStack · Tailwind for product engineering.",
            "PostgreSQL · Redis · S3-compatible storage · serverless and container workloads.",
            "Cloud-native deployments on AWS, GCP and on-prem with infrastructure-as-code.",
            "Mandatory code review, unit + integration tests, accessibility (WCAG 2.2 AA) and Lighthouse performance budgets.",
            "Security: OWASP ASVS-aligned reviews, secrets management, RBAC and audited access logs.",
        ]),
        ("h3", "Broadcast & editorial"),
        ("ul", [
            "Editorial standards based on internationally recognised press codes.",
            "Two-source verification policy for original reporting; corrections issued transparently.",
            "Source protection, contributor safety and on-call legal review for sensitive stories.",
            "Broadcast technical standards: HD ingest, redundant playout, captioned content where required.",
        ]),
        ("h3", "Operations"),
        ("ul", [
            "Documented Standard Operating Procedures across finance, HR, IT and editorial.",
            "Quarterly internal review and continuous improvement cycle.",
            "Vendor due-diligence and KYC for all material counterparties.",
        ]),
     ]},
    {"id": "sec08", "number": "08", "title": "Clients, Audience & Market Reach",
     "body": [
        ("p", "Our clients and audiences span enterprise, government, SME, consumer and diaspora segments. The combined Yess Bangla ecosystem reaches Bangladeshi viewers, readers, shoppers and professionals every day, in every major division of the country and across the Bengali-speaking diaspora."),
        ("table", {
            "header": ["Segment", "Examples", "Engagement"],
            "rows": [
                ["Enterprise", "Banks, telcos, manufacturers, conglomerates", "Custom platforms, managed services, retainers"],
                ["Government & NGO", "Public agencies, development partners", "RFP delivery, civic media, infrastructure"],
                ["SME & startups", "Growth-stage Bangladeshi businesses", "Web, mobile, hosting, brand, content"],
                ["Consumers", "Urban and peri-urban households", "TV, OTT, news, organic groceries, services"],
                ["Advertisers", "Local and global brands", "On-air and digital media inventory across Akash TV / OTT / Daily Akash"],
            ],
        }),
     ]},
    {"id": "sec09", "number": "09", "title": "Track Record & Milestones",
     "body": [
        ("dl", [
            ("Foundation", "Yess Bangla Private Limited incorporated in Dhaka with a long-term vision of building an integrated Bangladeshi enterprise group."),
            ("Technology launch", "Yess Soft and Yess Host established to deliver enterprise software and managed hosting to Bangladeshi clients."),
            ("Media expansion", "Akash TV satellite channel launched, followed by Akash OTT streaming and The Daily Akash digital newspaper."),
            ("Commerce & lifestyle", "Yess Organic Haat, Yess Food and Yess Model launched to bring quality consumer products and talent representation to market."),
            ("Service network", "Yess Service, Yess Event and Yess All in One Solution rolled out to deliver on-demand professional services across Bangladesh."),
            ("Group consolidation", "All ventures unified under a single brand governance framework with shared standards in finance, IT, legal and HR."),
        ]),
     ]},
    {"id": "sec10", "number": "10", "title": "Corporate Social Responsibility",
     "body": [
        ("p", "Yess Bangla treats responsible business as a core operating principle, not an afterthought. We invest a portion of group revenue into long-term programmes that strengthen the communities we serve."),
        ("dl", [
            ("Digital literacy.", "Free workshops and training material to help students, women entrepreneurs and small business owners adopt digital tools."),
            ("Public-interest journalism.", "The Daily Akash and Akash TV commit airtime and column space to under-reported stories of national importance."),
            ("Farmer livelihoods.", "Yess Organic Haat works directly with smallholder farmers, paying transparent prices and investing in cold-chain training."),
            ("Workforce inclusion.", "Equal-opportunity recruitment, on-the-job training and pathways for fresh graduates from outside the capital."),
            ("Environment.", "Energy-efficient infrastructure, paperless operations and active reduction of single-use packaging across our supply chain."),
        ]),
     ]},
    {"id": "sec11", "number": "11", "title": "Compliance, Governance & Confidentiality",
     "body": [
        ("h3", "Corporate governance"),
        ("ul", [
            "Board of Directors with formally documented roles and meeting cadence.",
            "Annual statutory audit by an independent chartered accountancy firm.",
            "Conflict-of-interest, anti-bribery and gifts & hospitality policies.",
            "Whistleblower channel for confidential reporting of misconduct.",
        ]),
        ("h3", "Regulatory compliance"),
        ("ul", [
            "Registered with the Registrar of Joint Stock Companies and Firms (RJSC), Bangladesh.",
            "Tax-registered (TIN, VAT) and compliant with annual filing obligations.",
            "Broadcast operations follow the licensing and content rules of relevant national authorities.",
            "Editorial output adheres to the Press Council of Bangladesh code of conduct.",
        ]),
        ("h3", "Data protection & confidentiality"),
        ("ul", [
            "Documented information-security policy covering access, storage and incident response.",
            "Mutual NDA available for all client engagements; client data is not used for internal training without explicit consent.",
            "Right-of-correction and data-removal requests handled by a named Data Protection contact.",
        ]),
     ]},
    {"id": "sec12", "number": "12", "title": "Leadership Team",
     "body": [
        ("p", "The group is led by a small, accountable executive team supported by venture-level managing directors and functional heads across finance, operations, technology, editorial and brand."),
        ("table", {
            "header": ["Function", "Responsibility"],
            "rows": [
                ["Board of Directors", "Strategy, capital allocation, governance, risk oversight"],
                ["Group Managing Director", "Operating performance and cross-venture coordination"],
                ["Chief Operating Officer", "Day-to-day operations, SLAs, vendor management"],
                ["Chief Technology Officer", "Engineering standards, security, platform roadmap"],
                ["Editor-in-Chief (Media)", "Editorial integrity across Akash TV, OTT and Daily Akash"],
                ["Head of Finance", "Treasury, audit, statutory compliance"],
                ["Head of People & Culture", "Recruitment, training, welfare, diversity"],
                ["Head of Brand & Communications", "Group identity, PR, partnership marketing"],
            ],
        }),
        ("p", "Detailed CVs of named officers are available on request, subject to mutual NDA."),
     ]},
    {"id": "sec13", "number": "13", "title": "Why Choose Yess Bangla",
     "body": [
        ("dl", [
            ("One partner, many capabilities.", "Software, broadcast, OTT, journalism, e-commerce, hosting, services and events under a single brand and contract framework."),
            ("Local depth, international standards.", "Deep Bangladeshi market knowledge combined with internationally recognised engineering, editorial and operational practices."),
            ("Accountable governance.", "Documented policies, statutory audit, named functional leads and a board that meets regularly."),
            ("End-to-end delivery.", "From discovery and architecture through build, launch, operation and continuous improvement — all in-house."),
            ("Long-term relationships.", "We design for durability — clients, employees and partners stay with us because we treat the relationship as the product."),
        ]),
     ]},
    {"id": "sec14", "number": "14", "title": "Contact & Engagement",
     "body": [
        ("p", "We welcome enquiries from enterprise clients, government and development partners, advertisers, investors and prospective employees. Initial discussions are confidential and obligation-free."),
        ("h3", "Yess Bangla Private Limited"),
        ("kv", [
            ("Office", "Block-A, Road-3, House-127 (Green View), 1st Floor, Mirpur-12, Dhaka-1216"),
            ("Corporate office", "Section-11, Block-A, Main Road-3, Plot-10, Mirpur, Pallabi, Dhaka-1216"),
            ("Cell", "+880 1805-464343"),
            ("Email", "yessbangla.bd@gmail.com"),
            ("Web", "www.yessbd.com"),
        ]),
        ("p", "This document is the property of Yess Bangla Private Limited. It is provided in confidence for evaluation purposes only and may not be reproduced, redistributed or quoted in part or whole without prior written consent."),
     ]},
]

NAVY = HexColor("#0E2A3A")
TEAL = HexColor("#0F4C5C")
GOLD = HexColor("#C9A24A")
INK = HexColor("#1A1A1A")
MUTED = HexColor("#5A5A5A")

# ===========================================================================
# PDF
# ===========================================================================

PAGE_W, PAGE_H = A4
M_LEFT = 22 * mm
M_RIGHT = 22 * mm
M_TOP = 47 * mm  # below the printed letterhead band
M_BOTTOM = 32 * mm

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="Body", parent=styles["BodyText"], fontName="Helvetica",
                          fontSize=10.5, leading=15, textColor=INK, spaceAfter=6))
styles.add(ParagraphStyle(name="H1", parent=styles["Heading1"], fontName="Helvetica-Bold",
                          fontSize=20, leading=24, textColor=NAVY, spaceAfter=14))
styles.add(ParagraphStyle(name="H2", parent=styles["Heading2"], fontName="Helvetica-Bold",
                          fontSize=15, leading=19, textColor=NAVY, spaceBefore=4, spaceAfter=10))
styles.add(ParagraphStyle(name="H3", parent=styles["Heading3"], fontName="Helvetica-Bold",
                          fontSize=11.5, leading=15, textColor=TEAL, spaceBefore=8, spaceAfter=4))
styles.add(ParagraphStyle(name="CoverTitle", parent=styles["Title"], fontName="Helvetica-Bold",
                          fontSize=30, leading=36, textColor=NAVY))
styles.add(ParagraphStyle(name="CoverLede", parent=styles["BodyText"], fontName="Helvetica",
                          fontSize=12, leading=18, textColor=INK))
styles.add(ParagraphStyle(name="Bullet2", parent=styles["Body"], leftIndent=14, bulletIndent=2))
styles.add(ParagraphStyle(name="TocItem", parent=styles["Body"], fontSize=11.5, leading=20,
                          textColor=NAVY))


class ProfileDocTemplate(BaseDocTemplate):
    """BaseDocTemplate that paints the letterhead background + footer."""

    def __init__(self, filename, **kw):
        super().__init__(filename, pagesize=A4, leftMargin=M_LEFT, rightMargin=M_RIGHT,
                         topMargin=M_TOP, bottomMargin=M_BOTTOM,
                         title=DOC_TITLE, author=DOC_AUTHOR,
                         subject="Company profile",
                         creator="Yess Bangla document engine",
                         keywords="Yess Bangla, company profile, Bangladesh")
        frame = Frame(self.leftMargin, self.bottomMargin,
                      self.width, self.height, id="content",
                      leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
        self.addPageTemplates([PageTemplate(id="main", frames=[frame],
                                            onPage=self._on_page)])
        # Tag PDF with language + display title.
        self._page_anchors: dict[str, int] = {}

    def _on_page(self, canvas: _canvas.Canvas, doc):
        canvas.saveState()
        # Letterhead full-page background.
        try:
            canvas.drawImage(LETTERHEAD, 0, 0, width=PAGE_W, height=PAGE_H,
                             preserveAspectRatio=False, mask="auto")
        except Exception:
            pass
        # Meta strap placed in the safe band BELOW the printed letterhead logo
        # (header) and ABOVE the printed navy footer band (footer): we put it
        # just above the navy band in the lower margin so it never collides
        # with letterhead artwork.
        meta_y = M_BOTTOM - 6 * mm  # ~26 mm from page bottom
        canvas.setFont("Helvetica", 7.5)
        canvas.setFillColor(MUTED)
        canvas.drawString(M_LEFT, meta_y,
                          f"Confidential · For intended recipient")
        canvas.drawCentredString(PAGE_W / 2, meta_y,
                                 f"Company Profile · {VERSION} · {GENERATED}")
        canvas.drawRightString(PAGE_W - M_RIGHT, meta_y, f"Page {doc.page}")
        canvas.restoreState()

    def afterFlowable(self, flowable):
        # Capture bookmark target page for the manual TOC.
        if hasattr(flowable, "_bookmarkName"):
            self.canv.bookmarkPage(flowable._bookmarkName)
            self.canv.addOutlineEntry(getattr(flowable, "_outlineText", flowable._bookmarkName),
                                      flowable._bookmarkName,
                                      level=getattr(flowable, "_outlineLevel", 0),
                                      closed=False)


def kv_table(rows):
    data = [[Paragraph(f"<b>{k}</b>", styles["Body"]),
             Paragraph(v, styles["Body"])] for k, v in rows]
    t = Table(data, colWidths=[55 * mm, None])
    t.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("TOPPADDING", (0, 0), (-1, -1), 2),
        ("LINEBELOW", (0, 0), (-1, -2), 0.25, HexColor("#E2E2E2")),
    ]))
    return t


def data_table(spec):
    header = spec["header"]
    rows = spec["rows"]
    data = [[Paragraph(f"<b>{c}</b>", styles["Body"]) for c in header]]
    for r in rows:
        data.append([Paragraph(c, styles["Body"]) for c in r])
    n = len(header)
    if n == 3:
        widths = [38 * mm, 60 * mm, None]
    else:
        widths = [60 * mm, None]
    t = Table(data, colWidths=widths, repeatRows=1)
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), HexColor("#F1F4F7")),
        ("TEXTCOLOR", (0, 0), (-1, 0), NAVY),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("LINEBELOW", (0, 0), (-1, -1), 0.25, HexColor("#D6D9DC")),
        ("BOX", (0, 0), (-1, -1), 0.4, HexColor("#C7CCD1")),
    ]))
    return t


class AnchorPara(Paragraph):
    """Paragraph that registers itself as a PDF bookmark anchor."""
    def __init__(self, text, style, anchor: str, outline_level: int = 0,
                 outline_text: str | None = None):
        super().__init__(text, style)
        self._bookmarkName = anchor
        self._outlineLevel = outline_level
        self._outlineText = outline_text or text


def build_pdf():
    doc = ProfileDocTemplate(PDF_OUT)
    story = []

    # ---- Cover (page 1) ------------------------------------------------
    cover = SECTIONS[0]
    story.append(Spacer(1, 6 * mm))
    story.append(AnchorPara("Company Profile", styles["CoverTitle"],
                            anchor="cover", outline_level=0, outline_text="Cover"))
    story.append(Spacer(1, 4 * mm))
    story.append(Paragraph(
        "Yess Bangla Private Limited — an integrated enterprise group delivering "
        "software, broadcast media, digital streaming, journalism, organic commerce, "
        "professional services and lifestyle brands across Bangladesh and beyond.",
        styles["CoverLede"]))
    story.append(Spacer(1, 8 * mm))
    story.append(kv_table([
        ("Legal name", "Yess Bangla Private Limited"),
        ("Incorporation", "Private Limited Company, Bangladesh"),
        ("Registered office", "Block-A, Road-3, House-127 (Green View), 1st Floor, Mirpur-12, Dhaka-1216"),
        ("Corporate office", "Section-11, Block-A, Main Road-3, Plot-10, Mirpur, Pallabi, Dhaka-1216"),
        ("Cell", "+880 1805-464343"),
        ("Email", "yessbangla.bd@gmail.com"),
        ("Web", "www.yessbd.com"),
        ("Sector", "Technology · Media · Broadcasting · E-commerce · Lifestyle services"),
        ("Operating ventures", "11 specialised brands under one parent company"),
        ("Document version", f"{VERSION} · Generated {GENERATED}"),
    ]))
    story.append(Spacer(1, 6 * mm))
    story.append(Paragraph(
        "<i>This profile is the property of Yess Bangla Private Limited and is shared "
        "in confidence with intended recipients for evaluation, partnership and "
        "procurement purposes.</i>", styles["Body"]))
    story.append(PageBreak())

    # ---- Contents (page 2) — clickable links --------------------------
    story.append(AnchorPara("Contents", styles["H1"], anchor="contents",
                            outline_level=0, outline_text="Contents"))
    toc_rows = []
    for s in SECTIONS:
        if s["kind"] if "kind" in s else None:
            continue
        num = s["number"]
        title = s["title"]
        link = (
            f'<a href="#{s["id"]}" color="#0E2A3A">'
            f'<b>{num}</b> &nbsp; {title}'
            f'</a>'
        )
        toc_rows.append([Paragraph(link, styles["TocItem"])])
    toc_table = Table(toc_rows, colWidths=[None])
    toc_table.setStyle(TableStyle([
        ("LINEBELOW", (0, 0), (-1, -1), 0.25, HexColor("#E2E2E2")),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
    ]))
    story.append(toc_table)
    story.append(PageBreak())

    # ---- Sections ------------------------------------------------------
    for s in SECTIONS[2:]:
        title = f'{s["number"]} · {s["title"]}'
        story.append(AnchorPara(title, styles["H2"], anchor=s["id"],
                                outline_level=0, outline_text=title))
        for kind, payload in s["body"]:
            if kind == "p":
                story.append(Paragraph(payload, styles["Body"]))
            elif kind == "h3":
                story.append(Paragraph(payload, styles["H3"]))
            elif kind == "ul":
                for item in payload:
                    story.append(Paragraph(item, styles["Bullet2"], bulletText="•"))
            elif kind == "dl":
                for k, v in payload:
                    story.append(Paragraph(f"<b>{k}</b> &nbsp;{v}", styles["Body"]))
            elif kind == "kv":
                story.append(kv_table(payload))
            elif kind == "table":
                story.append(data_table(payload))
            elif kind == "pagebreak":
                story.append(PageBreak())
        story.append(PageBreak())

    # Drop trailing blank page from final PageBreak.
    if story and isinstance(story[-1], PageBreak):
        story.pop()

    doc.build(story)

    # Patch /Lang into the PDF catalog for screen readers.
    _add_lang_to_pdf(PDF_OUT, "en-GB")
    print(f"[pdf]  wrote {PDF_OUT} ({os.path.getsize(PDF_OUT):,} bytes)")


def _add_lang_to_pdf(path, lang):
    """Inject /Lang and /ViewerPreferences/DisplayDocTitle into the catalog."""
    from pypdf import PdfReader, PdfWriter
    from pypdf.generic import NameObject, TextStringObject, BooleanObject, DictionaryObject
    reader = PdfReader(path)
    writer = PdfWriter(clone_from=reader)
    writer._root_object[NameObject("/Lang")] = TextStringObject(lang)
    vp = DictionaryObject()
    vp[NameObject("/DisplayDocTitle")] = BooleanObject(True)
    writer._root_object[NameObject("/ViewerPreferences")] = vp
    with open(path, "wb") as f:
        writer.write(f)


# ===========================================================================
# DOCX
# ===========================================================================

W_NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
R_NS = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
A_NS = "http://schemas.openxmlformats.org/drawingml/2006/main"
PIC_NS = "http://schemas.openxmlformats.org/drawingml/2006/picture"
WP_NS = "http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"


def _set_run_font(run, size=11, bold=False, color=None, name="Calibri"):
    run.font.name = name
    run.font.size = Pt(size)
    run.font.bold = bold
    if color:
        run.font.color.rgb = color


def _add_heading(doc, text, level, anchor=None):
    p = doc.add_paragraph()
    p.style = doc.styles[f"Heading {level}"] if f"Heading {level}" in [s.name for s in doc.styles] else doc.styles["Heading 1"]
    if anchor:
        # Wrap in bookmark so the heading is a navigation target.
        bm_start = OxmlElement("w:bookmarkStart")
        bm_start.set(qn("w:id"), str(abs(hash(anchor)) % 100000))
        bm_start.set(qn("w:name"), anchor)
        bm_end = OxmlElement("w:bookmarkEnd")
        bm_end.set(qn("w:id"), bm_start.get(qn("w:id")))
        p._p.append(bm_start)
        run = p.add_run(text)
        p._p.append(bm_end)
    else:
        run = p.add_run(text)
    sizes = {1: 22, 2: 16, 3: 12}
    _set_run_font(run, size=sizes.get(level, 12), bold=True,
                  color=RGBColor(0x0E, 0x2A, 0x3A))
    return p


def _add_para(doc, text, size=11, bold=False, color=None, italic=False):
    p = doc.add_paragraph()
    run = p.add_run(text)
    _set_run_font(run, size=size, bold=bold, color=color)
    run.italic = italic
    p.paragraph_format.space_after = Pt(4)
    return p


def _add_bullet(doc, text):
    p = doc.add_paragraph(style="List Bullet")
    run = p.add_run(text)
    _set_run_font(run, size=10.5)
    return p


def _add_kv_table(doc, rows):
    t = doc.add_table(rows=len(rows), cols=2)
    t.autofit = False
    for i, (k, v) in enumerate(rows):
        c0, c1 = t.rows[i].cells
        c0.width = Cm(5.2)
        c1.width = Cm(11.5)
        for cell, txt, bold in ((c0, k, True), (c1, v, False)):
            cell.text = ""
            p = cell.paragraphs[0]
            run = p.add_run(txt)
            _set_run_font(run, size=10.5, bold=bold,
                          color=RGBColor(0x0E, 0x2A, 0x3A) if bold else RGBColor(0x1A, 0x1A, 0x1A))
    return t


def _add_data_table(doc, spec):
    header = spec["header"]
    rows = spec["rows"]
    t = doc.add_table(rows=1 + len(rows), cols=len(header))
    t.style = "Light Grid Accent 1"
    for i, h in enumerate(header):
        cell = t.rows[0].cells[i]
        cell.text = ""
        p = cell.paragraphs[0]
        run = p.add_run(h)
        _set_run_font(run, size=10.5, bold=True, color=RGBColor(0x0E, 0x2A, 0x3A))
    for r_idx, row in enumerate(rows, start=1):
        for c_idx, val in enumerate(row):
            cell = t.rows[r_idx].cells[c_idx]
            cell.text = ""
            p = cell.paragraphs[0]
            run = p.add_run(val)
            _set_run_font(run, size=10.5)
    return t


def _add_letterhead_background(section, image_path):
    """Anchor the letterhead JPEG to every page in this section, behind text.

    We add the picture inside the header (so it appears on every page) and
    promote it from inline to anchored with behindDoc=1, full page size.
    """
    header = section.header
    # Use a hidden paragraph inside header.
    p = header.add_paragraph()
    run = p.add_run()
    pic = run.add_picture(image_path, width=section.page_width)
    # The above adds an <w:drawing><wp:inline>...</wp:inline></w:drawing>.
    # Convert <wp:inline> to <wp:anchor behindDoc="1"> spanning the page.
    drawing = run._r.find(qn("w:drawing"))
    inline = drawing.find(qn("wp:inline"))
    # Build anchor element preserving the graphic.
    graphic = inline.find(qn("a:graphic"))
    extent = inline.find(qn("wp:extent"))
    docPr = inline.find(qn("wp:docPr"))
    # Page dimensions in EMU (1 cm = 360000 EMU).
    page_w_emu = section.page_width
    page_h_emu = section.page_height

    anchor = OxmlElement("wp:anchor")
    anchor.set("behindDoc", "1")
    anchor.set("distT", "0"); anchor.set("distB", "0")
    anchor.set("distL", "0"); anchor.set("distR", "0")
    anchor.set("simplePos", "0"); anchor.set("relativeHeight", "0")
    anchor.set("locked", "0"); anchor.set("layoutInCell", "1")
    anchor.set("allowOverlap", "1")

    simplePos = OxmlElement("wp:simplePos")
    simplePos.set("x", "0"); simplePos.set("y", "0")
    anchor.append(simplePos)

    posH = OxmlElement("wp:positionH"); posH.set("relativeFrom", "page")
    pho = OxmlElement("wp:posOffset"); pho.text = "0"
    posH.append(pho); anchor.append(posH)

    posV = OxmlElement("wp:positionV"); posV.set("relativeFrom", "page")
    pvo = OxmlElement("wp:posOffset"); pvo.text = "0"
    posV.append(pvo); anchor.append(posV)

    new_extent = OxmlElement("wp:extent")
    new_extent.set("cx", str(int(page_w_emu)))
    new_extent.set("cy", str(int(page_h_emu)))
    anchor.append(new_extent)

    effectExtent = OxmlElement("wp:effectExtent")
    for k in ("l", "t", "r", "b"):
        effectExtent.set(k, "0")
    anchor.append(effectExtent)

    wrapNone = OxmlElement("wp:wrapNone")
    anchor.append(wrapNone)

    # Update docPr with descriptive name + alt text for accessibility.
    new_docPr = deepcopy(docPr)
    new_docPr.set("name", "Yess Bangla letterhead background")
    new_docPr.set("descr",
                  "Yess Bangla Private Limited official letterhead with logo, "
                  "watermark and footer band. Decorative background.")
    new_docPr.set("title", "Letterhead")
    anchor.append(new_docPr)

    cNvGraphicFramePr = OxmlElement("wp:cNvGraphicFramePr")
    anchor.append(cNvGraphicFramePr)

    anchor.append(deepcopy(graphic))

    drawing.remove(inline)
    drawing.append(anchor)


def build_docx():
    doc = Document()

    section = doc.sections[0]
    section.page_height = Mm(297)
    section.page_width = Mm(210)
    section.top_margin = Mm(47)
    section.bottom_margin = Mm(32)
    section.left_margin = Mm(22)
    section.right_margin = Mm(22)
    section.header_distance = Mm(0)
    section.footer_distance = Mm(10)

    # Letterhead background on every page.
    _add_letterhead_background(section, LETTERHEAD)

    # Footer with page number.
    footer_p = section.footer.paragraphs[0]
    footer_p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    fld = OxmlElement("w:fldSimple")
    fld.set(qn("w:instr"), "PAGE")
    footer_run_xml = OxmlElement("w:r")
    footer_run_props = OxmlElement("w:rPr")
    sz = OxmlElement("w:sz"); sz.set(qn("w:val"), "16"); footer_run_props.append(sz)
    footer_run_xml.append(footer_run_props)
    txt = OxmlElement("w:t"); txt.text = "Page "
    footer_run_xml.append(txt)
    footer_p._p.append(footer_run_xml)
    footer_p._p.append(fld)

    # Document properties.
    doc.core_properties.title = DOC_TITLE
    doc.core_properties.author = DOC_AUTHOR
    doc.core_properties.subject = "Company profile"
    doc.core_properties.language = "en-GB"
    doc.core_properties.keywords = "Yess Bangla, company profile, Bangladesh"
    doc.core_properties.comments = f"Generated {GENERATED} · {VERSION}"

    # ---- Cover ---------------------------------------------------------
    _add_heading(doc, "Company Profile", level=1, anchor="cover")
    _add_para(doc,
              "Yess Bangla Private Limited — an integrated enterprise group "
              "delivering software, broadcast media, digital streaming, "
              "journalism, organic commerce, professional services and lifestyle "
              "brands across Bangladesh and beyond.", size=11)
    doc.add_paragraph()
    _add_kv_table(doc, [
        ("Legal name", "Yess Bangla Private Limited"),
        ("Incorporation", "Private Limited Company, Bangladesh"),
        ("Registered office", "Block-A, Road-3, House-127 (Green View), 1st Floor, Mirpur-12, Dhaka-1216"),
        ("Corporate office", "Section-11, Block-A, Main Road-3, Plot-10, Mirpur, Pallabi, Dhaka-1216"),
        ("Cell", "+880 1805-464343"),
        ("Email", "yessbangla.bd@gmail.com"),
        ("Web", "www.yessbd.com"),
        ("Sector", "Technology · Media · Broadcasting · E-commerce · Lifestyle services"),
        ("Operating ventures", "11 specialised brands under one parent company"),
        ("Document version", f"{VERSION} · Generated {GENERATED}"),
    ])
    _add_para(doc,
              "This profile is the property of Yess Bangla Private Limited and is "
              "shared in confidence with intended recipients for evaluation, "
              "partnership and procurement purposes.", size=10, italic=True,
              color=RGBColor(0x5A, 0x5A, 0x5A))
    doc.add_page_break()

    # ---- Contents (with internal hyperlinks) --------------------------
    _add_heading(doc, "Contents", level=1, anchor="contents")
    for s in SECTIONS[2:]:
        p = doc.add_paragraph()
        # Internal hyperlink: <w:hyperlink w:anchor="...">
        hl = OxmlElement("w:hyperlink")
        hl.set(qn("w:anchor"), s["id"])
        hl.set(qn("w:history"), "1")
        r = OxmlElement("w:r")
        rPr = OxmlElement("w:rPr")
        rStyle = OxmlElement("w:rStyle"); rStyle.set(qn("w:val"), "Hyperlink")
        rPr.append(rStyle)
        sz = OxmlElement("w:sz"); sz.set(qn("w:val"), "24"); rPr.append(sz)
        color = OxmlElement("w:color"); color.set(qn("w:val"), "0E2A3A"); rPr.append(color)
        u = OxmlElement("w:u"); u.set(qn("w:val"), "single"); rPr.append(u)
        r.append(rPr)
        t = OxmlElement("w:t"); t.text = f'{s["number"]}  ·  {s["title"]}'
        t.set(qn("xml:space"), "preserve")
        r.append(t)
        hl.append(r)
        p._p.append(hl)
        p.paragraph_format.space_after = Pt(6)
    doc.add_page_break()

    # ---- Sections ------------------------------------------------------
    for idx, s in enumerate(SECTIONS[2:]):
        _add_heading(doc, f'{s["number"]} · {s["title"]}', level=1, anchor=s["id"])
        for kind, payload in s["body"]:
            if kind == "p":
                _add_para(doc, payload)
            elif kind == "h3":
                _add_heading(doc, payload, level=2)
            elif kind == "ul":
                for item in payload:
                    _add_bullet(doc, item)
            elif kind == "dl":
                for k, v in payload:
                    p = doc.add_paragraph()
                    r1 = p.add_run(k + " ")
                    _set_run_font(r1, size=10.5, bold=True,
                                  color=RGBColor(0x0F, 0x4C, 0x5C))
                    r2 = p.add_run(v)
                    _set_run_font(r2, size=10.5)
            elif kind == "kv":
                _add_kv_table(doc, payload)
            elif kind == "table":
                _add_data_table(doc, payload)
            elif kind == "pagebreak":
                doc.add_page_break()
        if idx < len(SECTIONS[2:]) - 1:
            doc.add_page_break()

    doc.save(DOCX_OUT)
    print(f"[docx] wrote {DOCX_OUT} ({os.path.getsize(DOCX_OUT):,} bytes)")


if __name__ == "__main__":
    build_pdf()
    build_docx()
