import { Code2, Tv, PlayCircle, Newspaper, Leaf, Wrench, Server, CalendarHeart, Sparkles, UtensilsCrossed, LayoutGrid, type LucideIcon } from "lucide-react";

import yessSoftImg from "@/assets/ventures/yess-soft.jpg";
import akashTvImg from "@/assets/ventures/akash-tv.jpg";
import akashOttImg from "@/assets/ventures/akash-ott.jpg";
import dailyAkashImg from "@/assets/ventures/the-daily-akash.jpg";
import organicHaatImg from "@/assets/ventures/yess-organic-haat.jpg";
import yessServiceImg from "@/assets/ventures/yess-service.jpg";
import yessHostImg from "@/assets/ventures/yess-host.jpg";
import yessEventImg from "@/assets/ventures/yess-event.jpg";
import yessModelImg from "@/assets/ventures/yess-model.jpg";
import yessFoodImg from "@/assets/ventures/yess-food.jpg";
import yessAioImg from "@/assets/ventures/yess-all-in-one-solution.jpg";

export type VentureCase = {
  challenge: string;
  solution: string;
  phases: { title: string; desc: string }[];
  techStack: string[];
  results: { label: string; value: string }[];
};

export type Venture = {
  slug: string;
  title: string;
  category: string;
  tagline: string;
  desc: string;
  longDesc: string;
  image: string;
  icon: LucideIcon;
  color: string;
  highlights: string[];
  services: string[];
  audience: string;
  features: { title: string; desc: string }[];
  founded?: string;
  reach?: string;
  caseStudy?: VentureCase;
};

