import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { 
  Code2, Smartphone, Layers, ShoppingBag, Palette, Zap, 
  Calendar, Cpu, Search, MapPin, BarChart2, ShieldCheck, 
  Terminal, ArrowRight, CheckCircle2, Sparkles 
} from "lucide-react";
import { SectionHeader } from "@/components/common/SectionHeader";

export const metadata: Metadata = {
  title: "APEXPO Services — High-Performance Digital & Software Engineering",
  description: "Explore APEXPO's 13 core capabilities spanning responsive web development, native mobile apps, SaaS web applications, AI automation, and enterprise support.",
};

const SERVICES_DATA = [
  {
    num: "01",
    title: "Website Development",
    slug: "website-development",
    icon: Code2,
    description: "High-performance, pixel-perfect web experiences engineered with modern frameworks, fluid typography, and sub-second load times.",
    features: [
      "Next.js App Router & React 18+",
      "Fluid responsive layouts across 320px–4K",
      "Lighthouse 95+ performance scores",
      "Semantic HTML5 & accessible architecture",
      "Lifetime Free Service maintenance included"
    ],
    startingPrice: "Starting from ₹4,999",
  },
  {
    num: "02",
    title: "Mobile App Development",
    slug: "mobile-app-development",
    icon: Smartphone,
    description: "Custom native & cross-platform mobile apps for iOS and Android with offline synchronization, instant push alerts, and app store deployment.",
    features: [
      "React Native & Flutter cross-platform builds",
      "Offline data synchronization with SQLite",
      "Real-time push notifications & badge counts",
      "Biometric authentication (FaceID / Fingerprint)",
      "App Store & Google Play submission management"
    ],
    startingPrice: "Starting from ₹24,999",
  },
  {
    num: "03",
    title: "Web App Development",
    slug: "web-app-development",
    icon: Layers,
    description: "Mission-critical enterprise software, client portals, SaaS architectures, and interactive 3D/canvas dashboards.",
    features: [
      "Full-stack Next.js & Node.js backend",
      "PostgreSQL with Prisma ORM architecture",
      "Role-based access control (RBAC)",
      "Encrypted data storage & JWT sessions",
      "Interactive analytics & telemetry dashboards"
    ],
    startingPrice: "Starting from ₹29,999",
  },
  {
    num: "04",
    title: "E-Commerce Development",
    slug: "ecommerce-development",
    icon: ShoppingBag,
    description: "High-converting online flagships with frictionless checkouts, custom product customizers, and multi-currency payment gateways.",
    features: [
      "Headless Shopify Plus & NextCommerce",
      "Slide-out micro-cart drawers",
      "Instant 1-tap Apple Pay, Stripe, & UPI checkout",
      "Dynamic variant pickers & inventory sync",
      "Automated abandoned cart recovery hooks"
    ],
    startingPrice: "Starting from ₹14,999",
  },
  {
    num: "05",
    title: "UI/UX Design",
    slug: "ui-ux-design",
    icon: Palette,
    description: "Cinematic, editorial design systems rooted in user psychology, high-contrast aesthetics, and tactile micro-interactions.",
    features: [
      "Complete Figma design tokens & wireframes",
      "Interactive clickable prototypes",
      "User behavior journey mapping",
      "Kinetic micro-animations & physics",
      "Comprehensive design system component library"
    ],
    startingPrice: "Starting from ₹9,999",
  },
  {
    num: "06",
    title: "Landing Pages",
    slug: "landing-pages",
    icon: Zap,
    description: "Hypnotic, single-minded landing pages engineered for rapid customer acquisition, investor showcases, and product drops.",
    features: [
      "Sub-1s initial paint latency",
      "Scroll-triggered product breakdowns",
      "High-conversion multi-step capture funnels",
      "Integrated A/B multivariate testing hooks",
      "Direct CRM & webhook pipeline sync"
    ],
    startingPrice: "Starting from ₹4,999",
  },
  {
    num: "07",
    title: "Event Websites & Apps",
    slug: "event-websites-apps",
    icon: Calendar,
    description: "High-voltage summit landing pads featuring live countdown clocks, multi-track agenda schedules with speaker filters, and VIP ticketing.",
    features: [
      "Real-time countdown launch timers",
      "Multi-track interactive schedule filters",
      "VIP ticketing RSVP & QR check-in flows",
      "Speaker bio showcase modal popups",
      "Interactive venue hall maps"
    ],
    startingPrice: "Starting from ₹12,999",
  },
  {
    num: "08",
    title: "AI Integration & Automation",
    slug: "ai-integration",
    icon: Cpu,
    description: "Embed state-of-the-art LLMs, autonomous customer concierge chatbots, neural search, and workflow automation into your site.",
    features: [
      "OpenAI & Gemini API embeddings",
      "RAG architecture on company documents",
      "Real-time token streaming chat interfaces",
      "Autonomous customer support routing",
      "Automated lead enrichment & dispatch"
    ],
    startingPrice: "Starting from ₹19,999",
  },
  {
    num: "09",
    title: "SEO & Digital Growth",
    slug: "seo-digital-growth",
    icon: Search,
    description: "Technical search architecture, JSON-LD structured schemas, Open Graph protocols, and semantic hierarchy for organic rank dominance.",
    features: [
      "Automated XML sitemaps & robots protocols",
      "Deep JSON-LD schema microdata generation",
      "Core Web Vitals sub-second optimization",
      "Keyword intent mapping & rank tracking",
      "Monthly conversion reporting"
    ],
    startingPrice: "Starting from ₹3,499/mo",
  },
  {
    num: "10",
    title: "Google Business Optimization",
    slug: "google-business-optimization",
    icon: MapPin,
    description: "Dominate local Google Search and Maps rankings with optimized business attributes, review funnels, and localized search signals.",
    features: [
      "Google Map 3-pack ranking optimization",
      "Local citation & geo-tag syncing",
      "Automated review collection triggers",
      "Weekly photo & promotional post cadence",
      "Local competitor search audit"
    ],
    startingPrice: "Starting from ₹2,499",
  },
  {
    num: "11",
    title: "Analytics & Reporting",
    slug: "analytics-reporting",
    icon: BarChart2,
    description: "Full-funnel telemetry with GA4, server-side Google Tag Manager, custom scroll/interaction events, and executive dashboards.",
    features: [
      "Server-side Google Tag Manager (GTM)",
      "GA4 custom event & funnel tracking",
      "Executive Looker Studio dashboards",
      "Hotjar / Microsoft Clarity heatmap setup",
      "Omnichannel attribution modeling"
    ],
    startingPrice: "Starting from ₹4,999",
  },
  {
    num: "12",
    title: "Maintenance & Support",
    slug: "maintenance-support",
    icon: ShieldCheck,
    description: "Continuous enterprise care, security patching, dependency upgrades, 24/7 uptime monitoring, and SLA-backed turnaround.",
    features: [
      "Weekly cloud backups & disaster recovery",
      "Zero-day dependency vulnerability patches",
      "24/7 uptime monitoring with instant alerts",
      "Lifetime Free Service guarantee backing",
      "2-hour priority WhatsApp helpline"
    ],
    startingPrice: "Starting from ₹1,499/mo",
  },
  {
    num: "13",
    title: "Custom Software Solutions",
    slug: "custom-software",
    icon: Terminal,
    description: "Tailored enterprise software, automated CRM workflows, inventory management systems, and specialized business integrations.",
    features: [
      "Bespoke backend APIs & microservices",
      "Custom business workflow automations",
      "Third-party ERP & payment integrations",
      "Full source code ownership & documentation",
      "Enterprise security compliance"
    ],
    startingPrice: "Let's Talk",
  },
];

