import React from 'react';
import { Link } from 'react-router-dom';

interface BecomePartnerButtonProps {
  className?: string;
}

export const BecomePartnerButton: React.FC<BecomePartnerButtonProps> = ({ className = '' }) => {
  return (
    <Link
      to="/partner/register"
      className={`inline-flex items-center gap-2 bg-green-600 text-white font-medium px-6 py-3 rounded-md hover:bg-green-700 transition-colors text-center shadow-sm ${className}`}
    >
      Get Started
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
    </Link>
  );
};
