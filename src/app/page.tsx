import React from "react";
import { HeroSection } from "@/components/hero/HeroSection";
import { TrustMetrics } from "@/components/sections/TrustMetrics";
import { Services } from "@/components/sections/Services";
import { Portfolio } from "@/components/sections/Portfolio";
import { Industries } from "@/components/sections/Industries";
import { Testimonials } from "@/components/sections/Testimonials";
import { Pricing } from "@/components/sections/Pricing";
import { FAQ } from "@/components/sections/FAQ";
import { Booking } from "@/components/sections/Booking";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <main className="relative z-10 flex min-h-screen flex-col bg-[#05060A]">
      {/* 1. Scroll-scrubbed video hero */}
      <HeroSection />

      {/* 2. Trust Metrics & Performance Guarantee Banner */}
      <TrustMetrics />

      {/* 3. Core agency services grid */}
      <Services />

      {/* 4. Our Work: Interactive project preview grid (7 categories) */}
      <Portfolio />

      {/* 5. Industries served */}
      <Industries />

      {/* 6. Client testimonials & social proof */}
      <Testimonials />

      {/* 7. Transparent glassmorphism pricing packages */}
      <Pricing />

      {/* 8. Technical FAQ accordion */}
      <FAQ />

      {/* 9. Book a consultation interactive scheduling widget */}
      <Booking />

      {/* 10. Contact & Enquiry validated form */}
      <Contact />
    </main>
  );
}