export default function ServicesPage() {
  return (
    <main className="pt-32 pb-24 px-6 md:px-12 bg-[#05060A] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="Capabilities Catalog"
          title="Engineered for performance,"
          highlightedTitle="built to scale"
          description="From high-voltage web applications to bespoke mobile solutions and intelligent AI pipelines — explore our complete engineering capabilities."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {SERVICES_DATA.map((svc) => {
            const Icon = svc.icon;
            return (
              <div
                key={svc.slug}
                className="group relative rounded-3xl p-8 bg-surface-glass border border-border-glass hover:border-accent-secondary/50 backdrop-blur-xl transition-all duration-500 hover:shadow-[0_15px_40px_rgba(0,229,199,0.15)] hover:-translate-y-1.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-accent-secondary/10 border border-accent-secondary/20 flex items-center justify-center text-accent-secondary group-hover:scale-110 transition-transform">
                      <Icon size={22} />
                    </div>
                    <span className="text-xs font-mono font-bold text-text-subtle group-hover:text-accent-secondary transition-colors">
                      {svc.num}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-accent-secondary transition-colors">
                    {svc.title}
                  </h3>

                  <p className="text-xs text-text-muted leading-relaxed font-light mb-6">
                    {svc.description}
                  </p>

                  <div className="space-y-2 pt-4 border-t border-border-glass/60 mb-6">
                    {svc.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-text-muted">
                        <CheckCircle2 size={13} className="text-accent-secondary shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-border-glass flex items-center justify-between">
                  <span className="text-xs font-bold text-accent-secondary">
                    {svc.startingPrice}
                  </span>
                  <Link
                    href={`/contact?service=${encodeURIComponent(svc.title)}`}
                    className="flex items-center gap-1 text-xs font-extrabold text-white uppercase tracking-wider group-hover:text-accent-secondary transition-colors"
                  >
                    <span>START A PROJECT</span>
                    <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-24 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-accent-primary/20 via-[#0A0D1A] to-accent-secondary/20 border border-border-glass flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-accent-secondary block mb-2">
              Bespoke Enterprise Scope?
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Have a complex multi-platform project?
            </h3>
            <p className="text-xs text-text-muted mt-2 max-w-xl font-light">
              We architect unified digital ecosystems combining web, native mobile apps, database architecture, and custom AI workflows.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-8 py-4 rounded-full bg-gradient-accent text-black font-extrabold text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(0,229,199,0.5)] hover:scale-105 transition-all shrink-0"
          >
            START A PROJECT
          </Link>
        </div>
      </div>
    </main>
  );
}
