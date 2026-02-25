import React from 'react';
import { IMPACT_TIERS } from '@/utils/pricingConstants';

const PricingTiers: React.FC = () => {
    return (
        <section className="bg-[var(--color4)] py-12">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="text-center mb-12">
                    <p className="text-xs font-semibold tracking-[0.2em] text-gray-400 uppercase mb-3">
                        Price Guidelines
                    </p>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black font-['Playfair_Display',_serif]">
                        How much does it cost?
                    </h2>
                    <p className="mt-4 text-base md:text-lg text-black/60 max-w-2xl mx-auto">
                        As much as you want. Select a budget tier or custom amount and we'll do the rest.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {IMPACT_TIERS.map((tier) => (
                        <div
                            key={tier.name}
                            className={`relative rounded-2xl flex flex-col overflow-hidden ${
                                tier.badge
                                    ? 'bg-white text-black shadow-xl ring-2 ring-[var(--colorgreen)]'
                                    : 'bg-white text-black shadow-md'
                            }`}
                        >
                            {tier.badge && (
                                <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10">
                                    <span className="bg-[var(--colorgreen)] text-black text-xs font-bold px-4 py-1 rounded-full tracking-widest uppercase">
                                        {tier.badge}
                                    </span>
                                </div>
                            )}

                            <div className="w-full h-48 overflow-hidden">
                                <img
                                    src={tier.image}
                                    alt={tier.name}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            </div>

                            <div className="p-8 flex flex-col flex-grow">
                                <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-2 text-gray-400">
                                    {tier.name}
                                </p>
                                <p className="text-4xl font-bold font-['Playfair_Display',_serif] text-black">
                                    ${tier.price}
                                </p>
                                <p className="mt-4 text-sm leading-relaxed text-black/60">
                                    {tier.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PricingTiers;
