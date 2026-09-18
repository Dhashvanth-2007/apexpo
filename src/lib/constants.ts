export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  category: "Development" | "Design" | "Growth & SEO" | "AI & Performance" | "Guarantee";
  iconName: string;
  tags: string[];
  deliverables: string[];
  isSpecial?: boolean;
}

export const SERVICES: ServiceItem[] = [
  {
    id: "responsive-web-development",
    title: "Modern Responsive Website Development",
    description: "High-performance, pixel-perfect web experiences engineered with modern frameworks, fluid typography, and sub-second load times.",
    category: "Development",
    iconName: "Code2",
    tags: ["Next.js", "React", "TypeScript", "Tailwind"],
    deliverables: ["Fluid responsive layouts", "Lighthouse 95+ score", "Semantic HTML5", "Cross-browser perfection"]
  },
  {
    id: "ecommerce-development",
    title: "E-commerce Development",
    description: "High-converting online flagships with frictionless checkouts, custom product customizers, and robust payment gateways.",
    category: "Development",
    iconName: "ShoppingBag",
    tags: ["Shopify Plus", "NextCommerce", "Stripe API", "Headless"],
    deliverables: ["Micro-interactions", "Cart abandonment recovery", "Global currencies & tax", "Inventory sync"]
  },
  {
    id: "ui-ux-design",
    title: "UI/UX Design",
    description: "Cinematic, editorial design systems rooted in user psychology, high-contrast aesthetics, and tactile micro-interactions.",
    category: "Design",
    iconName: "Palette",
    tags: ["Design Systems", "Figma", "User Journey", "Interactive Prototyping"],
    deliverables: ["Full design tokens", "Interactive prototypes", "User testing reports", "Component library"]
  },
  {
    id: "landing-page-development",
    title: "Landing Page Development",
    description: "Hypnotic, single-minded landing pages engineered for rapid customer acquisition, investor showcases, and product drops.",
    category: "Development",
    iconName: "Zap",
    tags: ["High Velocity", "A/B Testing", "Framer Motion", "Lead Capture"],
    deliverables: ["Scroll triggers", "Dynamic proof points", "Sub-1s latency", "CRM integration"]
  },
  {
    id: "basic-seo-optimization",
    title: "Basic SEO Optimization",
    description: "Technical search architecture, JSON-LD structured schemas, Open Graph protocols, and semantic hierarchy for organic rank dominance.",
    category: "Growth & SEO",
    iconName: "Search",
    tags: ["Technical SEO", "Schema.org", "Core Web Vitals", "Sitemaps"],
    deliverables: ["Structured microdata", "Dynamic meta tags", "Canonical audits", "Robots & index rules"]
  },
  {
    id: "google-business-profile",
    title: "Google Business Profile Optimization",
    description: "Local search authority domination with verified schema links, geo-targeted citations, and review generation funnels.",
    category: "Growth & SEO",
    iconName: "MapPin",
    tags: ["Local SEO", "Maps Rank", "Reputation", "Citations"],
    deliverables: ["Profile audit & claim", "Category optimization", "Geo-tagged imagery", "Review automation"]
  },
  {
    id: "analytics-performance-tracking",
    title: "Analytics & Performance Tracking",
    description: "Full-funnel telemetry with GA4, server-side Google Tag Manager, custom scroll/interaction events, and executive dashboards.",
    category: "AI & Performance",
    iconName: "BarChart3",
    tags: ["GA4", "GTM Server-side", "Mixpanel", "Heatmaps"],
    deliverables: ["Custom event schemas", "Conversion funnels", "Attribution modeling", "Live Looker Studio report"]
  },
  {
    id: "seasonal-campaign-pages",
    title: "Seasonal Campaign / Promotion Pages",
    description: "Turnkey campaign landing pads with countdown clocks, dynamic discount mechanics, and viral social sharing hooks.",
    category: "Growth & SEO",
    iconName: "Flame",
    tags: ["Time-sensitive", "Drops", "Gamification", "High Traffic"],
    deliverables: ["Live countdown timers", "Dynamic tiers", "Zero-cache bottlenecks", "Multi-channel tracking"]
  },
  {
    id: "website-maintenance-updates",
    title: "Website Maintenance & Updates",
    description: "Continuous enterprise care, security patching, dependency upgrades, 24/7 uptime monitoring, and SLA-backed turnaround.",
    category: "Development",
    iconName: "ShieldCheck",
    tags: ["24/7 Uptime", "Zero-day Patches", "Backup Systems", "SLA"],
    deliverables: ["Weekly backups", "Dependency scans", "Speed optimization", "Continuous staging QA"]
  },
  {
    id: "conversion-rate-optimization",
    title: "Conversion Rate Optimization",
    description: "Data-driven behavioral heatmapping, iterative multivariate testing, form friction removal, and value proposition sharpening.",
    category: "Growth & SEO",
    iconName: "TrendingUp",
    tags: ["A/B Testing", "Heatmaps", "Copywriting", "Friction Removal"],
    deliverables: ["Friction audit", "Multivariate experiments", "Session replay analysis", "+35% median lift"]
  },
  {
    id: "google-ads-management",
    title: "Google Ads Management",
    description: "High-intent Search, Performance Max, and YouTube retargeting campaigns synchronized directly with bespoke landing pages.",
    category: "Growth & SEO",
    iconName: "Target",
    tags: ["PPC", "Performance Max", "Keyword Intent", "ROAS Focus"],
    deliverables: ["Ad copy testing", "Negative keyword lists", "Conversion tag sync", "Weekly ROAS reporting"]
  },
  {
    id: "ai-integration-automation",
    title: "AI Integration & Automation",
    description: "Embed state-of-the-art LLMs, autonomous customer concierge chatbots, neural search, and workflow automation into your site.",
    category: "AI & Performance",
    iconName: "Cpu",
    tags: ["OpenAI / Gemini", "RAG Systems", "Voice / Chatbots", "Workflows"],
    deliverables: ["Trained knowledge base", "Contextual fallback", "Webhook automation", "Real-time streaming"]
  },
  {
    id: "custom-web-applications",
    title: "Custom Web Applications",
    description: "Mission-critical enterprise software, client portals, SaaS architectures, and interactive 3D/canvas dashboards.",
    category: "Development",
    iconName: "Layers",
    tags: ["Full Stack", "PostgreSQL", "Next.js App Router", "Server Actions"],
    deliverables: ["Role-based access", "Encrypted databases", "Real-time webhooks", "API Documentation"]
  },
  {
    id: "mobile-app-development",
    title: "Mobile App Development",
    description: "Custom native & cross-platform mobile apps for schools, gyms, retail stores, restaurants, and startups with offline sync and push notifications.",
    category: "Development",
    iconName: "Smartphone",
    tags: ["iOS & Android", "React Native", "Flutter", "App Store"],
    deliverables: ["iOS & Android store deployment", "Offline data synchronization", "Push notifications & badges", "Admin control dashboard"]
  },
  {
    id: "professional-editing-services",
    title: "Professional Editing Services",
    description: "Commercial photo and cinematic video editing for high-impact branding, promotional reels, YouTube series, and viral social content.",
    category: "Design",
    iconName: "Film",
    tags: ["Color Grading", "Motion Graphics", "Reels & Promo", "Sound Design"],
    deliverables: ["4K HDR color mastering", "Dynamic social 9:16 & 16:9 cuts", "Motion typography animation", "Multi-format optimized delivery"]
  },
  {
    id: "lifetime-free-service",
    title: "Lifetime Free Service",
    description: "Our signature peace-of-mind guarantee. Free ongoing technical support, critical security patches, and minor content updates included with every single project we build.",
    category: "Guarantee",
    iconName: "Sparkles",
    tags: ["Zero Retainer Fee", "24/7 Security", "Lifetime Updates", "Exclusive Guarantee"],
    deliverables: ["Ongoing security patches", "Free minor content updates", "SSL & domain monitoring", "Priority email & WhatsApp helpline"],
    isSpecial: true
  }
];