export const ventures: Venture[] = [
  {
    slug: "yess-soft",
    title: "Yess Soft",
    category: "Software & IT Solutions",
    tagline: "Engineering software that scales with your ambition.",
    desc: "Custom software, web & mobile applications, ERP, CRM and enterprise systems built for modern businesses across Bangladesh and beyond.",
    longDesc:
      "Yess Soft is the engineering core of the YESS Bangla group — a product studio that ships secure, observable, cloud-native software for ambitious teams. From single-screen MVPs to multi-tenant ERP platforms, every release is built with TypeScript, automated tests, and a relentless focus on time-to-value.",
    image: yessSoftImg,
    icon: Code2,
    color: "from-primary to-primary-glow",
    highlights: [
      "Web & mobile application development",
      "ERP, CRM & inventory management systems",
      "UI/UX design and product strategy",
      "Cloud-native, secure and scalable architectures",
    ],
    services: ["Web Development", "Mobile Apps", "ERP Systems", "Cloud Solutions", "UI/UX Design"],
    audience: "Startups, SMEs, enterprises and government agencies seeking digital transformation.",
    founded: "2018",
    reach: "Clients across BD, UAE & UK",
    features: [
      { title: "Senior-only delivery pods", desc: "Every project is led by a tech lead, designer and PM — no hand-offs." },
      { title: "Production-ready in 90 days", desc: "Discovery, design and a working v1 inside a single quarter." },
      { title: "Long-term partnership", desc: "Quarterly roadmap reviews, dedicated success manager and 24/5 support." },
    ],
    caseStudy: {
      challenge:
        "A national distributor was running 11 disconnected spreadsheets and three legacy desktop apps — orders were being missed, inventory was wrong by 18%, and finance closed the books two weeks late.",
      solution:
        "Yess Soft replaced the legacy stack with a single multi-tenant ERP — orders, inventory, fleet and finance — wired into a real-time analytics layer and mobile apps for the field team.",
      phases: [
        { title: "Discover", desc: "Process mapping with 14 stakeholders, KPI baselining and an executive scorecard." },
        { title: "Design", desc: "Role-based UX, design system and clickable prototype validated with end-users." },
        { title: "Build", desc: "Two-week sprints, automated test suite, weekly demos and zero-downtime deploys." },
        { title: "Launch & grow", desc: "Phased rollout across 7 depots, training videos and a 90-day improvement retainer." },
      ],
      techStack: ["TypeScript", "React", "Node.js", "PostgreSQL", "Redis", "AWS", "Cloudflare"],
      results: [
        { label: "Inventory accuracy", value: "99.4%" },
        { label: "Order cycle time", value: "−61%" },
        { label: "Finance close", value: "3 days" },
        { label: "Uptime", value: "99.97%" },
      ],
    },
  },
  {
    slug: "akash-tv",
    title: "Akash TV",
    category: "Satellite Television",
    tagline: "Stories that connect a nation.",
    desc: "A modern satellite broadcast channel delivering news, entertainment, drama, talk shows and cultural programs across the country.",
    longDesc:
      "Akash TV is a 24/7 general-entertainment satellite channel reaching households across Bangladesh and the diaspora. From breaking news to flagship dramas and live cultural events, our newsroom and production studios are built to international broadcast standards.",
    image: akashTvImg,
    icon: Tv,
    color: "from-accent to-primary",
    highlights: [
      "24/7 satellite broadcasting",
      "News, drama, talk shows and cultural programs",
      "In-house production studio",
      "Nationwide reach and growing global audience",
    ],
    services: ["News & Current Affairs", "Drama & Entertainment", "Live Programs", "Brand Sponsorships"],
    audience: "Viewers, advertisers and content creators looking for a premium broadcast platform.",
    founded: "2019",
    reach: "Nationwide + diaspora",
    features: [
      { title: "HD newsroom", desc: "Three studios, automated graphics, dual control rooms and live OB capability." },
      { title: "Original drama slate", desc: "12+ flagship serials a year, produced in-house with award-winning directors." },
      { title: "Brand-safe inventory", desc: "Curated programming blocks and custom integrations for premium advertisers." },
    ],
    caseStudy: {
      challenge:
        "Launching a new satellite channel into a saturated market — with the production quality of global broadcasters but a lean, local cost base.",
      solution:
        "We built a tape-less HD newsroom, a flagship drama slate and a sponsorship-friendly programming grid — all wired into a real-time audience analytics layer.",
      phases: [
        { title: "Discover", desc: "Audience research across 6 divisions, competitor grid analysis and a programming blueprint." },
        { title: "Design", desc: "On-air branding system, set design and a graphics package built for HD and social cut-downs." },
        { title: "Build", desc: "Three studios, two control rooms, MAM workflow and an OB van commissioned in 7 months." },
        { title: "Launch & grow", desc: "Soft launch, weekly grid optimisation against ratings and a rolling slate of new originals." },
      ],
      techStack: ["Sony HD Cameras", "Avid MAM", "Vizrt Graphics", "Dalet Newsroom", "Eutelsat Uplink"],
      results: [
        { label: "Weekly reach", value: "22M+" },
        { label: "Prime-time share", value: "Top 5" },
        { label: "Original hours / yr", value: "1,800+" },
        { label: "On-air uptime", value: "99.99%" },
      ],
    },
  },
  {
    slug: "akash-ott",
    title: "Akash OTT",
    category: "Streaming Platform",
    tagline: "Your favourite shows, anytime — on any screen.",
    desc: "An on-demand streaming platform with films, web originals, live TV and exclusive premieres tailored for Bangla-speaking audiences worldwide.",
    longDesc:
      "Akash OTT is the digital home for Bangla storytelling — feature films, web series, live TV simulcasts and exclusive premieres, available on mobile, web and smart TV with personalised recommendations and offline downloads.",
    image: akashOttImg,
    icon: PlayCircle,
    color: "from-primary-glow to-accent",
    highlights: [
      "On-demand films, series and originals",
      "Live TV streaming across devices",
      "Personalised recommendations",
      "Multi-device support — mobile, web, smart TV",
    ],
    services: ["Subscription Streaming", "Original Content", "Live TV", "Brand Partnerships"],
    audience: "Households, content fans and brands seeking digital reach.",
    founded: "2022",
    reach: "Available in 40+ countries",
    features: [
      { title: "Adaptive streaming", desc: "DRM-protected delivery from 144p to 4K with sub-2s start times." },
      { title: "Originals studio", desc: "A pipeline of platform-exclusive series and films across genres." },
      { title: "Smart discovery", desc: "ML-driven recommendations, watch-party mode and continue-watching across devices." },
    ],
  },
  {
    slug: "the-daily-akash",
    title: "The Daily Akash",
    category: "Digital Newspaper",
    tagline: "Trusted journalism for a modern Bangladesh.",
    desc: "A digital-first newspaper delivering breaking news, in-depth analysis, business, sports and lifestyle stories that matter — every day.",
    longDesc:
      "The Daily Akash is an independent, digital-first newsroom. Our reporters cover politics, business, sports, technology and culture with an editorial code that puts accuracy and accountability ahead of speed.",
    image: dailyAkashImg,
    icon: Newspaper,
    color: "from-primary to-accent",
    highlights: [
      "Breaking news and investigative reporting",
      "Business, politics, sports and lifestyle coverage",
      "Multimedia storytelling — video, audio, long-reads",
      "Mobile-first digital experience",
    ],
    services: ["News Reporting", "Editorial & Opinion", "Display & Native Ads", "Sponsored Content"],
    audience: "Readers, advertisers and PR partners who value credible journalism.",
    founded: "2020",
    reach: "Millions of monthly readers",
    features: [
      { title: "Independent newsroom", desc: "Editorial firewall, source protection and a published corrections policy." },
      { title: "Long-form & investigations", desc: "A dedicated desk for multi-week investigations and data journalism." },
      { title: "Native ad studio", desc: "Brand storytelling that respects readers — clearly labelled, beautifully crafted." },
    ],
  },
  {
    slug: "yess-organic-haat",
    title: "Yess Organic Haat",
    category: "Organic Marketplace",
    tagline: "Pure. Local. Delivered to your door.",
    desc: "Farm-to-table organic food and lifestyle products sourced directly from verified local producers and delivered fresh.",
    longDesc:
      "Yess Organic Haat is a farm-to-fork marketplace that connects verified Bangladeshi farmers directly to urban households. Cold-chain logistics, lab-tested produce and a transparent grading system mean what you order is what arrives — fresh, traceable and fair to the grower.",
    image: organicHaatImg,
    icon: Leaf,
    color: "from-accent to-primary-glow",
    highlights: [
      "Verified organic produce and groceries",
      "Direct sourcing from local farmers",
      "Cold-chain logistics and quality control",
      "Subscription and one-time delivery",
    ],
    services: ["Fresh Produce", "Pantry & Groceries", "Wellness Products", "Corporate Supply"],
    audience: "Health-conscious households, restaurants and corporate offices.",
    founded: "2021",
    reach: "200+ partner farms",
    features: [
      { title: "Lab-tested produce", desc: "Random batch testing for pesticides and heavy metals at an accredited lab." },
      { title: "Fair-trade pricing", desc: "Farmers receive a published floor price plus a quality bonus on every harvest." },
      { title: "Cold-chain delivery", desc: "Temperature-controlled vans and same-day fulfilment across major cities." },
    ],
  },
  {
    slug: "yess-service",
    title: "Yess Service",
    category: "Home & Professional Services",
    tagline: "Trusted experts, just a tap away.",
    desc: "On-demand professional services — from home maintenance and cleaning to expert consultations — delivered by vetted professionals.",
    longDesc:
      "Yess Service brings the country's best home and professional service providers onto a single, dependable booking platform. Every technician is background-checked, trained and rated by customers — with a written service guarantee on every job.",
    image: yessServiceImg,
    icon: Wrench,
    color: "from-primary to-primary-glow",
    highlights: [
      "Home repair, cleaning and maintenance",
      "Vetted, background-checked professionals",
      "Transparent pricing and instant booking",
      "Service guarantee on every job",
    ],
    services: ["Home Repair", "Deep Cleaning", "AC & Appliance Service", "Professional Consultation"],
    audience: "Homeowners, tenants and businesses needing reliable on-demand services.",
    founded: "2022",
    reach: "Dhaka, Chittagong, Sylhet",
    features: [
      { title: "Vetted professionals", desc: "ID checks, skill assessments and ongoing training on safety and etiquette." },
      { title: "Upfront pricing", desc: "See the price before you book — no surprises, no haggling, no hidden fees." },
      { title: "Service guarantee", desc: "If you're not satisfied, we send a second professional or refund — your call." },
    ],
  },
  {
    slug: "yess-host",
    title: "Yess Host",
    category: "Hosting & Cloud Infrastructure",
    tagline: "Fast, secure hosting built for growth.",
    desc: "Reliable web hosting, domains, cloud servers and managed infrastructure for businesses of all sizes — backed by 24/7 expert support.",
    longDesc:
      "Yess Host is enterprise-grade infrastructure for everyone — from a first portfolio site to a multi-region SaaS. NVMe storage, isolated containers, automated backups and a tier-3 support desk that actually answers.",
    image: yessHostImg,
    icon: Server,
    color: "from-primary-glow to-primary",
    highlights: [
      "Shared, VPS and cloud hosting",
      "Domain registration and SSL",
      "Managed servers with 99.9% uptime",
      "24/7 technical support",
    ],
    services: ["Web Hosting", "Cloud VPS", "Domains & SSL", "Managed Servers"],
    audience: "Developers, agencies and businesses building online.",
    founded: "2019",
    reach: "Multi-region, BD-first",
    features: [
      { title: "NVMe everywhere", desc: "Every plan runs on NVMe storage with HTTP/3 and global caching out of the box." },
      { title: "One-click stacks", desc: "WordPress, Laravel, Next.js, Node, n8n and 30+ apps in under a minute." },
      { title: "Real humans, 24/7", desc: "Median first-response under 4 minutes — by chat, ticket or phone." },
    ],
  },
  {
    slug: "yess-event",
    title: "Yess Event",
    category: "Event Management",
    tagline: "Unforgettable experiences, expertly delivered.",
    desc: "End-to-end event planning, production and management for corporate, cultural, brand activations and private occasions.",
    longDesc:
      "Yess Event designs and produces moments people remember — corporate conferences, brand launches, music festivals and private celebrations. Strategy, creative, production and logistics under one roof.",
    image: yessEventImg,
    icon: CalendarHeart,
    color: "from-accent to-primary",
    highlights: [
      "Corporate conferences and product launches",
      "Concerts, festivals and brand activations",
      "Weddings and private celebrations",
      "Full production — stage, sound, lighting, AV",
    ],
    services: ["Corporate Events", "Brand Activation", "Concerts & Festivals", "Wedding Planning"],
    audience: "Brands, corporates and individuals planning memorable occasions.",
    founded: "2017",
    reach: "300+ events delivered",
    features: [
      { title: "Creative-led production", desc: "Concept, script, set design and AV — engineered around the audience moment." },
      { title: "Owned equipment", desc: "Stage, sound, lighting, LED walls and broadcast kit — owned, not rented." },
      { title: "Single accountable lead", desc: "One producer owns budget, timeline and quality from kick-off to wrap." },
    ],
  },
  {
    slug: "yess-model",
    title: "Yess Model",
    category: "Modeling & Talent Agency",
    tagline: "Where talent meets opportunity.",
    desc: "A modeling and talent agency discovering and nurturing fresh faces — connecting models, actors and creators with leading brands.",
    longDesc:
      "Yess Model is a full-service talent agency representing models, actors, presenters and creators. From scouting and grooming to bookings, contracts and aftercare — we build careers, not just shoots.",
    image: yessModelImg,
    icon: Sparkles,
    color: "from-primary to-accent",
    highlights: [
      "Talent scouting and grooming",
      "Brand campaigns and runway shows",
      "Portfolio shoots and training",
      "Casting for film, TV and digital media",
    ],
    services: ["Talent Management", "Brand Campaigns", "Casting", "Grooming & Training"],
    audience: "Aspiring models, brands and production houses.",
    founded: "2020",
    reach: "Roster of 200+ artists",
    features: [
      { title: "Scout & develop", desc: "Open calls, training in posing, grooming, on-camera presence and brand etiquette." },
      { title: "Brand-grade portfolios", desc: "Studio-quality test shoots and digitals refreshed every season." },
      { title: "Transparent contracts", desc: "Clear day rates, usage windows and a duty-of-care policy on every booking." },
    ],
  },
  {
    slug: "yess-food",
    title: "Yess Food",
    category: "Food & Beverage",
    tagline: "Authentic flavours, world-class quality.",
    desc: "Quality-driven food experiences — from cloud kitchens and signature dining concepts to packaged food brands.",
    longDesc:
      "Yess Food is a multi-format F&B operator — cloud kitchens, signature dine-in concepts, catering and packaged food brands — all built on hygiene-first kitchens and a chef-led recipe lab.",
    image: yessFoodImg,
    icon: UtensilsCrossed,
    color: "from-primary-glow to-accent",
    highlights: [
      "Cloud kitchens and dine-in concepts",
      "Packaged food and beverages",
      "Hygiene-first kitchens",
      "Catering for events and corporates",
    ],
    services: ["Restaurants", "Cloud Kitchen", "Catering", "Packaged Foods"],
    audience: "Food lovers, families, offices and event hosts.",
    founded: "2021",
    reach: "Multiple kitchens across Dhaka",
    features: [
      { title: "Chef-led R&D", desc: "Every menu starts in our recipe lab with chefs, nutritionists and supply experts." },
      { title: "HACCP-grade kitchens", desc: "Daily hygiene audits, cold-chain integrity and full ingredient traceability." },
      { title: "Operator-friendly", desc: "Cloud kitchen partnerships open new revenue without rebuilding your team." },
    ],
  },
  {
    slug: "yess-all-in-one-solution",
    title: "Yess All in One Solution",
    category: "Integrated Business Solutions",
    tagline: "Every YESS service. One unified experience.",
    desc: "A unified platform bringing together every YESS service — software, media, lifestyle and professional services — for seamless business and personal needs.",
    longDesc:
      "Yess All-in-One is the master account that unlocks every YESS venture — software builds, media buys, organic supply, hosting, events and more — through a single login, a single invoice and a single concierge team.",
    image: yessAioImg,
    icon: LayoutGrid,
    color: "from-primary to-primary-glow",
    highlights: [
      "Single sign-on across all YESS ventures",
      "Unified billing and customer support",
      "Tailored bundles for businesses",
      "One trusted partner for every need",
    ],
    services: ["Bundled Services", "Enterprise Accounts", "Concierge Support", "Custom Solutions"],
    audience: "Businesses and power-users who want everything under one trusted roof.",
    founded: "2023",
    reach: "Enterprise & power users",
    features: [
      { title: "One account, all ventures", desc: "Single sign-on, unified profile and shared payment methods across YESS." },
      { title: "Concierge desk", desc: "A dedicated relationship manager handles requests across every venture for you." },
      { title: "Bundle savings", desc: "Tailored packages combine services for measurable cost and time savings." },
    ],
  },
];

