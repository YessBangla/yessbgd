export type Opening = {
  slug: string;
  title: string;
  type: string;
  location: string;
  dept: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
};

export const openings: Opening[] = [
  {
    slug: "senior-full-stack-engineer",
    title: "Senior Full-Stack Engineer",
    type: "Full-time",
    location: "Dhaka / Remote",
    dept: "Engineering",
    summary:
      "Build production-grade web platforms across our OTT, e-commerce and consulting products.",
    responsibilities: [
      "Design and ship features across React, Node and PHP/Laravel stacks.",
      "Own services end-to-end: schema, API, UI, deploy, monitor.",
      "Mentor engineers through code reviews and architecture sessions.",
    ],
    requirements: [
      "5+ years of full-stack experience with TypeScript and a server framework.",
      "Comfort with relational databases, queues and CI/CD.",
      "Strong written and verbal communication in English.",
    ],
  },
  {
    slug: "product-designer",
    title: "Product Designer (UI/UX)",
    type: "Full-time",
    location: "Dhaka",
    dept: "Design",
    summary:
      "Shape the look, feel and interaction model of our consumer and enterprise products.",
    responsibilities: [
      "Lead design for major product surfaces from research to handoff.",
      "Maintain and evolve our design system in Figma.",
      "Partner closely with engineers and PMs throughout delivery.",
    ],
    requirements: [
      "Portfolio of shipped product work across web and mobile.",
      "Fluency in Figma, prototyping and design-system thinking.",
      "Bias for clarity, accessibility and motion.",
    ],
  },
  {
    slug: "business-analyst",
    title: "Business Analyst",
    type: "Full-time",
    location: "Dhaka",
    dept: "Consulting",
    summary:
      "Translate client problems into structured analysis, recommendations and roadmaps.",
    responsibilities: [
      "Run discovery workshops and interviews with client stakeholders.",
      "Build models, dashboards and decks that drive decisions.",
      "Support delivery teams with clear requirements and acceptance criteria.",
    ],
    requirements: [
      "3+ years in consulting, strategy or product analysis.",
      "Strong Excel/Sheets, SQL basics and slide-craft.",
      "Comfort presenting to senior stakeholders.",
    ],
  },
  {
    slug: "digital-marketing-specialist",
    title: "Digital Marketing Specialist",
    type: "Full-time",
    location: "Dhaka / Hybrid",
    dept: "Marketing",
    summary:
      "Plan and execute multi-channel campaigns that grow our brand and ventures.",
    responsibilities: [
      "Run paid campaigns across Meta, Google and emerging channels.",
      "Own SEO, content calendar and email lifecycle programs.",
      "Report on funnel performance with clear next actions.",
    ],
    requirements: [
      "3+ years in performance or growth marketing.",
      "Hands-on with GA4, ad managers and a CMS.",
      "Strong analytical and copywriting skills.",
    ],
  },
  {
    slug: "customer-success-executive",
    title: "Customer Success Executive",
    type: "Full-time",
    location: "Dhaka",
    dept: "Operations",
    summary:
      "Be the trusted partner clients rely on through onboarding, adoption and renewal.",
    responsibilities: [
      "Own a portfolio of accounts and their success plans.",
      "Coordinate with delivery, support and product on client outcomes.",
      "Identify expansion opportunities and reduce churn risk.",
    ],
    requirements: [
      "2+ years in customer success, account management or operations.",
      "Excellent communication and follow-through.",
      "Comfort with CRM tools and basic reporting.",
    ],
  },
];

export function getOpening(slug: string): Opening | undefined {
  return openings.find((o) => o.slug === slug);
}
