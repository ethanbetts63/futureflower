import React from 'react';
import { Link } from 'react-router-dom';
import { getImpactTier } from '@/utils/pricingConstants';
import flowerIcon from '@/assets/flower_symbol.svg';

interface ImpactSummaryProps {
  price: number;
  editUrl?: string;
}

const ImpactSummary: React.FC<ImpactSummaryProps> = ({ price, editUrl }) => {
  const tier = getImpactTier(price);

  return (
    <div className="py-6 border-b border-black/5 last:border-0">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold tracking-[0.2em] text-black uppercase">
          Impact Selection
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
      <div className="flex items-start gap-5">
        <div className="flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden shadow-sm border border-black/5">
          {tier ? (
            <img
              src={tier.image}
              alt={tier.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[var(--color4)] flex items-center justify-center">
              <img src={flowerIcon} alt="" className="h-8 w-8 opacity-20" />
            </div>
          )}
        </div>
        <div>
          <h4 className="text-xl font-bold text-black font-['Playfair_Display',_serif]">
            {tier ? tier.name : 'Custom Selection'}
          </h4>
          <p className="mt-1 text-sm text-black/60 leading-relaxed max-w-sm">
            {tier
              ? tier.description
              : 'A personalized bouquet tailored to your specific budget and preferences.'
            }
          </p>
          <div className="text-2xl font-bold text-black font-['Playfair_Display',_serif] mt-2">
            ${Number(price).toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpactSummary;
