"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

interface VideoScrubberProps {
  currentFrame: number; // 1 to 240
  isMobile: boolean;
}

const TOTAL_FRAMES = 240;

export const VideoScrubber: React.FC<VideoScrubberProps> = ({ currentFrame, isMobile }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const [firstFrameLoaded, setFirstFrameLoaded] = useState(false);

  // Helper to format frame path: 1 -> /assets/frames/ezgif-frame-001.jpg
  const getFrameUrl = useCallback((index: number) => {
    const padded = String(Math.min(TOTAL_FRAMES, Math.max(1, index))).padStart(3, "0");
    return `/assets/frames/ezgif-frame-${padded}.jpg`;
  }, []);

  // Draw image on canvas with cover scaling
  const drawImageProp = useCallback((img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth || 1920;
    const ih = img.naturalHeight || 1080;

    const hRatio = cw / iw;
    const vRatio = ch / ih;
    const ratio = Math.max(hRatio, vRatio);

    // Shift frame slightly to the right on wide displays so walking figure is showcased on the right half
    const centerShiftX = cw > iw * ratio ? (cw - iw * ratio) / 2 : Math.max(cw - iw * ratio, (cw - iw * ratio) * 0.25);
    const centerShiftY = (ch - ih * ratio) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(
      img,
      0,
      0,
      iw,
      ih,
      centerShiftX,
      centerShiftY,
      iw * ratio,
      ih * ratio
    );
  }, []);

  // Preload frames progressively
  useEffect(() => {
    if (isMobile) return;

    let isMounted = true;

    // Load first frame immediately
    const firstImg = new Image();
    firstImg.src = getFrameUrl(1);
    firstImg.onload = () => {
      if (!isMounted) return;
      imagesRef.current.set(1, firstImg);
      setFirstFrameLoaded(true);
      drawImageProp(firstImg);
    };

    // Progressively load remaining frames in batches to avoid network congestion
    const preloadBatch = async () => {
      // Prioritize key intervals first for immediate scrubbing fidelity
      const step = 2; // load every 2nd frame first
      for (let i = 2; i <= TOTAL_FRAMES; i += step) {
        if (!isMounted) break;
        const img = new Image();
        img.src = getFrameUrl(i);
        img.onload = () => {
          if (isMounted) imagesRef.current.set(i, img);
        };
      }

      // Then fill in the rest
      for (let i = 3; i <= TOTAL_FRAMES; i += step) {
        if (!isMounted) break;
        const img = new Image();
        img.src = getFrameUrl(i);
        img.onload = () => {
          if (isMounted) imagesRef.current.set(i, img);
        };
      }
    };

    preloadBatch();

    return () => {
      isMounted = false;
    };
  }, [isMobile, getFrameUrl, drawImageProp]);

  // Handle window resizing for canvas internal resolution
  useEffect(() => {
    if (isMobile) return;

    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;

      // Re-draw current frame
      const cached = imagesRef.current.get(currentFrame) || imagesRef.current.get(1);
      if (cached) drawImageProp(cached);
    };

    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile, currentFrame, drawImageProp]);

  // Render frame as currentFrame updates
  useEffect(() => {
    if (isMobile) return;

    const frame = Math.round(currentFrame);
    // Find closest loaded frame if this exact one is still pending
    let imgToDraw = imagesRef.current.get(frame);
    if (!imgToDraw) {
      for (let delta = 1; delta <= 10; delta++) {
        imgToDraw = imagesRef.current.get(frame - delta) || imagesRef.current.get(frame + delta);
        if (imgToDraw) break;
      }
    }
    if (imgToDraw) {
      drawImageProp(imgToDraw);
    }
  }, [currentFrame, isMobile, drawImageProp]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#05060A]">
      {/* Mobile Fallback HTML5 Loop Video */}
      <video
        src="/assets/hero-video.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover object-center block md:hidden"
      />

      {/* Desktop High-Performance 60FPS Canvas Scrub */}
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover hidden md:block"
        style={{ width: "100%", height: "100%" }}
      />

      {/* Subtle left gradient mask: confined to left text column so animation remains vivid */}
      <div 
        className="absolute top-0 bottom-0 left-0 w-full sm:w-3/5 lg:w-[45%] pointer-events-none bg-gradient-to-r from-[#05060A]/95 via-[#05060A]/60 to-transparent opacity-90"
        aria-hidden="true" 
      />

      {/* Additional top and bottom subtle gradients for seamless edge blending */}
      <div 
        className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#05060A]/70 via-transparent to-[#05060A] opacity-90"
        aria-hidden="true" 
      />
    </div>
  );
};
