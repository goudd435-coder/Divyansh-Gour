import React from 'react';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
}

export default function Logo({ className = '', iconOnly = false }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Crown Icon */}
      <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-red-600/10 border border-red-600/30 text-red-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6 animate-pulse"
        >
          {/* Custom Dual Crowns path or Crown Path */}
          <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z" />
          <path d="M3 20h18a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1z" />
        </svg>
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
      </div>

      {!iconOnly && (
        <div className="flex flex-col">
          <span className="font-display font-bold text-lg tracking-wider text-white uppercase leading-none">
            ROYAL <span className="text-red-500">FITNESS</span>
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-gray-400 font-bold leading-none mt-1">
            CLUB
          </span>
        </div>
      )}
    </div>
  );
}
