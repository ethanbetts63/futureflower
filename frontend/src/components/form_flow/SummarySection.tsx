import React from 'react';
import { Link } from 'react-router-dom';

interface SummarySectionProps {
  label: string;
  children: React.ReactNode;
  editUrl?: string;
}

const SummarySection: React.FC<SummarySectionProps> = ({ label, children, editUrl }) => {
  return (
    <div className="flex flex-col sm:flex-row items-start justify-between gap-4 py-6 border-b border-black/5 last:border-0">
      <div className="flex-1">
        <span className="text-[10px] font-bold tracking-[0.2em] text-black/40 uppercase block mb-2">
          {label}
        </span>
        <div className="text-black leading-relaxed">
          {children}
        </div>
      </div>
      
      {editUrl && (
        <div className="flex-shrink-0 pt-1">
          <Link 
            to={editUrl} 
            className="text-xs font-semibold text-black/40 hover:text-black underline underline-offset-4 transition-colors"
          >
            Edit
          </Link>
        </div>
      )}
    </div>
  );
};

export default SummarySection;
