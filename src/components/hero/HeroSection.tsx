"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { VideoScrubber } from "./VideoScrubber";
import { HeroOverlay } from "./HeroOverlay";

export const HeroSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [currentFrame, setCurrentFrame] = useState(1);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile / touch device
    const checkMobile = () => {
      const mobile = window.innerWidth < 768 || window.matchMedia("(pointer: coarse)").matches;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (isMobile || !containerRef.current) return;

    const frameObj = { frame: 1 };

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "+=220%",
      pin: true,
      scrub: 0.6,
      anticipatePin: 1,
      onUpdate: (self) => {
        const p = self.progress;
        setScrollProgress(p);
        const targetFrame = Math.round(1 + p * 239);
        setCurrentFrame(targetFrame);
      },
    });

    return () => {
      trigger.kill();
    };
  }, [isMobile]);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-[#05060A]"
    >
      {/* Scroll-scrubbed video canvas background */}
      <VideoScrubber currentFrame={currentFrame} isMobile={isMobile} />

      {/* Hero interactive overlay: right-aligned typography, CTAs, indicators */}
      <HeroOverlay scrollProgress={scrollProgress} />
    </section>
  );
};
