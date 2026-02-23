import React from 'react';
import smallFlowers from '@/assets/small_flowers.png';
import medFlowers from '@/assets/med_flowers.png';
import largeFlowers from '@/assets/large_flowers.png';

const tiers = [
    {
        label: 'The Thoughtful Gesture',
        range: '$50 – $75',
        description: 'Perfect for a "thinking of you" moment or a bright desk arrangement.',
        image: smallFlowers,
        featured: false,
    },
    {
        label: 'The Classic',
        range: '$80 – $120',
        description: 'A traditional, medium-to-large bouquet. Ideal for birthdays, Mother\'s Day, and celebrations.',
        image: medFlowers,
        featured: true,
    },
    {
        label: 'The Statement',
        range: '$130+',
        description: 'Premium stems, large volume, and breathtaking design. Reserved for big anniversaries and moments you want to own.',
        image: largeFlowers,
        featured: false,
    },
];

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
                        As much as you want it to. Just give us a budget and we'll do the rest. 
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {tiers.map((tier) => (
                        <div
                            key={tier.label}
                            className={`relative rounded-2xl flex flex-col overflow-hidden ${
                                tier.featured
                                    ? 'bg-white text-black shadow-xl ring-2 ring-[var(--colorgreen)]'
                                    : 'bg-white text-black shadow-md'
                            }`}
                        >
                            {tier.featured && (
                                <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10">
                                    <span className="bg-[var(--colorgreen)] text-black text-xs font-bold px-4 py-1 rounded-full tracking-widest uppercase">
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            <div className="w-full h-48 overflow-hidden">
                                <img
                                    src={tier.image}
                                    alt={tier.label}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            </div>

                            <div className="p-8 flex flex-col flex-grow">
                                <p className={`text-xs font-semibold tracking-[0.15em] uppercase mb-2 text-gray-400`}>
                                    {tier.label}
                                </p>
                                <p className={`text-4xl font-bold font-['Playfair_Display',_serif] text-black`}>
                                    {tier.range}
                                </p>
                                <p className={`mt-4 text-sm leading-relaxed text-black/60`}>
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