export interface PortfolioItem {
  id: string;
  title: string;
  subtitle: string;
  category: "Gym" | "Restaurant" | "Shop" | "Marketing" | "Portfolio" | "Events" | "School";
  frameNumber: number;
  imageUrl?: string;
  description: string;
  keyFeatures: string[];
  ctaText: string;
  tags: string[];
  liveUrl?: string;
}

export const PORTFOLIO: PortfolioItem[] = [
  {
    id: "gym-fitness",
    title: "Vanguard Athletic Club & Studios",
    subtitle: "Gym & Fitness Studio Website",
    category: "Gym",
    frameNumber: 38,
    imageUrl: "/assets/vanguard-cover.png",
    description: "High-octane dark UI engineered for premium fitness clubs. Features integrated real-time class booking schedules, instant membership subscription CTAs, trainer rosters, and live gym capacity meters.",
    keyFeatures: ["Interactive class booking schedule", "Tiered membership checkout", "Energetic high-contrast dark UI", "Trainer bio modal showcases"],
    ctaText: "Explore Gym Experience",
    tags: ["Class Booking", "Membership CTAs", "Energetic Dark UI", "Next.js"]
  },
  {
    id: "restaurant-culinary",
    title: "Spice Route — Royal Indian Fine Dining",
    subtitle: "Restaurant & Gastronomy Website",
    category: "Restaurant",
    frameNumber: 78,
    imageUrl: "/assets/spice-route-cover.png",
    description: "Royal Indian fine dining web flagship live on Vercel. Features authentic saffron-infused royal tasting menus, interactive reservation booking engine, immersive culinary photography gallery, and imperial Indian hospitality.",
    keyFeatures: [
      "Table reservations booking system",
      "Interactive royal tasting menu showcase",
      "Curated culinary photo gallery",
      "Live production deployment on Vercel"
    ],
    ctaText: "Visit Live Restaurant Website",
    liveUrl: "https://restaurent-lovat-ten.vercel.app/",
    tags: ["Live on Vercel", "Royal Fine Dining", "Reservations", "Menu Showcase"]
  },
  {
    id: "retail-ecommerce",
    title: "Kōhaku Japanese Streetwear Flagship",
    subtitle: "Shop / Retail & E-commerce Website",
    category: "Shop",
    frameNumber: 116,
    imageUrl: "/assets/kohaku-cover.png",
    description: "Ultra-fast headless digital boutique with fluid product grids, instant size/color switchers, frictionless sliding cart drawers, and one-tap Apple Pay / Google Pay checkout flows.",
    keyFeatures: ["Fluid product preview grid", "Slide-out micro-cart drawer", "1-tap Apple Pay / Stripe flow", "Inventory sync & variant picker"],
    ctaText: "Explore Retail Platform",
    tags: ["Product Grid", "Cart & Checkout Flow", "Headless Shopify", "Framer Motion"]
  },
  {
    id: "marketing-platform",
    title: "Vortex X-1 — Hyperlight Gaming",
    subtitle: "Product Launch & Interactive Marketing Site",
    category: "Marketing",
    frameNumber: 156,
    imageUrl: "/assets/vortex-cover.png",
    description: "High-octane product launch showcase & marketing experience for Vortex X-1 Hyperlight Gaming. Features interactive exploded hardware views, 0.2ms QuantumSync zero-lag wireless benchmarks, 120H battery specs, and high-conversion buy-now CTAs.",
    keyFeatures: [
      "Exploded hardware component view",
      "QuantumSync zero-lag wireless telemetry",
      "120H marathon battery specs showcase",
      "Live production deployment on Vercel"
    ],
    ctaText: "Visit Live Marketing Demo",
    liveUrl: "https://vortex-one-chi.vercel.app/",
    tags: ["Live on Vercel", "3D Product Showcase", "Hardware Launch", "Interactive UI"]
  },
  {
    id: "animated-portfolio",
    title: "Kai Soren — Spatial Director",
    subtitle: "Animated Portfolio for Creatives & Influencers",
    category: "Portfolio",
    frameNumber: 196,
    imageUrl: "/assets/kai-soren-cover.png",
    description: "A kinetic personal branding platform designed for top students, elite professionals, and creative influencers. Features smooth showreel video overlays, interactive resume timelines, and social media hubs.",
    keyFeatures: ["Scroll-driven showreel player", "Kinetic resume & skill timeline", "Personal branding typography", "Social & press kit links"],
    ctaText: "Explore Portfolio Site",
    tags: ["Personal Branding", "Resume / Showreel", "Social Links", "GSAP Kinetics"]
  },
  {
    id: "events-conference",
    title: "Apex Summit 2027 — Future of AI",
    subtitle: "Event & Conference Website",
    category: "Events",
    frameNumber: 226,
    imageUrl: "/assets/apex-summit-cover.jpg",
    description: "High-voltage summit landing pad featuring live countdown clocks, multi-track agenda schedules with speaker filters, interactive venue maps, and instant VIP ticketing RSVP CTAs.",
    keyFeatures: ["Live countdown launch timer", "Interactive multi-track schedule", "VIP RSVP & Ticketing checkout", "Speaker showcase popups"],
    ctaText: "Explore Event Platform",
    tags: ["Countdown Timers", "Schedule / Agenda", "RSVP & Ticketing", "Tailwind CSS"]
  },
  {
    id: "school-academy",
    title: "Oakridge International Academy",
    subtitle: "K-12 School & Academy Website",
    category: "School",
    frameNumber: 172,
    imageUrl: "/assets/school-cover.jpg",
    description: "World-class digital campus portal engineered for prestigious K-12 international academies and preparatory schools. Features interactive 360° virtual campus tours, online student admissions & enrollment, curriculum directories, and parent-student hubs.",
    keyFeatures: [
      "Online student admissions & enrollment portal",
      "Interactive 360° virtual campus walkthrough",
      "Academic curriculum & faculty directory",
      "Parent-student portal & event schedules"
    ],
    ctaText: "Explore School Website",
    tags: ["Admissions Portal", "Virtual Campus Tour", "Parent Portal", "Next.js App Router"]
  }
];

