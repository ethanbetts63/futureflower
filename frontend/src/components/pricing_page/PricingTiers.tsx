import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import flowerIcon from '../../assets/flower_symbol.svg';

const tiers = [
    {
        label: 'The Thoughtful Gesture',
        range: '$50 – $75',
        description: 'Perfect for a "thinking of you" moment or a bright desk arrangement.',
        ideal: ['Thinking of you', 'Get well soon', 'Desk arrangement'],
        featured: false,
    },
    {
        label: 'The Classic',
        range: '$80 – $120',
        description: 'A traditional, medium-to-large bouquet. Ideal for birthdays, Mother\'s Day, and celebrations.',
        ideal: ['Birthdays', "Mother's Day", 'Celebrations'],
        featured: true,
    },
    {
        label: 'The Statement',
        range: '$130+',
        description: 'Premium stems, large volume, and breathtaking design. Reserved for big anniversaries and moments you want to own.',
        ideal: ['Anniversaries', 'Proposals', 'Unforgettable moments'],
        featured: false,
    },
];

const PricingTiers: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const handleNav = () => {
        if (isAuthenticated) {
            navigate('/event-gate/single-delivery');
        } else {
            navigate('/upfront-flow/create-account?next=/event-gate/single-delivery');
        }
    };

    return (
        <section className="bg-[var(--color4)] py-16 md:py-24">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="text-center mb-12">
                    <p className="text-xs font-semibold tracking-[0.2em] text-gray-400 uppercase mb-3">
                        Price Guidelines
                    </p>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black font-['Playfair_Display',_serif]">
                        How much should I spend?
                    </h2>
                    <p className="mt-4 text-base md:text-lg text-black/60 max-w-2xl mx-auto">
                        You set the exact dollar amount — no packages, no tiers. Delivery is completely free and built into your budget. Use this as a guide.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {tiers.map((tier) => (
                        <div
                            key={tier.label}
                            className={`relative rounded-2xl p-8 flex flex-col ${
                                tier.featured
                                    ? 'bg-black text-white shadow-xl ring-2 ring-[var(--colorgreen)]'
                                    : 'bg-white text-black shadow-md'
                            }`}
                        >
                            {tier.featured && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <span className="bg-[var(--colorgreen)] text-black text-xs font-bold px-4 py-1 rounded-full tracking-widest uppercase">
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            <p className={`text-xs font-semibold tracking-[0.15em] uppercase mb-2 ${tier.featured ? 'text-white/50' : 'text-gray-400'}`}>
                                {tier.label}
                            </p>
                            <p className={`text-4xl font-bold font-['Playfair_Display',_serif] ${tier.featured ? 'text-white' : 'text-black'}`}>
                                {tier.range}
                            </p>
                            <p className={`mt-4 text-sm leading-relaxed flex-grow ${tier.featured ? 'text-white/70' : 'text-black/60'}`}>
                                {tier.description}
                            </p>

                            <div className="mt-6 pt-6 border-t border-white/10">
                                <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${tier.featured ? 'text-white/40' : 'text-black/30'}`}>
                                    Ideal for
                                </p>
                                <ul className="flex flex-col gap-2">
                                    {tier.ideal.map((item) => (
                                        <li key={item} className="flex items-center gap-2">
                                            <svg
                                                className={`h-4 w-4 flex-shrink-0 ${tier.featured ? 'text-[var(--colorgreen)]' : 'text-[var(--colorgreen)]'}`}
                                                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span className={`text-sm ${tier.featured ? 'text-white/80' : 'text-black/70'}`}>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <button
                        onClick={handleNav}
                        className="inline-flex items-center gap-3 bg-[var(--colorgreen)] text-black font-semibold px-8 py-4 rounded-lg hover:brightness-110 transition-all shadow-lg"
                    >
                        <img src={flowerIcon} alt="" className="h-5 w-5" />
                        Set your budget and send
                        <svg className="h-5 w-5 text-black/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default PricingTiers;
