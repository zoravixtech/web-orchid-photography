import React from "react";

interface SectionHeaderProps {
  subtitle?: string; // e.g., "OUR SPECIALIZATIONS", "OUR GALLERY"
  italicTagline?: string; // e.g., "When Love Meets The Artistry Of Our Lens!"
  title: string; // e.g., "A GLIMPSE OF LOVE AND LAUGHTER"
  description?: string; // e.g., "Award Winning Best Wedding Photographer..."
  className?: string;
}

export default function SectionHeader({
  subtitle,
  italicTagline,
  title,
  description,
  className = "mb-14",
}: SectionHeaderProps) {
  return (
    <div className={`text-center flex flex-col items-center ${className}`}>
      {/* Subtle Purple Floral Emblem */}
      <div className="mb-3 text-purple-600 opacity-85">
        <svg
          className="w-8 h-8 mx-auto"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M12 6v12M6 12h12"
          />
        </svg>
      </div>

      {/* Italic Script Tagline if provided */}
      {italicTagline && (
        <p className="font-serif italic text-purple-600 text-sm sm:text-base tracking-wide mb-1">
          {italicTagline}
        </p>
      )}

      {/* Uppercase Tracked Subtitle if provided */}
      {subtitle && (
        <span className="font-serif text-xs font-semibold tracking-[0.3em] uppercase text-purple-600 block mb-2">
          {subtitle}
        </span>
      )}

      {/* Main Serif Section Title */}
      <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl tracking-[0.18em] uppercase text-zinc-900 font-light max-w-4xl leading-snug">
        {title}
      </h2>

      {/* Optional Description / Subtext */}
      {description && (
        <p className="font-serif text-xs sm:text-sm tracking-widest text-zinc-500 uppercase leading-relaxed max-w-xl mt-3">
          {description}
        </p>
      )}
    </div>
  );
}
