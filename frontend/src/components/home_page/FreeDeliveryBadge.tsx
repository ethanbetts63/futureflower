import React from 'react';
import deliveryIcon from '../../assets/delivery_symbol.svg';

interface FreeDeliveryBadgeProps {
  className?: string;
}

const FreeDeliveryBadge: React.FC<FreeDeliveryBadgeProps> = ({ className = "" }) => {
  return (
    <div className={`z-10 ${className}`}>
      <div className="bg-white/95 backdrop-blur-md rounded-2xl px-6 py-5 shadow-xl flex items-center gap-4">
        <div className="bg-[var(--colorgreen)] rounded-xl p-3">
          <img 
            src={deliveryIcon} 
            alt="" 
            className="h-7 w-7 animate-bounce" 
            style={{ animationDuration: '2s' }} 
          />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <svg 
              className="h-4 w-4 text-[var(--colorgreen)]" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-base font-bold text-gray-900 uppercase tracking-wide">Free Delivery</span>
          </div>
          <span className="text-xs text-black pl-4 mt-0.5">Included on all products</span>
        </div>
      </div>
    </div>
  );
};

export default FreeDeliveryBadge;
