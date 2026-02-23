import React from 'react';
import { ComparisonBarChart, defaultComparisonBars, defaultComparisonLegend } from '../ComparisonBarChart';

const PricingValueBreakdown: React.FC = () => (
    <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

                {/* Left — Text */}
                <div>
                    <p className="text-xs font-semibold tracking-[0.2em] text-gray-400 uppercase mb-3">
                        The Value Breakdown
                    </p>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black font-['Playfair_Display',_serif] leading-tight">
                        More bloom for your buck.
                    </h2>
                    <p className="mt-6 text-base md:text-lg text-black/60 leading-relaxed">
                        When you spend $100 with a big network, up to 40% goes to corporate fees — plus surprise delivery charges at checkout. When you set a $100 budget with FutureFlower, we take a flat 15%. The rest goes directly into the flowers and the local florist's pocket.
                    </p>

                    <div className="mt-8">
                        <ComparisonBarChart
                            heading="Where your $100 actually goes"
                            bars={defaultComparisonBars}
                            legend={defaultComparisonLegend}
                        />
                    </div>
                </div>

                {/* Right — Stat cards */}
                <div className="flex flex-col gap-6 lg:pt-16">
                    <div className="bg-[var(--color4)] rounded-2xl p-8">
                        <p className="text-xs font-semibold tracking-[0.15em] text-gray-400 uppercase mb-1">Big Networks</p>
                        <p className="text-4xl font-bold text-black font-['Playfair_Display',_serif]">Up to 40%</p>
                        <p className="mt-2 text-sm text-black/60">taken in fees before a single stem is purchased — plus extra delivery charges added at checkout.</p>
                    </div>

                    <div className="bg-black rounded-2xl p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--colorgreen)]/20 rounded-full -translate-y-8 translate-x-8 pointer-events-none" />
                        <p className="text-xs font-semibold tracking-[0.15em] text-white/40 uppercase mb-1">FutureFlower</p>
                        <p className="text-4xl font-bold text-white font-['Playfair_Display',_serif]">Flat 15%</p>
                        <p className="mt-2 text-sm text-white/60">that's it. No hidden fees. No checkout surprises. The budget you type is the exact amount charged to your card.</p>
                    </div>

                    <div className="bg-[var(--colorgreen)] rounded-2xl p-8">
                        <p className="text-xs font-semibold tracking-[0.15em] text-black/40 uppercase mb-1">Free Delivery</p>
                        <p className="text-4xl font-bold text-black font-['Playfair_Display',_serif]">Always</p>
                        <p className="mt-2 text-sm text-black/70">Delivery is built into your budget. There is no separate line item, ever.</p>
                    </div>
                </div>

            </div>
        </div>
    </section>
);

export default PricingValueBreakdown;
