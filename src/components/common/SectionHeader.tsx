import React from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  highlightedTitle?: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  title,
  highlightedTitle,
  description,
  align = "center",
  className,
}) => {
  return (
    <div
      className={cn(
        "max-w-3xl mb-16",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      {/* Eyebrow badge */}
      <div className={cn("inline-flex items-center gap-2 mb-4", align === "center" && "justify-center")}>
        <span className="w-2 h-2 rounded-full bg-accent-secondary animate-pulse" />
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-accent-secondary">
          {eyebrow}
        </span>
      </div>

      {/* Main Title */}
      <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
        {title}{" "}
        {highlightedTitle && (
          <span className="text-gradient-purple">{highlightedTitle}</span>
        )}
      </h2>

      {/* Description */}
      {description && (
        <p className="text-base md:text-lg text-text-muted leading-relaxed font-light">
          {description}
        </p>
      )}
    </div>
  );
};
