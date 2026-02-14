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
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 py-6 border-b border-black/5 last:border-0">
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
          <span className="text-[10px] font-bold tracking-[0.2em] text-black/40 uppercase block mb-1">
            Impact Selection
          </span>
          <h4 className="text-xl font-bold text-black font-['Playfair_Display',_serif]">
            {tier ? tier.name : 'Custom Selection'}
          </h4>
          <p className="mt-1 text-sm text-black/60 leading-relaxed max-w-sm">
            {tier 
              ? tier.description 
              : 'A personalized bouquet tailored to your specific budget and preferences.'
            }
          </p>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
        <div className="text-2xl font-bold text-black font-['Playfair_Display',_serif]">
          ${Number(price).toFixed(2)}
        </div>
        {editUrl && (
          <Link 
            to={editUrl} 
            className="text-xs font-semibold text-black/40 hover:text-black underline underline-offset-4 transition-colors"
          >
            Edit
          </Link>
        )}
      </div>
    </div>
  );
};

export default ImpactSummary;