export interface IndustryItem {
  id: string;
  name: string;
  subtitle: string;
  iconName: string;
  metrics: string;
}

export const INDUSTRIES: IndustryItem[] = [
  { id: "fintech", name: "FinTech & Web3", subtitle: "Institutional platforms & crypto dashboards", iconName: "Shield", metrics: "$4.2B+ volume secured" },
  { id: "luxury", name: "Luxury & Fashion", subtitle: "Editorial e-commerce with rich 3D visuals", iconName: "Gem", metrics: "+280% mobile checkout" },
  { id: "saas", name: "Enterprise SaaS", subtitle: "High-velocity product tours & onboarding", iconName: "Terminal", metrics: "4.8x trial signups" },
  { id: "realestate", name: "Real Estate & Architecture", subtitle: "Immersive architectural showcases & tours", iconName: "Building2", metrics: "92% qualified lead rate" },
  { id: "healthcare", name: "Healthcare & MedTech", subtitle: "HIPAA-compliant portals & patient scheduling", iconName: "Activity", metrics: "99.99% uptime compliance" },
  { id: "hospitality", name: "Hospitality & Dining", subtitle: "Cinematic resort experiences & booking", iconName: "Compass", metrics: "+190% direct reservations" },
  { id: "automotive", name: "Automotive & Mobility", subtitle: "Configurators & high-octane visualizers", iconName: "Zap", metrics: "65s average dwell time" },
  { id: "consulting", name: "Professional Services", subtitle: "Authoritative thought-leadership hubs", iconName: "Briefcase", metrics: "3.2x consultation requests" }
];

