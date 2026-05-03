import { Code2, Tv, PlayCircle, Newspaper, Leaf, Wrench, Server, CalendarHeart, Sparkles, UtensilsCrossed, LayoutGrid, type LucideIcon } from "lucide-react";

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
  icon: LucideIcon;
  color: string;
  highlights: string[];
  services: string[];
  audience: string;
  caseStudy?: VentureCase;
};

export const ventures: Venture[] = [
  {
    slug: "yess-soft",
    title: "Yess Soft",
    category: "Software & IT Solutions",
    tagline: "Engineering software that scales with your ambition.",
    desc: "Custom software, web & mobile applications, ERP, CRM and enterprise systems built for modern businesses across Bangladesh and beyond.",
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
  },
  {
    slug: "akash-tv",
    title: "Akash TV",
    category: "Satellite Television",
    tagline: "Stories that connect a nation.",
    desc: "A modern satellite broadcast channel delivering news, entertainment, drama, talk shows and cultural programs across the country.",
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
  },
  {
    slug: "akash-ott",
    title: "Akash OTT",
    category: "Streaming Platform",
    tagline: "Your favourite shows, anytime — on any screen.",
    desc: "An on-demand streaming platform with films, web originals, live TV and exclusive premieres tailored for Bangla-speaking audiences worldwide.",
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
  },
  {
    slug: "the-daily-akash",
    title: "The Daily Akash",
    category: "Digital Newspaper",
    tagline: "Trusted journalism for a modern Bangladesh.",
    desc: "A digital-first newspaper delivering breaking news, in-depth analysis, business, sports and lifestyle stories that matter — every day.",
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
  },
  {
    slug: "yess-organic-haat",
    title: "Yess Organic Haat",
    category: "Organic Marketplace",
    tagline: "Pure. Local. Delivered to your door.",
    desc: "Farm-to-table organic food and lifestyle products sourced directly from verified local producers and delivered fresh.",
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
  },
  {
    slug: "yess-service",
    title: "Yess Service",
    category: "Home & Professional Services",
    tagline: "Trusted experts, just a tap away.",
    desc: "On-demand professional services — from home maintenance and cleaning to expert consultations — delivered by vetted professionals.",
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
  },
  {
    slug: "yess-host",
    title: "Yess Host",
    category: "Hosting & Cloud Infrastructure",
    tagline: "Fast, secure hosting built for growth.",
    desc: "Reliable web hosting, domains, cloud servers and managed infrastructure for businesses of all sizes — backed by 24/7 expert support.",
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
  },
  {
    slug: "yess-event",
    title: "Yess Event",
    category: "Event Management",
    tagline: "Unforgettable experiences, expertly delivered.",
    desc: "End-to-end event planning, production and management for corporate, cultural, brand activations and private occasions.",
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
  },
  {
    slug: "yess-model",
    title: "Yess Model",
    category: "Modeling & Talent Agency",
    tagline: "Where talent meets opportunity.",
    desc: "A modeling and talent agency discovering and nurturing fresh faces — connecting models, actors and creators with leading brands.",
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
  },
  {
    slug: "yess-food",
    title: "Yess Food",
    category: "Food & Beverage",
    tagline: "Authentic flavours, world-class quality.",
    desc: "Quality-driven food experiences — from cloud kitchens and signature dining concepts to packaged food brands.",
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
  },
  {
    slug: "yess-all-in-one-solution",
    title: "Yess All in One Solution",
    category: "Integrated Business Solutions",
    tagline: "Every YESS service. One unified experience.",
    desc: "A unified platform bringing together every YESS service — software, media, lifestyle and professional services — for seamless business and personal needs.",
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
  },
];

export const getVenture = (slug: string) => ventures.find((v) => v.slug === slug);
