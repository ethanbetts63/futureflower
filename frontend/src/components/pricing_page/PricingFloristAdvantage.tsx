import React from 'react';
import floristImage from '../../assets/florist_making_flowers-1280w.webp';
import floristImage320 from '../../assets/florist_making_flowers-320w.webp';
import floristImage640 from '../../assets/florist_making_flowers-640w.webp';
import floristImage768 from '../../assets/florist_making_flowers-768w.webp';
import floristImage1024 from '../../assets/florist_making_flowers-1024w.webp';

const PricingFloristAdvantage: React.FC = () => (
    <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                {/* Left — Text */}
                <div>
                    <p className="text-xs font-semibold tracking-[0.2em] text-gray-400 uppercase mb-3">
                        The Florist's Choice Advantage
                    </p>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black font-['Playfair_Display',_serif] leading-tight">
                        Why we don't have a catalog.
                    </h2>

                    <p className="mt-6 text-base md:text-lg text-black/60 leading-relaxed">
                        Most online flower deliveries force local florists to recreate rigid "recipes" from a picture. This forces them to use cheaper, hardier flowers that survive long transit, rather than the fresh, seasonal blooms they actually want to use.
                    </p>

                    <div className="mt-8 pt-8 border-t border-black/10">
                        <p className="text-sm font-semibold tracking-[0.15em] text-black uppercase mb-4">
                            The benefit
                        </p>
                        <p className="text-base md:text-lg text-black/60 leading-relaxed">
                            By giving your florist a budget and an occasion—instead of a picture to copy—we turn them back into artists. They use the absolute best, freshest flowers they have on hand that day, giving you a custom arrangement you couldn't get from a warehouse.
                        </p>
                    </div>

                    {/* Two-column pill stats */}
                    <div className="mt-8 grid grid-cols-2 gap-4">
                        <div className="bg-[var(--color4)] rounded-xl p-5">
                            <p className="text-2xl font-bold text-black">Recipe</p>
                            <p className="mt-1 text-sm text-black/50">Rigid. Predictable. Warehouse stock.</p>
                        </div>
                        <div className="bg-[var(--colorgreen)] rounded-xl p-5">
                            <p className="text-2xl font-bold text-black">Artist</p>
                            <p className="mt-1 text-sm text-black/60">Fresh. Seasonal. One of a kind.</p>
                        </div>
                    </div>
                </div>

                {/* Right — Image */}
                <div className="rounded-2xl overflow-hidden shadow-lg">
                    <img
                        src={floristImage}
                        srcSet={`${floristImage320} 320w, ${floristImage640} 640w, ${floristImage768} 768w, ${floristImage1024} 1024w`}
                        sizes="(max-width: 1023px) 100vw, 50vw"
                        alt="A florist carefully crafting a bouquet"
                        className="w-full h-[400px] md:h-[540px] object-cover"
                        loading="lazy"
                    />
                </div>

            </div>
        </div>
    </section>
);

export default PricingFloristAdvantage;
