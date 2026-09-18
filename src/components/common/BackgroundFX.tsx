"use client";

import React from "react";

export const BackgroundFX: React.FC = () => {
  return (
    <>
      {/* Film grain noise texture */}
      <div className="noise-overlay" aria-hidden="true" />

      {/* Ambient background glow orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        {/* Violet glow top-left */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-accent-primary/10 blur-[130px] animate-pulse-slow" />

        {/* Cyan glow middle-right */}
        <div className="absolute top-[35%] -right-48 w-[650px] h-[650px] rounded-full bg-accent-secondary/10 blur-[150px] animate-float-slow" />

        {/* Deep indigo glow bottom-left */}
        <div className="absolute top-[75%] -left-36 w-[550px] h-[550px] rounded-full bg-accent-primary/8 blur-[140px] animate-float-delayed" />
      </div>
    </>
  );
};
