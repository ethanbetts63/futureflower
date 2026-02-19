import React from 'react';
import { Link } from 'react-router-dom';
import type { SummarySectionProps } from '@/types/SummarySectionProps';

const SummarySection: React.FC<SummarySectionProps> = ({ label, children, editUrl }) => {
  return (
    <div className="py-6 border-b border-black/5 last:border-0">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold tracking-[0.2em] text-black uppercase">
          {label}
        </span>
        {editUrl && (
          <Link
            to={editUrl}
            className="text-xs font-semibold text-black/40 hover:text-black underline underline-offset-4 transition-colors"
          >
            Edit
          </Link>
        )}
      </div>
      <div className="text-black leading-relaxed">
        {children}
      </div>
    </div>
  );
};

export default SummarySection;
