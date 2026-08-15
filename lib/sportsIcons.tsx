"use client";

import React from "react";

interface SportIconProps {
  slug?: string;
  name?: string;
  iconUrl?: string;
  className?: string;
}

export function SportIcon({ slug = "", name = "", iconUrl, className = "w-8 h-8" }: SportIconProps) {
  const key = (slug || name).toLowerCase().replace(/[^a-z0-9]/g, "");

  // If a valid external icon SVG/image URL is provided and not broken, render img with fallback SVG
  if (iconUrl && (iconUrl.startsWith("http") || iconUrl.startsWith("/"))) {
    return (
      <img
        src={iconUrl}
        alt={name || slug}
        className={`${className} object-contain`}
        onError={(e) => {
          // Hide image and fallback to SVG vector
          (e.target as HTMLElement).style.display = "none";
          if ((e.target as HTMLElement).nextElementSibling) {
            ((e.target as HTMLElement).nextElementSibling as HTMLElement).style.display = "block";
          }
        }}
      />
    );
  }

  return renderSvgIcon(key, className);
}

export function getSportSvg(slugOrName: string, className: string = "w-8 h-8") {
  const key = (slugOrName || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  return renderSvgIcon(key, className);
}

function renderSvgIcon(key: string, className: string) {
  // 1. Football / Soccer
  if (key.includes("football") || key.includes("soccer")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" className="stroke-cyan-400" />
        <polygon points="12 7 14.5 9 13.5 12 10.5 12 9.5 9 12 7" className="fill-cyan-400/30 stroke-cyan-400" />
        <line x1="12" y1="3" x2="12" y2="7" />
        <line x1="14.5" y1="9" x2="19" y2="9.5" />
        <line x1="13.5" y1="12" x2="16.5" y2="16" />
        <line x1="10.5" y1="12" x2="7.5" y2="16" />
        <line x1="9.5" y1="9" x2="5" y2="9.5" />
      </svg>
    );
  }

  // 2. Tennis
  if (key.includes("tennis")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="15" cy="9" r="6" className="stroke-cyan-400" />
        <path d="M10.8 13.2L4 20" className="stroke-cyan-400" />
        <line x1="3" y1="21" x2="5" y2="19" className="stroke-cyan-300" />
        <path d="M12 9C12 12.3 14.7 15 18 15" className="stroke-cyan-300" />
        <path d="M15 6C11.7 6 9 8.7 9 12" className="stroke-cyan-300" />
      </svg>
    );
  }

  // 3. Basketball
  if (key.includes("basketball")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" className="stroke-cyan-400" />
        <line x1="3" y1="12" x2="21" y2="12" className="stroke-cyan-400" />
        <line x1="12" y1="3" x2="12" y2="21" className="stroke-cyan-400" />
        <path d="M5.5 5.5C8 8 8 16 5.5 18.5" className="stroke-cyan-300" />
        <path d="M18.5 5.5C16 8 16 16 18.5 18.5" className="stroke-cyan-300" />
      </svg>
    );
  }

  // 4. Cricket
  if (key.includes("cricket")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 19L16 8L18 10L7 21H5V19Z" className="fill-cyan-400/20 stroke-cyan-400" />
        <line x1="16" y1="8" x2="20" y2="4" className="stroke-cyan-400" />
        <circle cx="19" cy="17" r="2.5" className="fill-cyan-400 stroke-cyan-400" />
      </svg>
    );
  }

  // 5. Hockey
  if (key.includes("hockey")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4L13 17C14 18.5 15.5 19.5 17.5 19.5H20C20.8 19.5 21.5 18.8 21.5 18C21.5 17.2 20.8 16.5 20 16.5H18" className="stroke-cyan-400" />
        <ellipse cx="7" cy="19" rx="3" ry="1.5" className="fill-cyan-400 stroke-cyan-400" />
      </svg>
    );
  }

  // 6. Golf
  if (key.includes("golf")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="21" x2="12" y2="4" className="stroke-cyan-400" />
        <polygon points="12 4 19 7 12 10" className="fill-cyan-400/40 stroke-cyan-400" />
        <circle cx="9" cy="19" r="2" className="fill-cyan-300 stroke-cyan-400" />
        <path d="M5 21C7 20.5 17 20.5 19 21" className="stroke-cyan-500/50" />
      </svg>
    );
  }

  // 7. Baseball
  if (key.includes("baseball")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" className="stroke-cyan-400" />
        <path d="M7 4.5C9 8 9 16 7 19.5" className="stroke-cyan-300" />
        <path d="M17 4.5C15 8 15 16 17 19.5" className="stroke-cyan-300" />
      </svg>
    );
  }

  // 8. Formula 1 / Motorsport
  if (key.includes("formula") || key.includes("f1") || key.includes("racing") || key.includes("motorsport")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 17h18M3 13h18M3 9h18M3 5h18" className="stroke-cyan-500/30" />
        <path d="M4 17l4-12h8l4 12" className="stroke-cyan-400" />
        <circle cx="7" cy="17" r="2" className="fill-cyan-400 stroke-cyan-400" />
        <circle cx="17" cy="17" r="2" className="fill-cyan-400 stroke-cyan-400" />
      </svg>
    );
  }

  // 9. Boxing
  if (key.includes("boxing")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 11V7a4 4 0 0 1 8 0v4a3 3 0 0 1 3 3v2a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4v-2a3 3 0 0 1 1-3z" className="fill-cyan-400/20 stroke-cyan-400" />
        <line x1="9" y1="17" x2="15" y2="17" className="stroke-cyan-400" />
      </svg>
    );
  }

  // 10. Rugby
  if (key.includes("rugby")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="12" rx="9" ry="6" transform="rotate(-45 12 12)" className="stroke-cyan-400" />
        <line x1="7" y1="17" x2="17" y2="7" className="stroke-cyan-300" />
        <line x1="10" y1="12" x2="12" y2="14" className="stroke-cyan-300" />
        <line x1="12" y1="10" x2="14" y2="12" className="stroke-cyan-300" />
      </svg>
    );
  }

  // 11. Wrestling
  if (key.includes("wrestling")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3a9 9 0 0 0-9 9c0 4.97 4.03 9 9 9s9-4.03 9-9a9 9 0 0 0-9-9z" className="stroke-cyan-500/30" />
        <rect x="7" y="9" width="10" height="6" rx="2" className="fill-cyan-400/30 stroke-cyan-400" />
        <circle cx="12" cy="12" r="1.5" className="fill-cyan-400" />
      </svg>
    );
  }

  // 12. Athletics / Running
  if (key.includes("athletics") || key.includes("running") || key.includes("track")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="14" cy="5" r="2" className="fill-cyan-400 stroke-cyan-400" />
        <path d="M7 21l3-6 3 2 4-5" className="stroke-cyan-400" />
        <path d="M10 11l2-3 4 2" className="stroke-cyan-400" />
      </svg>
    );
  }

  // Fallback: Generic Trophy / Sports Star
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2" className="stroke-cyan-400" />
      <path d="M18 9h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2" className="stroke-cyan-400" />
      <path d="M4 22h16" className="stroke-cyan-400" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" className="stroke-cyan-400" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" className="stroke-cyan-400" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" className="fill-cyan-400/20 stroke-cyan-400" />
    </svg>
  );
}