export interface CaseStudyItem {
  id: string;
  client: string;
  industry: string;
  title: string;
  frameNumber: number;
  problem: string;
  solution: string;
  metrics: { label: string; value: string }[];
}

export const CASE_STUDIES: CaseStudyItem[] = [
  {
    id: "hyperion-protocol",
    client: "Hyperion Digital",
    industry: "FinTech & Web3 Infrastructure",
    title: "Engineering a 0.3s Sub-Second Conversion Funnel for Global Capital",
    frameNumber: 56,
    problem: "Hyperion's legacy application had a 4.6s initial paint time, causing high bounce rates among institutional allocators.",
    solution: "We re-architected the web application with Next.js App Router and GSAP kinetic walkthroughs.",
    metrics: [
      { label: "Conversion Lift", value: "+214%" },
      { label: "Lighthouse Speed", value: "99/100" },
      { label: "Bounce Rate Cut", value: "-52%" },
      { label: "Capital Inflow", value: "$48M+" }
    ]
  }
];

export interface PricingPlan {
  id: string;
  name: string;
  badge?: string;
  priceDisplay: string;
  tagline: string;
  featured: boolean;
  features: string[];
  ctaText: string;
}

export interface MonthlySupportPlan {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    priceDisplay: "Starting from ₹4,999",
    tagline: "Essential digital presence for startups and local businesses wanting a clean, fast launchpad.",
    featured: false,
    ctaText: "Start with Starter",
    features: [
      "Basic business website",
      "Responsive UI/UX",
      "WhatsApp integration",
      "Contact form",
      "Google Maps",
      "Basic SEO",
      "Lifetime Free Service included"
    ]
  },
  {
    id: "business",
    name: "Business",
    priceDisplay: "Starting from ₹9,999",
    tagline: "Elevated brand presence with kinetic interactions, local dominance, and lead-generation tools.",
    featured: false,
    ctaText: "Choose Business",
    features: [
      "Premium UI/UX",
      "Custom animations",
      "Advanced sections",
      "WhatsApp & enquiry system",
      "Analytics",
      "SEO setup",
      "Google Business optimization",
      "Lifetime Free Service included"
    ]
  },
  {
    id: "growth",
    name: "Growth",
    badge: "Most Popular",
    priceDisplay: "Starting from ₹19,999",
    tagline: "The full conversion engine engineered to dominate search rankings and turn visitors into buyers.",
    featured: true,
    ctaText: "Choose Growth",
    features: [
      "Advanced website",
      "Landing pages",
      "Conversion optimization",
      "Analytics & tracking",
      "SEO",
      "Campaign/promotion features",
      "Ongoing support",
      "Lifetime Free Service included"
    ]
  },
  {
    id: "custom",
    name: "Custom",
    badge: "Bespoke",
    priceDisplay: "Let's Talk",
    tagline: "Tailored mission-critical web applications, high-volume e-commerce, and bespoke digital platforms.",
    featured: false,
    ctaText: "Let's Talk",
    features: [
      "E-commerce",
      "Event websites",
      "Booking systems",
      "Custom web applications",
      "Admin dashboards",
      "Payment integration",
      "AI features",
      "Lifetime Free Service included"
    ]
  }
];