export const getVenture = (slug: string) => ventures.find((v) => v.slug === slug);

// Generic case study builder — gives every venture a richer detail page
// (challenge, solution, phases, tech stack, measurable results).
export function getVentureCase(v: Venture): VentureCase {
  if (v.caseStudy) return v.caseStudy;
  return {
    challenge: `Audiences and partners of ${v.title} needed a faster, more reliable and more measurable experience — without the friction of fragmented tools and manual operations.`,
    solution: `We re-architected ${v.title} around a single source of truth, automated the repetitive workflows, and shipped a clean, conversion-focused interface across every customer touchpoint.`,
    phases: [
      { title: "Discover", desc: "Stakeholder interviews, audit of existing tools, KPI baselining and a written scope of work." },
      { title: "Design", desc: "Information architecture, UX prototypes and a design system aligned to the brand." },
      { title: "Build", desc: "Iterative two-week sprints with weekly demos, automated tests and continuous deployment." },
      { title: "Launch & grow", desc: "Phased rollout, training, monitoring dashboards and a 90-day improvement retainer." },
    ],
    techStack: ["TypeScript", "React", "Node.js", "PostgreSQL", "Cloudflare", "AWS"],
    results: [
      { label: "Faster time-to-launch", value: "−42%" },
      { label: "Operational cost reduction", value: "−28%" },
      { label: "Customer satisfaction", value: "+35%" },
      { label: "Uptime", value: "99.9%" },
    ],
  };
}
