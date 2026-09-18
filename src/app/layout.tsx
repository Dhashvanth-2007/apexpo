import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/common/SmoothScroll";
import { BackgroundFX } from "@/components/common/BackgroundFX";
import { CustomCursor } from "@/components/common/CustomCursor";
import { WhatsAppCTA } from "@/components/common/WhatsAppCTA";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { COMPANY_DETAILS, SERVICES } from "@/lib/constants";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://apexpo.digital"),
  title: `${COMPANY_DETAILS.name} — ${COMPANY_DETAILS.tagline}`,
  description: `${COMPANY_DETAILS.name} is a premier digital engineering & web development agency. ${COMPANY_DETAILS.subline} Specializing in high-performance web applications, UI/UX systems, and AI automation.`,
  keywords: [
    "Web Development",
    "Next.js Agency",
    "UI/UX Design",
    "E-commerce Development",
    "AI Integration",
    "Conversion Rate Optimization",
    "GSAP Animation",
    "Apexpo"
  ],
  authors: [{ name: "Apexpo Engineering Team" }],
  creator: "Apexpo",
  publisher: "Apexpo Technologies",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://apexpo.digital",
    title: `${COMPANY_DETAILS.name} — ${COMPANY_DETAILS.tagline}`,
    description: `${COMPANY_DETAILS.name} engineers the next generation of cinematic digital experiences. ${COMPANY_DETAILS.subline}`,
    siteName: "Apexpo",
    images: [
      {
        url: "/assets/frames/ezgif-frame-001.jpg",
        width: 1920,
        height: 1080,
        alt: "Apexpo Hero Experience",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${COMPANY_DETAILS.name} — ${COMPANY_DETAILS.tagline}`,
    description: `${COMPANY_DETAILS.name} engineers the next generation of cinematic digital experiences.`,
    creator: "@apexpo",
    images: ["/assets/frames/ezgif-frame-001.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Structured JSON-LD for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: COMPANY_DETAILS.name,
    image: "https://apexpo.digital/assets/frames/ezgif-frame-001.jpg",
    description: COMPANY_DETAILS.tagline,
    address: {
      "@type": "PostalAddress",
      streetAddress: "790 Cyber Way, Suite 400",
      addressLocality: "San Francisco",
      addressRegion: "CA",
      postalCode: "94107",
      addressCountry: "US",
    },
    telephone: COMPANY_DETAILS.phone,
    email: COMPANY_DETAILS.email,
    url: "https://apexpo.digital",
    priceRange: "$$$$",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Digital Engineering & Web Development Services",
      itemListElement: SERVICES.map((s, i) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: s.title,
          description: s.description,
        },
      })),
    },
  };

  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} dark`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#05060A] text-text-primary antialiased selection:bg-accent-primary/40 selection:text-white">
        <SmoothScroll>
          <BackgroundFX />
          <CustomCursor />
          <Navbar />
          {children}
          <Footer />
          <WhatsAppCTA />
        </SmoothScroll>
      </body>
    </html>
  );
}
