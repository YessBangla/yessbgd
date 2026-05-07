import jsPDF from "jspdf";
import type { Venture } from "@/data/ventures";
import {
  getVentureCase,
  getVentureMilestones,
  getVenturePackages,
  getVentureFaqs,
} from "@/data/ventures";
import logoUrl from "@/assets/yess-bangla-logo.jpeg";

const PAGE_W = 210; // A4 mm
const PAGE_H = 297;
const MARGIN = 18;
const HEADER_H = 28;
const FOOTER_H = 22;
const CONTENT_W = PAGE_W - MARGIN * 2;
const TOP_Y = HEADER_H + 8;
const BOTTOM_Y = PAGE_H - FOOTER_H - 4;

// Cache logo data URL across calls
let logoDataUrl: string | null = null;
async function loadLogo(): Promise<string | null> {
  if (logoDataUrl) return logoDataUrl;
  try {
    const res = await fetch(logoUrl);
    const blob = await res.blob();
    logoDataUrl = await new Promise<string>((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result as string);
      r.onerror = reject;
      r.readAsDataURL(blob);
    });
    return logoDataUrl;
  } catch {
    return null;
  }
}

function drawLetterhead(doc: jsPDF, logo: string | null, subtitle: string) {
  // Top header band
  doc.setFillColor(15, 35, 80);
  doc.rect(0, 0, PAGE_W, HEADER_H, "F");
  // Accent strip
  doc.setFillColor(232, 184, 64);
  doc.rect(0, HEADER_H, PAGE_W, 1.2, "F");

  // Logo
  if (logo) {
    try {
      doc.addImage(logo, "JPEG", MARGIN, 5, 18, 18);
    } catch {
      /* ignore */
    }
  }

  // Company name + tagline
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("YESS BANGLA", MARGIN + 22, 12);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(220, 226, 240);
  doc.text("Enterprise Solutions · Media · Technology", MARGIN + 22, 17.5);
  doc.text(subtitle, MARGIN + 22, 22.5);

  // Right side meta
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text("ENTERPRISE BRIEF", PAGE_W - MARGIN, 12, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(220, 226, 240);
  doc.text(
    new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    PAGE_W - MARGIN,
    17.5,
    { align: "right" },
  );
  doc.text("Confidential · For intended recipient", PAGE_W - MARGIN, 22.5, {
    align: "right",
  });
}

function drawWatermark(doc: jsPDF, logo: string | null) {
  if (!logo) return;
  try {
    // Large faded center watermark
    // jsPDF supports GState via internal; fallback: draw at light scale
    const gs = (doc as unknown as {
      GState?: new (opts: { opacity: number }) => unknown;
      setGState?: (s: unknown) => void;
    });
    if (gs.GState && gs.setGState) {
      gs.setGState(new gs.GState({ opacity: 0.05 }));
    }
    const size = 110;
    doc.addImage(
      logo,
      "JPEG",
      (PAGE_W - size) / 2,
      (PAGE_H - size) / 2,
      size,
      size,
    );
    if (gs.GState && gs.setGState) {
      gs.setGState(new gs.GState({ opacity: 1 }));
    }
  } catch {
    /* ignore */
  }
}

function drawFooter(doc: jsPDF, pageNum: number, total: number, slug: string) {
  const top = PAGE_H - FOOTER_H;
  doc.setDrawColor(232, 184, 64);
  doc.setLineWidth(0.4);
  doc.line(MARGIN, top, PAGE_W - MARGIN, top);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(15, 35, 80);
  doc.text("YESS Bangla Ltd.", MARGIN, top + 5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.8);
  doc.setTextColor(70, 70, 70);
  doc.text(
    "Block A, Road 3, House 127, Mirpur 12, Dhaka 1216, Bangladesh",
    MARGIN,
    top + 9.5,
  );
  doc.text(
    "Email: yessbangla.bd@gmail.com   ·   Phone: +880 1805-464343",
    MARGIN,
    top + 13.5,
  );
  doc.text("Web: https://yessbgd.lovable.app/ventures/" + slug, MARGIN, top + 17.5);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(15, 35, 80);
  doc.text(`Page ${pageNum} of ${total}`, PAGE_W - MARGIN, top + 9.5, {
    align: "right",
  });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(140, 140, 140);
  doc.text("© " + new Date().getFullYear() + " YESS Bangla", PAGE_W - MARGIN, top + 13.5, {
    align: "right",
  });
}

export async function downloadVentureBrief(v: Venture) {
  const logo = await loadLogo();
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let y = TOP_Y;

  const newPage = () => {
    doc.addPage();
    drawLetterhead(doc, logo, v.category.toUpperCase() + " · " + v.title);
    drawWatermark(doc, logo);
    y = TOP_Y;
  };

  const ensureSpace = (need: number) => {
    if (y + need > BOTTOM_Y) newPage();
  };

  const text = (
    body: string,
    opts: { size?: number; bold?: boolean; color?: [number, number, number]; gap?: number } = {},
  ) => {
    const { size = 10, bold = false, color = [40, 40, 40], gap = 1 } = opts;
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    doc.setTextColor(color[0], color[1], color[2]);
    const lines = doc.splitTextToSize(body, CONTENT_W) as string[];
    for (const line of lines) {
      ensureSpace(size * 0.45 + gap);
      doc.text(line, MARGIN, y);
      y += size * 0.45 + gap;
    }
  };

  const h1 = (s: string) => {
    ensureSpace(14);
    text(s, { size: 20, bold: true, color: [20, 20, 20], gap: 2 });
    y += 1;
  };
  const h2 = (s: string) => {
    ensureSpace(14);
    y += 4;
    text(s, { size: 13, bold: true, color: [15, 35, 80], gap: 2 });
    doc.setDrawColor(232, 184, 64);
    doc.setLineWidth(0.3);
    doc.line(MARGIN, y, MARGIN + 40, y);
    y += 3;
  };
  const p = (s: string) => text(s, { size: 10, color: [60, 60, 60], gap: 1.5 });
  const bullet = (s: string) => text("•  " + s, { size: 10, color: [55, 55, 55], gap: 1.2 });

  // First page
  drawLetterhead(doc, logo, v.category.toUpperCase() + " · " + v.title);
  drawWatermark(doc, logo);

  h1(v.title);
  text(v.tagline, { size: 11, bold: true, color: [80, 80, 80], gap: 1.5 });
  y += 1;
  p(v.longDesc);

  h2("Highlights");
  v.highlights.forEach(bullet);

  h2("Services");
  p(v.services.join(" · "));

  h2("Audience");
  p(v.audience);

  const cs = getVentureCase(v);
  h2("Challenge");
  p(cs.challenge);
  h2("Our solution");
  p(cs.solution);

  h2("Delivery phases");
  cs.phases.forEach((ph, i) => {
    text(`${i + 1}. ${ph.title}`, { size: 10.5, bold: true, color: [40, 40, 40], gap: 1.2 });
    p(ph.desc);
  });

  h2("Capabilities & stack");
  p(cs.techStack.join(", "));

  h2("Outcomes");
  cs.results.forEach((r) => bullet(`${r.value} — ${r.label}`));

  h2("Key milestones");
  getVentureMilestones(v).forEach((m) =>
    bullet(`${m.year} — ${m.title}: ${m.desc}`),
  );

  h2("Engagement packages");
  getVenturePackages(v).forEach((pk) => {
    text(`${pk.name} — ${pk.price}${pk.cadence ? " " + pk.cadence : ""}`, {
      size: 11,
      bold: true,
      color: [15, 35, 80],
      gap: 1.5,
    });
    p(pk.summary);
    pk.features.forEach(bullet);
    y += 1;
  });

  h2("FAQs");
  getVentureFaqs(v).forEach((f) => {
    text("Q: " + f.q, { size: 10.5, bold: true, color: [40, 40, 40], gap: 1.2 });
    p("A: " + f.a);
    y += 1;
  });

  h2("Talk to us");
  p("Reach out to our enterprise desk for a tailored proposal, references on request, and NDA-ready discovery.");

  // Footers on every page
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    drawFooter(doc, i, pages, v.slug);
  }

  doc.save(`${v.slug}-enterprise-brief.pdf`);
}