export const MONTHLY_SUPPORT_PLANS: MonthlySupportPlan[] = [
  {
    id: "maintenance",
    name: "Maintenance",
    price: "₹1,499/month",
    description: "Routine upkeep, backups, and security monitoring to keep your website fast and glitch-free.",
    features: ["Weekly cloud backups", "Security patching", "Uptime monitoring", "Minor copy & asset tweaks"]
  },
  {
    id: "seo-growth",
    name: "SEO + Business Growth",
    price: "₹3,499/month",
    description: "Active search rank advancement, local Google optimization, and continuous conversion reporting.",
    features: ["Keyword rank tracking", "Monthly SEO content adjustments", "Google Business updates", "Conversion funnel report"]
  },
  {
    id: "custom-growth",
    name: "Custom Growth",
    price: "₹5,000+/month",
    description: "Dedicated engineering partner for ongoing sprint feature builds, custom campaigns, and SLA priority.",
    features: ["Dedicated developer hours", "Weekly sprint enhancements", "Campaign & drop pages", "2-hour priority SLA response"]
  }
];

export const PRICING_NOTE = "Every tier price is a starting baseline (e.g. 'Starting from ₹4,999') based on project type and complexity, NOT the number of pages. The actual quote increases transparently when the project requires deeper custom integrations, advanced logic, or specialized assets.";

export const BUDGET_TIERS = [
  "Starter Tier — Starting from ₹4,999",
  "Business Tier — Starting from ₹9,999",
  "Growth Tier (Most Popular) — Starting from ₹19,999",
  "Custom / Enterprise Solutions — Starting from ₹50,000+",
  "Monthly Care & Retainers — Starting from ₹1,499/month",
  "Custom Scope / Needs Consultation",
];

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  quote: string;
  metrics: string;
  rating: number;
}

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: "1",
    name: "Elena Rostova",
    role: "Chief Marketing Officer",
    company: "Valkyrie Global",
    avatar: "/assets/frames/ezgif-frame-030.jpg",
    quote: "Apexpo transformed our digital presence into a cinematic phenomenon with Lifetime Free Service support.",
    metrics: "+210% Conversions",
    rating: 5
  }
];

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export const FAQS: FAQItem[] = [
  {
    question: "What does the Lifetime Free Service guarantee include?",
    answer: "Every website built by Apexpo includes ongoing complimentary security patches, critical dependency updates, domain & SSL monitoring, and minor content/styling tweaks without any monthly retainer fee.",
    category: "Support"
  }
];

export const COMPANY_DETAILS = {
  name: "Apexpo",
  tagline: "Engineering the next generation of digital experiences",
  subline: "We build websites that convert.",
  eyebrow: "Web Development · UI/UX · AI Automation",
  email: "apexpo008@gmail.com",
  phone: "+91 93427 44740",
  secondaryPhone: "+91 89037 32621",
  whatsappNumber: "919342744740",
  whatsappMessage: "Hi Apexpo team, I'd like to discuss a new web development project.",
  address: "Apexpo Digital Studio, Tamil Nadu, India",
  socials: {
    twitter: "https://twitter.com/apexpo",
    linkedin: "https://linkedin.com/company/apexpo",
    github: "https://github.com/apexpo",
    instagram: "https://instagram.com/apexpo.digital"
  }
};
