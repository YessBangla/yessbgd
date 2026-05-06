import jsPDF from "jspdf";
import type { Venture } from "@/data/ventures";
import {
  getVentureCase,
  getVentureMilestones,
  getVenturePackages,
  getVentureFaqs,
} from "@/data/ventures";

const PAGE_W = 210; // A4 mm
const MARGIN = 18;
const CONTENT_W = PAGE_W - MARGIN * 2;

export function downloadVentureBrief(v: Venture) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let y = MARGIN;

  const ensureSpace = (need: number) => {
    if (y + need > 280) {
      doc.addPage();
      y = MARGIN;
    }
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
    ensureSpace(12);
    y += 4;
    text(s, { size: 13, bold: true, color: [30, 70, 140], gap: 2 });
    doc.setDrawColor(220, 226, 240);
    doc.line(MARGIN, y, MARGIN + CONTENT_W, y);
    y += 3;
  };
  const p = (s: string) => text(s, { size: 10, color: [60, 60, 60], gap: 1.5 });
  const bullet = (s: string) => text("•  " + s, { size: 10, color: [55, 55, 55], gap: 1.2 });

  // Header band
  doc.setFillColor(15, 35, 80);
  doc.rect(0, 0, PAGE_W, 26, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("YESS BANGLA · ENTERPRISE BRIEF", MARGIN, 11);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(v.category.toUpperCase(), MARGIN, 18);
  doc.text(new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }), PAGE_W - MARGIN, 18, { align: "right" });
  y = 36;

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

  // Case study
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

  // Milestones
  h2("Key milestones");
  getVentureMilestones(v).forEach((m) =>
    bullet(`${m.year} — ${m.title}: ${m.desc}`),
  );

  // Packages
  h2("Engagement packages");
  getVenturePackages(v).forEach((pk) => {
    text(`${pk.name} — ${pk.price}${pk.cadence ? " " + pk.cadence : ""}`, {
      size: 11,
      bold: true,
      color: [30, 70, 140],
      gap: 1.5,
    });
    p(pk.summary);
    pk.features.forEach(bullet);
    y += 1;
  });

  // FAQs
  h2("FAQs");
  getVentureFaqs(v).forEach((f) => {
    text("Q: " + f.q, { size: 10.5, bold: true, color: [40, 40, 40], gap: 1.2 });
    p("A: " + f.a);
    y += 1;
  });

  // Footer / contact
  h2("Talk to us");
  p("Email: yessbangla.bd@gmail.com   ·   Phone: +880 1805-464343");
  p("Office: Block A, Road 3, House 127, Mirpur 12, Dhaka 1216, Bangladesh");
  p("Web: https://yessbgd.lovable.app/ventures/" + v.slug);

  // Page numbers
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(140, 140, 140);
    doc.text(
      `${v.title} · Enterprise Brief · Page ${i} of ${pages}`,
      PAGE_W / 2,
      290,
      { align: "center" },
    );
  }

  doc.save(`${v.slug}-enterprise-brief.pdf`);
}
