import React from 'react';

export interface ComparisonRow {
  feature: string;
  them: string;
  us: string;
}

interface ComparisonTableProps {
  title: string;
  rows: ComparisonRow[];
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({ title, rows }) => (
  <div className="flex flex-col items-center justify-center p-4 md:p-12 lg:px-20 bg-[var(--color4)]">
    <p className="mb-6 text-s font-bold tracking-[0.2em] text-black uppercase">
      {title}
    </p>
    <div className="w-full max-w-2xl bg-white rounded-2xl shadow-md border border-black/5 overflow-hidden">

      {/* Column headers */}
      <div className="grid grid-cols-3 text-[10px] md:text-xs font-semibold uppercase tracking-wider border-b border-black/5">
        <div className="px-4 md:px-8 py-4 text-black/40">Feature</div>
        <div className="px-2 md:px-6 py-4 text-center text-black/40">Big Networks</div>
        <div className="px-2 md:px-6 py-4 text-center text-black font-bold bg-[var(--colorgreen)]/[0.06]">FutureFlower</div>
      </div>

      {/* Rows */}
      {rows.map((row, i) => (
        <div
          key={row.feature}
          className={`grid grid-cols-3 text-xs md:text-sm ${
            i < rows.length - 1 ? 'border-b border-black/5' : ''
          }`}
        >
          <div className="flex items-center px-4 md:px-8 py-4 md:py-5 font-medium text-black">
            {row.feature}
          </div>
          <div className="flex items-center justify-center px-2 md:px-6 py-4 md:py-5 text-center text-black/50">
            {row.them}
          </div>
          <div className="flex items-center justify-center px-2 md:px-6 py-4 md:py-5 text-center font-semibold text-black bg-[var(--colorgreen)]/[0.06]">
            {row.us}
          </div>
        </div>
      ))}
    </div>
  </div>
);
