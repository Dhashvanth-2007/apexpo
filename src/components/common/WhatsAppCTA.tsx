"use client";

import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { COMPANY_DETAILS } from "@/lib/constants";

export const WhatsAppCTA: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(true);

  const whatsappUrl = `https://wa.me/${COMPANY_DETAILS.whatsappNumber}?text=${encodeURIComponent(COMPANY_DETAILS.whatsappMessage)}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end flex-col gap-2">
      {/* Tooltip badge */}
      {showTooltip && (
        <div className="relative group bg-[#0D101B]/95 text-xs text-text-primary px-3.5 py-2 rounded-xl border border-border-glass shadow-2xl backdrop-blur-md flex items-center gap-2 max-w-[220px] transition-all animate-fade-in">
          <span>Chat with our engineers live</span>
          <button
            onClick={() => setShowTooltip(false)}
            aria-label="Close tooltip"
            className="text-text-muted hover:text-white transition-colors"
          >
            <X size={13} />
          </button>
        </div>
      )}

      {/* Floating CTA button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp with Apexpo"
        className="relative group flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-[0_4px_25px_rgba(37,211,102,0.4)] hover:shadow-[0_6px_35px_rgba(37,211,102,0.7)] transition-all duration-300 hover:scale-110 active:scale-95"
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25" />
        <MessageCircle className="w-7 h-7 fill-white text-white relative z-10" />
      </a>
    </div>
  );
};
