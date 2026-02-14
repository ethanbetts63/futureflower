import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { IMPACT_TIERS, TIER_PRICES, MIN_BUDGET } from '@/utils/pricingConstants';

interface ImpactTierSelectorProps {
  value: number;
  onChange: (budget: number) => void;
}

export const ImpactTierSelector: React.FC<ImpactTierSelectorProps> = ({ value, onChange }) => {
  const isCustom = !TIER_PRICES.has(value);
  const [showCustom, setShowCustom] = useState(isCustom);
  const [customInput, setCustomInput] = useState(isCustom ? String(value) : '');

  const handleTierSelect = (price: number) => {
    setShowCustom(false);
    setCustomInput('');
    onChange(price);
  };

  const handleCustomToggle = () => {
    setShowCustom(true);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setCustomInput(raw);

    const parsed = parseInt(raw, 10);
    if (!isNaN(parsed) && parsed >= MIN_BUDGET) {
      onChange(parsed);
    }
  };

  const handleCustomBlur = () => {
    const parsed = parseInt(customInput, 10);
    if (isNaN(parsed) || parsed < MIN_BUDGET) {
      setCustomInput(String(MIN_BUDGET));
      onChange(MIN_BUDGET);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-black font-['Playfair_Display',_serif]">
          Choose Your Impact
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Every tier includes delivery, a hand-tied bouquet, and a personal card message.
        </p>
      </div>

      {/* Tier cards */}
      <div className="flex gap-4 lg:gap-6 overflow-x-auto pt-2 pb-4 snap-x snap-mandatory scrollbar-hide">
        {IMPACT_TIERS.map((tier) => {
          const isSelected = value === tier.price && !showCustom;
          return (
            <button
              key={tier.price}
              type="button"
              onClick={() => handleTierSelect(tier.price)}
              className={`relative bg-white rounded-2xl overflow-hidden text-left transition-all cursor-pointer flex flex-col flex-shrink-0 w-72 md:w-auto md:flex-1 snap-start ${
                isSelected
                  ? 'ring-2 ring-[var(--colorgreen)] shadow-lg'
                  : 'shadow-md hover:-translate-y-1 hover:shadow-lg'
              }`}
            >
              {/* Badge */}
              {tier.badge && (
                <span className="absolute top-3 right-3 bg-[var(--colorgreen)] text-black text-xs font-bold px-2.5 py-1 rounded-full z-10">
                  {tier.badge}
                </span>
              )}

              {/* Selected indicator */}
              {isSelected && (
                <span className="absolute top-3 left-3 flex items-center justify-center w-6 h-6 bg-[var(--colorgreen)] rounded-full z-10">
                  <svg className="w-3.5 h-3.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              )}

              {/* Image */}
              <img
                src={tier.image}
                alt={tier.name}
                className="w-full h-40 md:h-44 object-cover"
                loading="lazy"
              />

              {/* Content */}
              <div className="p-5 flex-1">
                <div className="flex items-baseline justify-between gap-x-4 mb-2">
                  <h4 className="text-lg font-bold text-gray-900 font-['Playfair_Display',_serif]">
                    {tier.name}
                  </h4>
                  <span className="text-lg font-bold text-black">${tier.price}</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {tier.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Custom amount */}
      <div className="mt-6">
        {!showCustom ? (
          <button
            type="button"
            onClick={handleCustomToggle}
            className="text-sm text-gray-500 hover:text-black underline underline-offset-2 transition-colors cursor-pointer"
          >
            Or set a custom amount
          </button>
        ) : (
          <div className="flex items-center gap-3 max-w-xs">
            <span className="text-sm font-medium text-gray-700">Custom:</span>
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
              <Input
                type="number"
                min={MIN_BUDGET}
                value={customInput}
                onChange={handleCustomChange}
                onBlur={handleCustomBlur}
                placeholder={String(MIN_BUDGET)}
                className="pl-7"
                autoFocus
              />
            </div>
            <span className="text-xs text-gray-400">Min ${MIN_BUDGET}</span>
          </div>
        )}
      </div>
    </div>
  );
};
