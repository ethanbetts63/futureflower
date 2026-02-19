import React, { type ReactNode } from 'react';

interface BadgeProps {
  title: string;
  subtext: string;
  symbol: ReactNode; // Can be an SVG, img, or any ReactNode
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ title, subtext, symbol, className = "" }) => {
  return (
    <div className={`z-10 ${className}`}>
      <div className="bg-white/95 backdrop-blur-md rounded-2xl px-6 py-5 shadow-xl flex items-center gap-4">
        <div className="bg-[var(--colorgreen)] rounded-xl p-3">
          {symbol}
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            {/* Checkmark SVG, common to both */}
            <svg
              className="h-4 w-4 text-[var(--colorgreen)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-base font-bold text-gray-900 uppercase tracking-wide">{title}</span>
          </div>
          <span className="text-xs text-black pl-4 mt-0.5">{subtext}</span>
        </div>
      </div>
    </div>
  );
};

export default Badge;
