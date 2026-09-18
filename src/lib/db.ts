import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import os from "os";
import bcrypt from "bcryptjs";

// Global Prisma instance for Next.js hot-reloading
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// =========================================================================
// Data Models & Interfaces
// =========================================================================

export interface LeadRecord {
  id: string;
  name: string;
  businessName: string;
  email: string;
  phone: string;
  service: string;
  budget: string;
  message: string;
  status: "NEW" | "CONTACTED" | "MEETING_SCHEDULED" | "PROPOSAL_SENT" | "WON" | "LOST" | string;
  notes?: string | null;
  assignedToId?: string | null;
  assignedToName?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LeadActivityRecord {
  id: string;
  leadId: string;
  action: "LEAD_CREATED" | "STATUS_CHANGED" | "NOTE_ADDED" | "ASSIGNED" | "UNASSIGNED" | string;
  details?: string | null;
  userName?: string | null;
  createdAt: string;
}

export interface UserRecord {
  id: string;
  name: string;
  username?: string | null;
  email: string;
  passwordHash: string;
  role: "SUPER_ADMIN" | "ADMIN" | "TEAM_MEMBER" | string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectRecord {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  clientOrConcept: "Concept Project" | "Live Demo" | string;
  services: string[];
  technologies: string[];
  heroImage: string;
  gallery: string[];
  problem?: string | null;
  solution?: string | null;
  features: string[];
  results?: string | null;
  liveUrl?: string | null;
  published: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceRecord {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  startingPrice: string;
  published: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface TestimonialRecord {
  id: string;
  name: string;
  business: string;
  role: string;
  review: string;
  image?: string | null;
  rating: number;
  metrics?: string | null;
  published: boolean;
  createdAt: string;
}

export interface AnalyticsEventRecord {
  id: string;
  eventType: string;
  path: string;
  metadata?: string | null;
  createdAt: string;
}


export interface ClientRecord {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentRecord {
  id: string;
  clientId: string;
  leadId?: string | null;
  callScope: string;
  duration: number;
  appointmentDate: string;
  appointmentTime: string;
  timezone: string;
  status: "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW" | "RESCHEDULED" | string;
  meetingUrl?: string | null;
  projectDescription?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface LocalDBData {
  users: UserRecord[];
  leads: LeadRecord[];
  activities: LeadActivityRecord[];
  projects: ProjectRecord[];
  services: ServiceRecord[];
  testimonials: TestimonialRecord[];
  analytics: AnalyticsEventRecord[];
  settings: Record<string, string>;
  clients: ClientRecord[];
  appointments: AppointmentRecord[];
}

const isServerless = Boolean(
  process.env.VERCEL ||
  process.env.AWS_LAMBDA_FUNCTION_NAME ||
  process.env.NETLIFY ||
  process.env.VERCEL_ENV
);

// On serverless environments (Vercel/AWS Lambda), process.cwd() is strictly read-only (/var/task).
// os.tmpdir() (/tmp) is the only writable directory on serverless.
const DATA_DIR = isServerless
  ? path.join(os.tmpdir(), "apexpo_data")
  : path.join(process.cwd(), ".data");
const DB_FILE = path.join(DATA_DIR, "store.json");

// Singleton in-memory store so data operations NEVER crash even if disk writes are restricted
const globalForStore = global as unknown as { __apexpoLocalStore?: LocalDBData };

export function isPrismaAvailable(): boolean {
  const url = process.env.DATABASE_URL;
  if (!url || !url.startsWith("postgres")) return false;
  // If running on Vercel / serverless without remote postgres, localhost is unreachable
  if (isServerless && (url.includes("localhost") || url.includes("127.0.0.1"))) {
    return false;
  }
  return true;
}

const DEFAULT_SETTINGS: Record<string, string> = {
  companyName: "APEXPO — Digital Technology & Software Solutions",
  companyEmail: "apexpo008@gmail.com",
  companyPhone1: "+91 93427 44740",
  companyPhone2: "+91 89037 32621",
  whatsappNumber: "919342744740",
  whatsappMessage: "Hi APEXPO, I would like to discuss a project.",
  companyAddress: "Tamil Nadu, India (Serving Global Clients)",
  instagram: "https://instagram.com/apexpo.digital",
  linkedin: "https://linkedin.com/company/apexpo",
  github: "https://github.com/apexpo",
  seoTitle: "APEXPO — Digital Technology & Software Solutions",
  seoDescription: "High-performance websites, custom web apps, mobile apps, and scalable digital solutions engineered for modern enterprises.",
  leadNotificationEmail: "apexpo008@gmail.com",
  calendarUrl: "https://cal.com/apexpo/discovery",
};

function initLocalStore(): LocalDBData {
  if (globalForStore.__apexpoLocalStore) {
    return globalForStore.__apexpoLocalStore;
  }

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch {
    // Non-fatal if directory creation fails in restricted environments
  }

  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, "utf-8");
      const parsed = JSON.parse(content);
      if (!parsed.testimonials) parsed.testimonials = [];
      if (!parsed.analytics) parsed.analytics = [];
      if (!parsed.settings) parsed.settings = { ...DEFAULT_SETTINGS };
      if (!parsed.activities) parsed.activities = [];
      if (!parsed.clients) parsed.clients = [];
      if (!parsed.appointments) parsed.appointments = [];
      if (parsed.users && parsed.users.length > 0) {
        parsed.users.forEach((u: UserRecord) => {
          if (!u.role || u.role === "ADMIN") u.role = "SUPER_ADMIN";
          if (u.active === undefined) u.active = true;
          if (!u.updatedAt) u.updatedAt = u.createdAt;
          if (!u.username) {
            u.username = u.email ? u.email.split("@")[0] : "admin";
          }
        });
      }
      globalForStore.__apexpoLocalStore = parsed;
      return parsed;
    }
  } catch {
    // Reinitialize if corrupted
  }

  const defaultPasswordHash = bcrypt.hashSync(process.env.ADMIN_DEFAULT_PASSWORD || "ApexpoAdmin2027!", 10);

  const initialData: LocalDBData = {
    users: [
      {
        id: "usr_admin_01",
        name: "APEXPO Lead Partner",
        username: process.env.ADMIN_DEFAULT_USERNAME || "admin",
        email: process.env.ADMIN_DEFAULT_EMAIL || "admin@apexpo.digital",
        passwordHash: defaultPasswordHash,
        role: "SUPER_ADMIN",
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    leads: [],
    activities: [],
    projects: [
      {
        id: "proj_vanguard",
        slug: "vanguard-athletic-club",
        name: "Vanguard Athletic Club & Studios",
        category: "WEBSITES",
        description: "High-octane dark UI engineered for premium fitness clubs. Features integrated real-time class booking schedules, instant membership subscription CTAs, trainer rosters, and live gym capacity meters.",
        clientOrConcept: "Concept Project",
        services: ["Responsive Web Development", "UI/UX Design", "Booking Engine Architecture"],
        technologies: ["Next.js 14", "Tailwind CSS", "Framer Motion", "TypeScript"],
        heroImage: "/assets/vanguard-cover.png",
        gallery: ["/assets/vanguard-cover.png"],
        problem: "Fitness clubs struggle with low mobile conversions, confusing timetable schedules, and high friction during signups.",
        solution: "We engineered a sub-second, dark obsidian web application featuring frictionless one-tap class bookings and automated calendar sync.",
        features: ["Live Gym Capacity Meter", "Real-Time Class Scheduler", "Membership Tier Comparison", "Trainer Profile Portfolios"],
        results: "+240% mobile class bookings, sub-second latency",
        liveUrl: null,
        published: true,
        order: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "proj_spice_route",
        slug: "spice-route-restaurant",
        name: "Spice Route — Royal Indian Fine Dining",
        category: "WEBSITES",
        description: "Royal Indian fine dining web flagship live on Vercel. Features authentic saffron-infused royal tasting menus, interactive reservation booking engine, immersive culinary photography gallery, and imperial Indian hospitality.",
        clientOrConcept: "Live Demo",
        services: ["Modern Web Development", "Menu Architecture", "Reservation Engine"],
        technologies: ["Next.js App Router", "Tailwind CSS", "Vercel"],
        heroImage: "/assets/spice-route-cover.png",
        gallery: ["/assets/spice-route-cover.png"],
        problem: "Fine dining restaurants lose up to 30% of revenue to high third-party reservation commissions.",
        solution: "Engineered a zero-commission direct reservation engine with tasting menu previews and instant SMS/WhatsApp confirmations.",
        features: ["Interactive Saffron Menu", "Instant Table Reservation Engine", "Private Dining Inquiries", "Chef Storytelling Showcase"],
        results: "Live on Vercel with 100% reservation uplift",
        liveUrl: "https://restaurent-lovat-ten.vercel.app/",
        published: true,
        order: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "proj_kohaku",
        slug: "kohaku-japanese-streetwear",
        name: "Kōhaku Japanese Streetwear Flagship",
        category: "E-COMMERCE",
        description: "Ultra-fast headless digital boutique with fluid product grids, instant size/color switchers, frictionless sliding cart drawers, and one-tap Apple Pay / Google Pay checkout flows.",
        clientOrConcept: "Concept Project",
        services: ["E-Commerce Development", "Headless Storefront", "Micro-Interactions"],
        technologies: ["NextCommerce", "Shopify API", "Framer Motion"],
        heroImage: "/assets/kohaku-cover.png",
        gallery: ["/assets/kohaku-cover.png"],
        problem: "Standard e-commerce templates suffer from heavy checkout abandonment and clunky mobile filtering.",
        solution: "Built a headless Shopify storefront with sub-300ms page transitions and a frictionless slide-out cart drawer.",
        features: ["Instant Variant Color Switcher", "Slide-out Quick Cart", "Currency Converter", "Mobile-Optimized Checkout"],
        results: "+65% cart conversion rate, 0.4s page transitions",
        liveUrl: null,
        published: true,
        order: 3,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "proj_vortex",
        slug: "vortex-x1-gaming",
        name: "Vortex X-1 — Hyperlight Gaming",
        category: "WEB APPS",
        description: "High-octane product launch showcase & marketing experience for Vortex X-1 Hyperlight Gaming. Features interactive exploded hardware views, 0.2ms QuantumSync zero-lag wireless benchmarks, 120H battery specs, and high-conversion buy-now CTAs.",
        clientOrConcept: "Live Demo",
        services: ["Campaign Landing Page", "3D Interactive Showcase", "Conversion Optimization"],
        technologies: ["Next.js", "GSAP ScrollTrigger", "Tailwind CSS"],
        heroImage: "/assets/vortex-cover.png",
        gallery: ["/assets/vortex-cover.png"],
        problem: "Hardware gaming launches need compelling visual proof to convert demanding esports enthusiasts.",
        solution: "Created an interactive scroll-driven kinetic showcase revealing 6-layer exploded hardware physics in real time.",
        features: ["Exploded Hardware Visualizer", "Latency Comparison Chart", "Custom RGB Profiles Configurator", "Global Retailer Locator"],
        results: "Live on Vercel with 4.8x visitor engagement time",
        liveUrl: "https://gaming-mouse-xi.vercel.app/",
        published: true,
        order: 4,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "proj_kai_soren",
        slug: "kai-soren-spatial-director",
        name: "Kai Soren — Spatial Director",
        category: "PORTFOLIO",
        description: "A kinetic personal branding platform designed for top students, elite professionals, and creative influencers. Features smooth showreel video overlays, interactive resume timelines, and social media hubs.",
        clientOrConcept: "Concept Project",
        services: ["Portfolio Website", "Kinetic Animations", "Personal Branding"],
        technologies: ["GSAP Kinetics", "Next.js", "Tailwind CSS"],
        heroImage: "/assets/kai-soren-cover.png",
        gallery: ["/assets/kai-soren-cover.png"],
        problem: "Senior creative directors require a website that matches their caliber without generic template tropes.",
        solution: "Engineered an editorial, typography-forward interactive showcase with fluid video playback and kinetic transitions.",
        features: ["Cinematic Showreel Modal", "Award & Exhibition Timeline", "Interactive Project Case Studies", "Direct Booking Inquiries"],
        results: "Featured in leading interactive design showcases",
        liveUrl: null,
        published: true,
        order: 5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "proj_apex_summit",
        slug: "apex-summit-2027",
        name: "Apex Summit 2027 — Future of AI",
        category: "EVENTS",
        description: "High-voltage summit landing pad featuring live countdown clocks, multi-track agenda schedules with speaker filters, interactive venue maps, and instant VIP ticketing RSVP CTAs.",
        clientOrConcept: "Concept Project",
        services: ["Event Website", "Ticketing & RSVP Flow", "Interactive Agenda"],
        technologies: ["Next.js 14", "Tailwind CSS", "Countdown Engine"],
        heroImage: "/assets/apex-summit-cover.jpg",
        gallery: ["/assets/apex-summit-cover.jpg"],
        problem: "Tech conferences struggle to present complex multi-track agendas and convert attendees on mobile.",
        solution: "Developed an interactive schedule filter with live timezone conversion, speaker bio modals, and one-tap ticket reservations.",
        features: ["Live Countdown Timer", "Multi-Track Agenda Filter", "Keynote Speaker Showcase", "VIP Ticket RSVP Engine"],
        results: "Sold out 10,000+ attendee tickets in 48 hours",
        liveUrl: null,
        published: true,
        order: 6,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "proj_oakridge",
        slug: "oakridge-international-academy",
        name: "Oakridge International Academy",
        category: "SCHOOL",
        description: "World-class digital campus portal engineered for prestigious K-12 international academies and preparatory schools. Features interactive 360° virtual campus tours, online student admissions & enrollment, curriculum directories, and parent-student hubs.",
        clientOrConcept: "Concept Project",
        services: ["School Portal", "Admissions Engine", "Virtual Campus Tour"],
        technologies: ["Next.js App Router", "Tailwind CSS", "Student Portal API"],
        heroImage: "/assets/school-cover.jpg",
        gallery: ["/assets/school-cover.jpg"],
        problem: "Prestigious educational institutions need transparent admission pipelines and trustworthy parent portals.",
        solution: "Built an elegant, responsive digital campus portal that streamlines parent discovery, campus tours, and admission applications.",
        features: ["Virtual 360° Campus Tour", "Online Admission Application", "Academic Curriculum Explorer", "Student & Parent Hub"],
        results: "+180% online admissions inquiries within 30 days",
        liveUrl: null,
        published: true,
        order: 7,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    services: [
      { id: "svc_1", slug: "website-development", title: "01 Website Development", description: "Pixel-perfect, high-performance web experiences engineered with Next.js, fluid typography, and sub-second load speeds.", icon: "Code2", features: ["Next.js App Router", "Lighthouse 95+ score", "Fluid responsive design", "Lifetime Free Service included"], startingPrice: "₹4,999", published: true, order: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: "svc_2", slug: "mobile-app-development", title: "02 Mobile App Development", description: "Native and cross-platform mobile apps for iOS and Android with offline synchronization, instant push alerts, and app store deployment.", icon: "Smartphone", features: ["React Native / Flutter", "Offline data sync", "Push notifications", "App Store submission"], startingPrice: "₹24,999", published: true, order: 2, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: "svc_3", slug: "web-app-development", title: "03 Web App Development", description: "Mission-critical enterprise software, client portals, SaaS architectures, and interactive 3D/canvas dashboards.", icon: "Layers", features: ["Role-based access", "PostgreSQL database", "Real-time webhooks", "Encrypted credentials"], startingPrice: "₹29,999", published: true, order: 3, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: "svc_4", slug: "ecommerce-development", title: "04 E-Commerce Development", description: "High-converting online flagships with frictionless checkouts, dynamic variant pickers, and multi-gateway payment flows.", icon: "ShoppingBag", features: ["Shopify Plus / Headless", "Slide-out cart drawer", "Stripe & Razorpay flows", "Live inventory sync"], startingPrice: "₹14,999", published: true, order: 4, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: "svc_5", slug: "ui-ux-design", title: "05 UI/UX Design", description: "Cinematic, editorial design systems rooted in user psychology, high-contrast aesthetics, and tactile micro-interactions.", icon: "Palette", features: ["Full Figma design tokens", "Interactive prototypes", "User journey wireframes", "Kinetic micro-animations"], startingPrice: "₹9,999", published: true, order: 5, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: "svc_6", slug: "landing-pages", title: "06 Landing Pages", description: "High-velocity landing pages engineered for rapid customer acquisition, investor showcases, and product drops.", icon: "Zap", features: ["Scroll triggers", "Dynamic proof points", "Sub-1s paint latency", "Instant CRM capture"], startingPrice: "₹4,999", published: true, order: 6, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: "svc_7", slug: "event-websites-apps", title: "07 Event Websites & Apps", description: "High-voltage summit landing pads featuring live countdown clocks, multi-track agenda schedules with speaker filters, and VIP ticketing.", icon: "Calendar", features: ["Live countdown launch timer", "Interactive agenda", "VIP RSVP & Ticketing", "Speaker showcase popups"], startingPrice: "₹12,999", published: true, order: 7, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: "svc_8", slug: "ai-integration", title: "08 AI Integration & Automation", description: "Embed state-of-the-art LLMs, autonomous customer concierge chatbots, neural search, and workflow automation into your site.", icon: "Cpu", features: ["Trained knowledge base", "Contextual fallback", "Webhook automation", "Real-time streaming"], startingPrice: "₹19,999", published: true, order: 8, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: "svc_9", slug: "seo-digital-growth", title: "09 SEO & Digital Growth", description: "Technical search architecture, JSON-LD structured schemas, Open Graph protocols, and semantic hierarchy for organic rank dominance.", icon: "Search", features: ["Technical SEO audit", "Schema.org microdata", "Core Web Vitals tuning", "Keyword rank tracking"], startingPrice: "₹3,499/mo", published: true, order: 9, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: "svc_10", slug: "google-business-optimization", title: "10 Google Business Optimization", description: "Dominate local Google Search and Maps rankings with optimized business attributes, review funnels, and localized search signals.", icon: "MapPin", features: ["Map pack ranking strategy", "Local citation sync", "Review generation hooks", "Weekly photo & post updates"], startingPrice: "₹2,499", published: true, order: 10, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: "svc_11", slug: "analytics-reporting", title: "11 Analytics & Reporting", description: "Full-funnel telemetry with GA4, server-side Google Tag Manager, custom scroll/interaction events, and executive dashboards.", icon: "BarChart2", features: ["Custom event schemas", "Conversion funnels", "Looker Studio dashboard", "Attribution tracking"], startingPrice: "₹4,999", published: true, order: 11, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: "svc_12", slug: "maintenance-support", title: "12 Maintenance & Support", description: "Continuous enterprise care, security patching, dependency upgrades, 24/7 uptime monitoring, and SLA-backed turnaround.", icon: "ShieldCheck", features: ["Weekly backups", "Dependency security scans", "Zero-day patching", "Lifetime Free Service backup"], startingPrice: "₹1,499/mo", published: true, order: 12, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: "svc_13", slug: "custom-software", title: "13 Custom Software Solutions", description: "Tailored enterprise software, automated CRM workflows, inventory management systems, and specialized business integrations.", icon: "Terminal", features: ["Custom API pipelines", "Automated business logic", "Secure cloud infrastructure", "Complete IP ownership"], startingPrice: "Let's Talk", published: true, order: 13, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ],
    testimonials: [],
    analytics: [],
    settings: { ...DEFAULT_SETTINGS },
    clients: [],
    appointments: [],
  };

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), "utf-8");
  } catch {
    // Disk write not permitted in read-only serverless; memory store will safely handle requests
  }

  globalForStore.__apexpoLocalStore = initialData;
  return initialData;
}

function saveLocalStore(data: LocalDBData) {
  globalForStore.__apexpoLocalStore = data;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    // In serverless environments, in-memory store retains the data across requests
  }
}

// =========================================================================
// Universal DB Interface (Prisma + Resilient Zero-Crash Repository)
// =========================================================================

export const db = {
  // --- LEADS ---
  leads: {
    async create(data: Omit<LeadRecord, "id" | "status" | "createdAt" | "updatedAt">): Promise<LeadRecord> {
      if (isPrismaAvailable()) {
        try {
          const result = await prisma.lead.create({
            data: {
              name: data.name,
              businessName: data.businessName,
              email: data.email,
              phone: data.phone,
              service: data.service,
              budget: data.budget,
              message: data.message,
              status: "NEW",
              notes: data.notes || null,
            },
          });
          await prisma.leadActivity.create({
            data: {
              leadId: result.id,
              action: "LEAD_CREATED",
              details: `Brief submitted for ${result.service}`,
              userName: "System",
            },
          }).catch(() => {});

          return {
            ...result,
            createdAt: result.createdAt.toISOString(),
            updatedAt: result.updatedAt.toISOString(),
          };
        } catch (dbErr) {
          console.warn("[Prisma Lead Create fallback to local store]", dbErr);
        }
      }
        const store = initLocalStore();
        const newLead: LeadRecord = {
          id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          ...data,
          status: "NEW",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        store.leads.unshift(newLead);
        store.activities.unshift({
          id: `act_${Date.now()}`,
          leadId: newLead.id,
          action: "LEAD_CREATED",
          details: `Brief submitted for ${newLead.service}`,
          userName: "System",
          createdAt: new Date().toISOString(),
        });
        saveLocalStore(store);
        return newLead;
    },

    async findMany(options?: {
      status?: string;
      service?: string;
      budget?: string;
      search?: string;
      sort?: "newest" | "oldest";
    }): Promise<LeadRecord[]> {
      try {
        const where: Record<string, unknown> = {};
        if (options?.status && options.status !== "ALL") where.status = options.status;
        if (options?.service && options.service !== "ALL") where.service = options.service;
        if (options?.budget && options.budget !== "ALL") where.budget = options.budget;
        if (options?.search) {
          where.OR = [
            { name: { contains: options.search, mode: "insensitive" } },
            { businessName: { contains: options.search, mode: "insensitive" } },
            { email: { contains: options.search, mode: "insensitive" } },
            { phone: { contains: options.search, mode: "insensitive" } },
          ];
        }

        const results = await prisma.lead.findMany({
          where,
          include: { assignedTo: { select: { name: true } } },
          orderBy: { createdAt: options?.sort === "oldest" ? "asc" : "desc" },
        });

        return results.map((r) => ({
          ...r,
          assignedToName: r.assignedTo?.name || null,
          createdAt: r.createdAt.toISOString(),
          updatedAt: r.updatedAt.toISOString(),
        }));
      } catch {
        const store = initLocalStore();
        let list = [...store.leads];

        if (options?.status && options.status !== "ALL") {
          list = list.filter((l) => l.status === options.status);
        }
        if (options?.service && options.service !== "ALL") {
          list = list.filter((l) => l.service === options.service);
        }
        if (options?.budget && options.budget !== "ALL") {
          list = list.filter((l) => l.budget === options.budget);
        }
        if (options?.search) {
          const s = options.search.toLowerCase();
          list = list.filter(
            (l) =>
              l.name.toLowerCase().includes(s) ||
              l.businessName.toLowerCase().includes(s) ||
              l.email.toLowerCase().includes(s) ||
              l.phone.toLowerCase().includes(s)
          );
        }

        list.sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return options?.sort === "oldest" ? dateA - dateB : dateB - dateA;
        });

        return list.map((l) => {
          const user = store.users.find((u) => u.id === l.assignedToId);
          return { ...l, assignedToName: user ? user.name : null };
        });
      }
    },

    async findById(id: string): Promise<{ lead: LeadRecord | null; activities: LeadActivityRecord[] }> {
      try {
        const lead = await prisma.lead.findUnique({
          where: { id },
          include: {
            assignedTo: { select: { id: true, name: true, email: true } },
            activities: { orderBy: { createdAt: "desc" } },
          },
        });
        if (!lead) return { lead: null, activities: [] };
        return {
          lead: {
            ...lead,
            assignedToName: lead.assignedTo?.name || null,
            createdAt: lead.createdAt.toISOString(),
            updatedAt: lead.updatedAt.toISOString(),
          },
          activities: lead.activities.map((a) => ({
            ...a,
            createdAt: a.createdAt.toISOString(),
          })),
        };
      } catch {
        const store = initLocalStore();
        const lead = store.leads.find((l) => l.id === id) || null;
        if (!lead) return { lead: null, activities: [] };
        const user = store.users.find((u) => u.id === lead.assignedToId);
        const activities = store.activities
          .filter((a) => a.leadId === id)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return {
          lead: { ...lead, assignedToName: user ? user.name : null },
          activities,
        };
      }
    },

    async update(id: string, updates: Partial<LeadRecord>, actorName: string = "APEXPO Partner"): Promise<LeadRecord | null> {
      try {
        const current = await prisma.lead.findUnique({ where: { id } });
        if (!current) return null;

        const result = await prisma.lead.update({
          where: { id },
          data: {
            ...(updates.status ? { status: updates.status } : {}),
            ...(updates.notes !== undefined ? { notes: updates.notes } : {}),
            ...(updates.assignedToId !== undefined ? { assignedToId: updates.assignedToId } : {}),
          },
        });

        if (updates.status && updates.status !== current.status) {
          await prisma.leadActivity.create({
            data: {
              leadId: id,
              action: "STATUS_CHANGED",
              details: `Status changed from ${current.status} → ${updates.status}`,
              userName: actorName,
            },
          }).catch(() => {});
        }

        if (updates.notes && updates.notes !== current.notes) {
          await prisma.leadActivity.create({
            data: {
              leadId: id,
              action: "NOTE_ADDED",
              details: updates.notes,
              userName: actorName,
            },
          }).catch(() => {});
        }

        if (updates.assignedToId !== undefined && updates.assignedToId !== current.assignedToId) {
          const action = updates.assignedToId ? "ASSIGNED" : "UNASSIGNED";
          await prisma.leadActivity.create({
            data: {
              leadId: id,
              action,
              details: updates.assignedToId ? `Assigned to team member` : `Unassigned from team member`,
              userName: actorName,
            },
          }).catch(() => {});
        }

        return {
          ...result,
          createdAt: result.createdAt.toISOString(),
          updatedAt: result.updatedAt.toISOString(),
        };
      } catch {
        const store = initLocalStore();
        const index = store.leads.findIndex((l) => l.id === id);
        if (index === -1) return null;

        const oldLead = store.leads[index];
        store.leads[index] = {
          ...oldLead,
          ...updates,
          updatedAt: new Date().toISOString(),
        };

        if (updates.status && updates.status !== oldLead.status) {
          store.activities.unshift({
            id: `act_${Date.now()}`,
            leadId: id,
            action: "STATUS_CHANGED",
            details: `Status changed from ${oldLead.status} → ${updates.status}`,
            userName: actorName,
            createdAt: new Date().toISOString(),
          });
        }

        if (updates.notes && updates.notes !== oldLead.notes) {
          store.activities.unshift({
            id: `act_${Date.now()}`,
            leadId: id,
            action: "NOTE_ADDED",
            details: updates.notes,
            userName: actorName,
            createdAt: new Date().toISOString(),
          });
        }

        if (updates.assignedToId !== undefined && updates.assignedToId !== oldLead.assignedToId) {
          const action = updates.assignedToId ? "ASSIGNED" : "UNASSIGNED";
          const assignedUser = store.users.find((u) => u.id === updates.assignedToId);
          store.activities.unshift({
            id: `act_${Date.now()}`,
            leadId: id,
            action,
            details: updates.assignedToId ? `Assigned to ${assignedUser ? assignedUser.name : "Team Member"}` : `Unassigned`,
            userName: actorName,
            createdAt: new Date().toISOString(),
          });
        }

        saveLocalStore(store);
        return store.leads[index];
      }
    },

    async delete(id: string): Promise<boolean> {
      try {
        await prisma.leadActivity.deleteMany({ where: { leadId: id } });
        await prisma.lead.delete({ where: { id } });
        return true;
      } catch {
        const store = initLocalStore();
        store.leads = store.leads.filter((l) => l.id !== id);
        store.activities = store.activities.filter((a) => a.leadId !== id);
        saveLocalStore(store);
        return true;
      }
    },

    async countByStatus(): Promise<Record<string, number>> {
      const store = initLocalStore();
      const counts: Record<string, number> = {
        TOTAL: 0,
        NEW: 0,
        CONTACTED: 0,
        MEETING_SCHEDULED: 0,
        PROPOSAL_SENT: 0,
        WON: 0,
        LOST: 0,
      };

      try {
        const leads = await prisma.lead.findMany({ select: { status: true } });
        counts.TOTAL = leads.length;
        leads.forEach((l) => {
          counts[l.status] = (counts[l.status] || 0) + 1;
        });
        return counts;
      } catch {
        counts.TOTAL = store.leads.length;
        store.leads.forEach((l) => {
          counts[l.status] = (counts[l.status] || 0) + 1;
        });
        return counts;
      }
    },
  },

  // --- ACTIVITIES ---
  activities: {
    async create(data: { leadId: string; action: string; details?: string; userName?: string }): Promise<LeadActivityRecord> {
      try {
        const act = await prisma.leadActivity.create({
          data: {
            leadId: data.leadId,
            action: data.action,
            details: data.details || null,
            userName: data.userName || "APEXPO Partner",
          },
        });
        return { ...act, createdAt: act.createdAt.toISOString() };
      } catch {
        const store = initLocalStore();
        const record: LeadActivityRecord = {
          id: `act_${Date.now()}`,
          leadId: data.leadId,
          action: data.action,
          details: data.details || null,
          userName: data.userName || "APEXPO Partner",
          createdAt: new Date().toISOString(),
        };
        store.activities.unshift(record);
        saveLocalStore(store);
        return record;
      }
    },
  },

  // --- PROJECTS ---
  projects: {
    async findMany(onlyPublished: boolean = true): Promise<ProjectRecord[]> {
      try {
        const results = await prisma.project.findMany({
          where: onlyPublished ? { published: true } : {},
          orderBy: { order: "asc" },
        });
        return results.map((r) => ({
          ...r,
          features: r.features || [],
          createdAt: r.createdAt.toISOString(),
          updatedAt: r.updatedAt.toISOString(),
        }));
      } catch {
        const store = initLocalStore();
        const list = onlyPublished ? store.projects.filter((p) => p.published) : store.projects;
        return list.sort((a, b) => (a.order || 0) - (b.order || 0));
      }
    },

    async findBySlug(slug: string): Promise<ProjectRecord | null> {
      try {
        const result = await prisma.project.findUnique({ where: { slug } });
        if (!result) return null;
        return {
          ...result,
          features: result.features || [],
          createdAt: result.createdAt.toISOString(),
          updatedAt: result.updatedAt.toISOString(),
        };
      } catch {
        const store = initLocalStore();
        return store.projects.find((p) => p.slug === slug) || null;
      }
    },

    async findById(id: string): Promise<ProjectRecord | null> {
      try {
        const result = await prisma.project.findUnique({ where: { id } });
        if (!result) return null;
        return {
          ...result,
          features: result.features || [],
          createdAt: result.createdAt.toISOString(),
          updatedAt: result.updatedAt.toISOString(),
        };
      } catch {
        const store = initLocalStore();
        return store.projects.find((p) => p.id === id) || null;
      }
    },

    async create(data: Omit<ProjectRecord, "id" | "createdAt" | "updatedAt">): Promise<ProjectRecord> {
      try {
        const result = await prisma.project.create({
          data: {
            slug: data.slug,
            name: data.name,
            category: data.category,
            description: data.description,
            clientOrConcept: data.clientOrConcept,
            services: data.services,
            technologies: data.technologies,
            heroImage: data.heroImage,
            gallery: data.gallery,
            problem: data.problem || null,
            solution: data.solution || null,
            features: data.features || [],
            results: data.results || null,
            liveUrl: data.liveUrl || null,
            published: data.published,
            order: data.order,
          },
        });
        return {
          ...result,
          features: result.features || [],
          createdAt: result.createdAt.toISOString(),
          updatedAt: result.updatedAt.toISOString(),
        };
      } catch {
        const store = initLocalStore();
        const record: ProjectRecord = {
          id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          ...data,
          features: data.features || [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        store.projects.push(record);
        saveLocalStore(store);
        return record;
      }
    },

    async update(id: string, updates: Partial<ProjectRecord>): Promise<ProjectRecord | null> {
      try {
        const result = await prisma.project.update({
          where: { id },
          data: updates,
        });
        return {
          ...result,
          features: result.features || [],
          createdAt: result.createdAt.toISOString(),
          updatedAt: result.updatedAt.toISOString(),
        };
      } catch {
        const store = initLocalStore();
        const index = store.projects.findIndex((p) => p.id === id);
        if (index === -1) return null;
        store.projects[index] = {
          ...store.projects[index],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        saveLocalStore(store);
        return store.projects[index];
      }
    },

    async delete(id: string): Promise<boolean> {
      try {
        await prisma.project.delete({ where: { id } });
        return true;
      } catch {
        const store = initLocalStore();
        store.projects = store.projects.filter((p) => p.id !== id);
        saveLocalStore(store);
        return true;
      }
    },
  },

  // --- SERVICES ---
  services: {
    async findMany(onlyPublished: boolean = true): Promise<ServiceRecord[]> {
      try {
        const results = await prisma.service.findMany({
          where: onlyPublished ? { published: true } : {},
          orderBy: { order: "asc" },
        });
        return results.map((r) => ({
          ...r,
          createdAt: r.createdAt.toISOString(),
          updatedAt: r.updatedAt.toISOString(),
        }));
      } catch {
        const store = initLocalStore();
        const list = onlyPublished ? store.services.filter((s) => s.published) : store.services;
        return list.sort((a, b) => (a.order || 0) - (b.order || 0));
      }
    },

    async findById(id: string): Promise<ServiceRecord | null> {
      try {
        const res = await prisma.service.findUnique({ where: { id } });
        if (!res) return null;
        return {
          ...res,
          createdAt: res.createdAt.toISOString(),
          updatedAt: res.updatedAt.toISOString(),
        };
      } catch {
        const store = initLocalStore();
        return store.services.find((s) => s.id === id) || null;
      }
    },

    async create(data: Omit<ServiceRecord, "id" | "createdAt" | "updatedAt">): Promise<ServiceRecord> {
      try {
        const res = await prisma.service.create({
          data: {
            slug: data.slug,
            title: data.title,
            description: data.description,
            icon: data.icon,
            features: data.features,
            startingPrice: data.startingPrice,
            published: data.published,
            order: data.order,
          },
        });
        return {
          ...res,
          createdAt: res.createdAt.toISOString(),
          updatedAt: res.updatedAt.toISOString(),
        };
      } catch {
        const store = initLocalStore();
        const record: ServiceRecord = {
          id: `svc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        store.services.push(record);
        saveLocalStore(store);
        return record;
      }
    },

    async update(id: string, updates: Partial<ServiceRecord>): Promise<ServiceRecord | null> {
      try {
        const res = await prisma.service.update({
          where: { id },
          data: updates,
        });
        return {
          ...res,
          createdAt: res.createdAt.toISOString(),
          updatedAt: res.updatedAt.toISOString(),
        };
      } catch {
        const store = initLocalStore();
        const index = store.services.findIndex((s) => s.id === id);
        if (index === -1) return null;
        store.services[index] = {
          ...store.services[index],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        saveLocalStore(store);
        return store.services[index];
      }
    },

    async delete(id: string): Promise<boolean> {
      try {
        await prisma.service.delete({ where: { id } });
        return true;
      } catch {
        const store = initLocalStore();
        store.services = store.services.filter((s) => s.id !== id);
        saveLocalStore(store);
        return true;
      }
    },
  },

  // --- TESTIMONIALS ---
  testimonials: {
    async findMany(onlyPublished: boolean = true): Promise<TestimonialRecord[]> {
      try {
        const results = await prisma.testimonial.findMany({
          where: onlyPublished ? { published: true } : {},
          orderBy: { createdAt: "desc" },
        });
        return results.map((r) => ({
          ...r,
          createdAt: r.createdAt.toISOString(),
        }));
      } catch {
        const store = initLocalStore();
        return onlyPublished ? store.testimonials.filter((t) => t.published) : store.testimonials;
      }
    },

    async findById(id: string): Promise<TestimonialRecord | null> {
      try {
        const res = await prisma.testimonial.findUnique({ where: { id } });
        if (!res) return null;
        return { ...res, createdAt: res.createdAt.toISOString() };
      } catch {
        const store = initLocalStore();
        return store.testimonials.find((t) => t.id === id) || null;
      }
    },

    async create(data: Omit<TestimonialRecord, "id" | "createdAt">): Promise<TestimonialRecord> {
      try {
        const res = await prisma.testimonial.create({
          data: {
            name: data.name,
            business: data.business,
            role: data.role,
            review: data.review,
            image: data.image || null,
            rating: data.rating || 5,
            metrics: data.metrics || "Verified Client",
            published: data.published,
          },
        });
        return { ...res, createdAt: res.createdAt.toISOString() };
      } catch {
        const store = initLocalStore();
        const record: TestimonialRecord = {
          id: `test_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          ...data,
          createdAt: new Date().toISOString(),
        };
        store.testimonials.unshift(record);
        saveLocalStore(store);
        return record;
      }
    },

    async update(id: string, updates: Partial<TestimonialRecord>): Promise<TestimonialRecord | null> {
      try {
        const res = await prisma.testimonial.update({
          where: { id },
          data: updates,
        });
        return { ...res, createdAt: res.createdAt.toISOString() };
      } catch {
        const store = initLocalStore();
        const idx = store.testimonials.findIndex((t) => t.id === id);
        if (idx === -1) return null;
        store.testimonials[idx] = { ...store.testimonials[idx], ...updates };
        saveLocalStore(store);
        return store.testimonials[idx];
      }
    },

    async delete(id: string): Promise<boolean> {
      try {
        await prisma.testimonial.delete({ where: { id } });
        return true;
      } catch {
        const store = initLocalStore();
        store.testimonials = store.testimonials.filter((t) => t.id !== id);
        saveLocalStore(store);
        return true;
      }
    },
  },

  // --- USERS / TEAM ---
  users: {
    async findMany(): Promise<UserRecord[]> {
      try {
        const results = await prisma.user.findMany({
          orderBy: { createdAt: "asc" },
        });
        return results.map((r) => ({
          ...r,
          createdAt: r.createdAt.toISOString(),
          updatedAt: r.updatedAt.toISOString(),
        }));
      } catch {
        const store = initLocalStore();
        return store.users;
      }
    },

    async findByEmail(email: string): Promise<UserRecord | null> {
      try {
        const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
        if (!user) return null;
        return {
          ...user,
          username: user.username || undefined,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        };
      } catch {
        const store = initLocalStore();
        return store.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
      }
    },

    async findByUsername(username: string): Promise<UserRecord | null> {
      const clean = username.trim().toLowerCase();
      try {
        const user = await prisma.user.findFirst({
          where: { username: { equals: clean, mode: "insensitive" } },
        });
        if (!user) return null;
        return {
          ...user,
          username: user.username || undefined,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        };
      } catch {
        const store = initLocalStore();
        return store.users.find((u) => u.username && u.username.toLowerCase() === clean) || null;
      }
    },

    async findByUsernameOrEmail(identifier: string): Promise<UserRecord | null> {
      const clean = identifier.trim().toLowerCase();
      try {
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { username: { equals: clean, mode: "insensitive" } },
              { email: { equals: clean, mode: "insensitive" } },
            ],
          },
        });
        if (!user) return null;
        return {
          ...user,
          username: user.username || (user.email ? user.email.split("@")[0] : "admin"),
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        };
      } catch {
        const store = initLocalStore();
        return (
          store.users.find(
            (u) =>
              (u.username && u.username.toLowerCase() === clean) ||
              u.email.toLowerCase() === clean
          ) || null
        );
      }
    },

    async findById(id: string): Promise<UserRecord | null> {
      try {
        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) return null;
        return {
          ...user,
          username: user.username || undefined,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        };
      } catch {
        const store = initLocalStore();
        return store.users.find((u) => u.id === id) || null;
      }
    },

    async create(data: { name: string; username?: string; email: string; password: string; role?: string }): Promise<UserRecord> {
      const passwordHash = await bcrypt.hash(data.password, 10);
      const role = data.role || "TEAM_MEMBER";
      const username = data.username ? data.username.trim().toLowerCase() : (data.email.split("@")[0] || "user");

      try {
        const user = await prisma.user.create({
          data: {
            name: data.name,
            username,
            email: data.email.toLowerCase(),
            passwordHash,
            role,
            active: true,
          },
        });
        return {
          ...user,
          username: user.username || username,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        };
      } catch {
        const store = initLocalStore();
        const record: UserRecord = {
          id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          name: data.name,
          username,
          email: data.email.toLowerCase(),
          passwordHash,
          role,
          active: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        store.users.push(record);
        saveLocalStore(store);
        return record;
      }
    },

    async update(id: string, updates: Partial<{ name: string; username: string; email: string; role: string; active: boolean; password?: string }>): Promise<UserRecord | null> {
      const dataToUpdate: Record<string, unknown> = {};
      if (updates.name) dataToUpdate.name = updates.name;
      if (updates.username) dataToUpdate.username = updates.username.trim().toLowerCase();
      if (updates.email) dataToUpdate.email = updates.email.toLowerCase();
      if (updates.role) dataToUpdate.role = updates.role;
      if (updates.active !== undefined) dataToUpdate.active = updates.active;
      if (updates.password) dataToUpdate.passwordHash = await bcrypt.hash(updates.password, 10);

      try {
        const user = await prisma.user.update({
          where: { id },
          data: dataToUpdate,
        });
        return {
          ...user,
          username: user.username || updates.username,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        };
      } catch {
        const store = initLocalStore();
        const idx = store.users.findIndex((u) => u.id === id);
        if (idx === -1) return null;
        store.users[idx] = {
          ...store.users[idx],
          ...dataToUpdate,
          updatedAt: new Date().toISOString(),
        } as UserRecord;
        saveLocalStore(store);
        return store.users[idx];
      }
    },

    async delete(id: string): Promise<boolean> {
      try {
        await prisma.user.delete({ where: { id } });
        return true;
      } catch {
        const store = initLocalStore();
        store.users = store.users.filter((u) => u.id !== id);
        saveLocalStore(store);
        return true;
      }
    },
  },

  // --- ANALYTICS ---
  analytics: {
    async track(eventType: string, path: string = "/", metadata?: Record<string, unknown>): Promise<void> {
      const metaStr = metadata ? JSON.stringify(metadata) : null;
      try {
        await prisma.analyticsEvent.create({
          data: {
            eventType,
            path,
            metadata: metaStr,
          },
        });
      } catch {
        const store = initLocalStore();
        store.analytics.push({
          id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          eventType,
          path,
          metadata: metaStr,
          createdAt: new Date().toISOString(),
        });
        if (store.analytics.length > 5000) {
          store.analytics = store.analytics.slice(-5000);
        }
        saveLocalStore(store);
      }
    },

    async getStats(rangeDays: number = 30): Promise<{
      totalEvents: number;
      byType: Record<string, number>;
      recentEvents: AnalyticsEventRecord[];
      timeSeries: { date: string; count: number }[];
    }> {
      const cutoff = new Date(Date.now() - rangeDays * 24 * 60 * 60 * 1000);
      const byType: Record<string, number> = {};
      const dateMap: Record<string, number> = {};

      try {
        const events = await prisma.analyticsEvent.findMany({
          where: { createdAt: { gte: cutoff } },
          orderBy: { createdAt: "desc" },
        });

        events.forEach((e) => {
          byType[e.eventType] = (byType[e.eventType] || 0) + 1;
          const d = e.createdAt.toISOString().slice(0, 10);
          dateMap[d] = (dateMap[d] || 0) + 1;
        });

        const timeSeries = Object.keys(dateMap).sort().map((date) => ({ date, count: dateMap[date] }));

        return {
          totalEvents: events.length,
          byType,
          recentEvents: events.slice(0, 50).map((e) => ({
            ...e,
            createdAt: e.createdAt.toISOString(),
          })),
          timeSeries,
        };
      } catch {
        const store = initLocalStore();
        const events = store.analytics.filter((e) => new Date(e.createdAt) >= cutoff);

        events.forEach((e) => {
          byType[e.eventType] = (byType[e.eventType] || 0) + 1;
          const d = e.createdAt.slice(0, 10);
          dateMap[d] = (dateMap[d] || 0) + 1;
        });

        const timeSeries = Object.keys(dateMap).sort().map((date) => ({ date, count: dateMap[date] }));

        return {
          totalEvents: events.length,
          byType,
          recentEvents: events.slice(-50).reverse(),
          timeSeries,
        };
      }
    },
  },
  // --- CLIENTS ---
  clients: {
    async findByEmail(email: string): Promise<ClientRecord | null> {
      const clean = email.trim().toLowerCase();
      try {
        const result = await prisma.client.findUnique({ where: { email: clean } });
        if (!result) return null;
        return { ...result, createdAt: result.createdAt.toISOString(), updatedAt: result.updatedAt.toISOString() };
      } catch {
        const store = initLocalStore();
        return store.clients.find((c) => c.email.toLowerCase() === clean) || null;
      }
    },

    async create(data: { name: string; companyName: string; email: string; phone: string }): Promise<ClientRecord> {
      if (isPrismaAvailable()) {
        try {
          const result = await prisma.client.create({
            data: {
              name: data.name,
              companyName: data.companyName || "Direct Inquiry",
              email: data.email.trim().toLowerCase(),
              phone: data.phone,
            },
          });
          return { ...result, createdAt: result.createdAt.toISOString(), updatedAt: result.updatedAt.toISOString() };
        } catch (dbErr) {
          console.warn("[Prisma Client Create fallback to local store]", dbErr);
        }
      }
      const store = initLocalStore();
        const existing = store.clients.find((c) => c.email.toLowerCase() === data.email.toLowerCase());
        if (existing) return existing;
        const record: ClientRecord = {
          id: `client_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          name: data.name,
          companyName: data.companyName || "Direct Inquiry",
          email: data.email.trim().toLowerCase(),
          phone: data.phone,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        store.clients.unshift(record);
        saveLocalStore(store);
        return record;
    },

    async findMany(): Promise<(ClientRecord & { appointmentCount: number; latestAppointment: string | null; leadStatus: string | null })[]> {
      try {
        const results = await prisma.client.findMany({
          orderBy: { createdAt: "desc" },
          include: { appointments: { orderBy: { appointmentDate: "desc" }, take: 1 } },
        });
        return results.map((r) => ({
          ...r,
          createdAt: r.createdAt.toISOString(),
          updatedAt: r.updatedAt.toISOString(),
          appointmentCount: r.appointments.length,
          latestAppointment: r.appointments[0]?.appointmentDate || null,
          leadStatus: null,
        }));
      } catch {
        const store = initLocalStore();
        return store.clients.map((c) => {
          const appts = store.appointments.filter((a) => a.clientId === c.id);
          const sorted = [...appts].sort((a, b) => b.appointmentDate.localeCompare(a.appointmentDate));
          const lead = store.leads.find((l) => l.email.toLowerCase() === c.email.toLowerCase());
          return { ...c, appointmentCount: appts.length, latestAppointment: sorted[0]?.appointmentDate || null, leadStatus: lead?.status || null };
        });
      }
    },

    async findById(id: string): Promise<ClientRecord | null> {
      try {
        const result = await prisma.client.findUnique({ where: { id } });
        if (!result) return null;
        return { ...result, createdAt: result.createdAt.toISOString(), updatedAt: result.updatedAt.toISOString() };
      } catch {
        const store = initLocalStore();
        return store.clients.find((c) => c.id === id) || null;
      }
    },

    async update(id: string, updates: { notes?: string; name?: string; companyName?: string; phone?: string }): Promise<ClientRecord | null> {
      try {
        const result = await prisma.client.update({
          where: { id },
          data: updates,
        });
        return { ...result, createdAt: result.createdAt.toISOString(), updatedAt: result.updatedAt.toISOString() };
      } catch {
        const store = initLocalStore();
        const idx = store.clients.findIndex((c) => c.id === id);
        if (idx === -1) return null;
        store.clients[idx] = { ...store.clients[idx], ...updates, updatedAt: new Date().toISOString() };
        saveLocalStore(store);
        return store.clients[idx];
      }
    },
  },

  // --- APPOINTMENTS ---
  appointments: {
    getAvailableTimeSlots(): string[] {
      // 9 AM to 6 PM IST, 30-minute intervals
      const slots: string[] = [];
      const start = 9 * 60; // 9:00
      const end = 18 * 60; // 18:00
      for (let m = start; m < end; m += 30) {
        const h = String(Math.floor(m / 60)).padStart(2, "0");
        const min = String(m % 60).padStart(2, "0");
        slots.push(`${h}:${min}`);
      }
      return slots;
    },

    async checkSlotAvailability(date: string, time: string, excludeId?: string): Promise<boolean> {
      try {
        const where: Record<string, unknown> = { appointmentDate: date, appointmentTime: time };
        if (excludeId) where.NOT = { id: excludeId };
        const existing = await prisma.appointment.findFirst({ where });
        return !existing;
      } catch {
        const store = initLocalStore();
        return !store.appointments.find(
          (a) => a.appointmentDate === date && a.appointmentTime === time && (!excludeId || a.id !== excludeId)
        );
      }
    },

    async getOccupiedSlots(date: string): Promise<string[]> {
      try {
        const results = await prisma.appointment.findMany({
          where: { appointmentDate: date, status: { not: "CANCELLED" } },
          select: { appointmentTime: true },
        });
        return results.map((r) => r.appointmentTime);
      } catch {
        const store = initLocalStore();
        return store.appointments
          .filter((a) => a.appointmentDate === date && a.status !== "CANCELLED")
          .map((a) => a.appointmentTime);
      }
    },

    async create(data: Omit<AppointmentRecord, "id" | "createdAt" | "updatedAt">): Promise<AppointmentRecord> {
      if (isPrismaAvailable()) {
        try {
          const result = await prisma.appointment.create({
            data: {
              clientId: data.clientId,
              leadId: data.leadId || null,
              callScope: data.callScope,
              duration: data.duration,
              appointmentDate: data.appointmentDate,
              appointmentTime: data.appointmentTime,
              timezone: data.timezone || "Asia/Kolkata",
              status: "CONFIRMED",
              meetingUrl: data.meetingUrl || null,
              projectDescription: data.projectDescription || null,
              notes: null,
            },
          });
          return { ...result, createdAt: result.createdAt.toISOString(), updatedAt: result.updatedAt.toISOString() };
        } catch (err: unknown) {
          // Check for unique constraint violation (double booking)
          const msg = err instanceof Error ? err.message : "";
          if (msg.includes("Unique constraint") || msg.includes("unique")) {
            throw new Error("SLOT_TAKEN");
          }
          console.warn("[Prisma Appointment Create fallback to local store]", err);
        }
      }
      const store = initLocalStore();
        const conflict = store.appointments.find(
          (a) => a.appointmentDate === data.appointmentDate && a.appointmentTime === data.appointmentTime && a.status !== "CANCELLED"
        );
        if (conflict) throw new Error("SLOT_TAKEN");
        const record: AppointmentRecord = {
          id: `appt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          ...data,
          status: "CONFIRMED",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        store.appointments.unshift(record);
        saveLocalStore(store);
        return record;
    },

    async findMany(options?: {
      status?: string;
      date?: string;
      filter?: "today" | "upcoming" | "completed" | "cancelled" | "noshow" | "all";
      clientId?: string;
    }): Promise<(AppointmentRecord & { clientName: string; clientEmail: string; clientCompany: string; clientPhone: string })[]> {
      const today = new Date().toISOString().slice(0, 10);
      try {
        const where: Record<string, unknown> = {};
        if (options?.clientId) where.clientId = options.clientId;
        if (options?.status && options.status !== "ALL") where.status = options.status;
        if (options?.date) where.appointmentDate = options.date;
        if (options?.filter === "today") where.appointmentDate = today;
        if (options?.filter === "upcoming") where.AND = [{ appointmentDate: { gte: today } }, { status: "CONFIRMED" }];
        if (options?.filter === "completed") where.status = "COMPLETED";
        if (options?.filter === "cancelled") where.status = "CANCELLED";
        if (options?.filter === "noshow") where.status = "NO_SHOW";

        const results = await prisma.appointment.findMany({
          where,
          orderBy: [{ appointmentDate: "desc" }, { appointmentTime: "desc" }],
          include: { client: true },
        });
        return results.map((r) => ({
          ...r,
          createdAt: r.createdAt.toISOString(),
          updatedAt: r.updatedAt.toISOString(),
          clientName: r.client.name,
          clientEmail: r.client.email,
          clientCompany: r.client.companyName,
          clientPhone: r.client.phone,
        }));
      } catch {
        const store = initLocalStore();
        let list = [...store.appointments];
        if (options?.clientId) list = list.filter((a) => a.clientId === options.clientId);
        if (options?.status && options.status !== "ALL") list = list.filter((a) => a.status === options.status);
        if (options?.date) list = list.filter((a) => a.appointmentDate === options.date);
        if (options?.filter === "today") list = list.filter((a) => a.appointmentDate === today);
        if (options?.filter === "upcoming") list = list.filter((a) => a.appointmentDate >= today && a.status === "CONFIRMED");
        if (options?.filter === "completed") list = list.filter((a) => a.status === "COMPLETED");
        if (options?.filter === "cancelled") list = list.filter((a) => a.status === "CANCELLED");
        if (options?.filter === "noshow") list = list.filter((a) => a.status === "NO_SHOW");
        list.sort((a, b) => b.appointmentDate.localeCompare(a.appointmentDate) || b.appointmentTime.localeCompare(a.appointmentTime));
        return list.map((a) => {
          const client = store.clients.find((c) => c.id === a.clientId);
          return { ...a, clientName: client?.name || "Unknown", clientEmail: client?.email || "", clientCompany: client?.companyName || "", clientPhone: client?.phone || "" };
        });
      }
    },

    async findById(id: string): Promise<(AppointmentRecord & { clientName: string; clientEmail: string; clientCompany: string; clientPhone: string }) | null> {
      try {
        const result = await prisma.appointment.findUnique({ where: { id }, include: { client: true } });
        if (!result) return null;
        return {
          ...result,
          createdAt: result.createdAt.toISOString(),
          updatedAt: result.updatedAt.toISOString(),
          clientName: result.client.name,
          clientEmail: result.client.email,
          clientCompany: result.client.companyName,
          clientPhone: result.client.phone,
        };
      } catch {
        const store = initLocalStore();
        const appt = store.appointments.find((a) => a.id === id);
        if (!appt) return null;
        const client = store.clients.find((c) => c.id === appt.clientId);
        return { ...appt, clientName: client?.name || "Unknown", clientEmail: client?.email || "", clientCompany: client?.companyName || "", clientPhone: client?.phone || "" };
      }
    },

    async update(id: string, updates: { status?: string; notes?: string; meetingUrl?: string; appointmentDate?: string; appointmentTime?: string }): Promise<AppointmentRecord | null> {
      try {
        // If rescheduling date/time, verify availability
        if (updates.appointmentDate && updates.appointmentTime) {
          const isAvailable = await this.checkSlotAvailability(updates.appointmentDate, updates.appointmentTime, id);
          if (!isAvailable) throw new Error("SLOT_TAKEN");
        }

        const result = await prisma.appointment.update({
          where: { id },
          data: {
            ...(updates.status ? { status: updates.status } : {}),
            ...(updates.notes !== undefined ? { notes: updates.notes } : {}),
            ...(updates.meetingUrl !== undefined ? { meetingUrl: updates.meetingUrl } : {}),
            ...(updates.appointmentDate ? { appointmentDate: updates.appointmentDate } : {}),
            ...(updates.appointmentTime ? { appointmentTime: updates.appointmentTime } : {}),
          },
        });
        return { ...result, createdAt: result.createdAt.toISOString(), updatedAt: result.updatedAt.toISOString() };
      } catch (err: unknown) {
        if (err instanceof Error && err.message === "SLOT_TAKEN") throw err;
        const store = initLocalStore();
        const idx = store.appointments.findIndex((a) => a.id === id);
        if (idx === -1) return null;

        if (updates.appointmentDate && updates.appointmentTime) {
          const conflict = store.appointments.find(
            (a) => a.id !== id && a.appointmentDate === updates.appointmentDate && a.appointmentTime === updates.appointmentTime && a.status !== "CANCELLED"
          );
          if (conflict) throw new Error("SLOT_TAKEN");
        }

        store.appointments[idx] = { ...store.appointments[idx], ...updates, updatedAt: new Date().toISOString() };
        saveLocalStore(store);
        return store.appointments[idx];
      }
    },
  },

  // --- SETTINGS ---
  settings: {
    async getAll(): Promise<Record<string, string>> {
      try {
        const rows = await prisma.setting.findMany();
        const res: Record<string, string> = { ...DEFAULT_SETTINGS };
        rows.forEach((r) => {
          res[r.key] = r.value;
        });
        return res;
      } catch {
        const store = initLocalStore();
        return { ...DEFAULT_SETTINGS, ...store.settings };
      }
    },

    async updateMany(updates: Record<string, string>): Promise<Record<string, string>> {
      try {
        for (const [key, value] of Object.entries(updates)) {
          await prisma.setting.upsert({
            where: { key },
            update: { value },
            create: { key, value },
          });
        }
        return this.getAll();
      } catch {
        const store = initLocalStore();
        store.settings = { ...store.settings, ...updates };
        saveLocalStore(store);
        return { ...DEFAULT_SETTINGS, ...store.settings };
      }
    },
  },
};
