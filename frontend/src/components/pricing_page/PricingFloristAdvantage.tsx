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
                        <p className="text-sm font-semibold tracking-[0.15em] text-black uppercase mb-6">
                            How FutureFlower works instead
                        </p>
                        <ol className="flex flex-col gap-5">
                            <li className="flex items-start gap-4">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--colorgreen)] text-black text-sm font-bold flex items-center justify-center">1</span>
                                <div>
                                    <p className="font-semibold text-black">Choose the occasion</p>
                                    <p className="mt-0.5 text-sm text-black/60">Let the florist know the vibe — Romantic, Sympathy, Birthday, and more.</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--colorgreen)] text-black text-sm font-bold flex items-center justify-center">2</span>
                                <div>
                                    <p className="font-semibold text-black">Add your preferences</p>
                                    <p className="mt-0.5 text-sm text-black/60">Leave specific notes if you want — "She loves peonies," or "Please no lilies."</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--colorgreen)] text-black text-sm font-bold flex items-center justify-center">3</span>
                                <div>
                                    <p className="font-semibold text-black">Set your exact budget</p>
                                    <p className="mt-0.5 text-sm text-black/60">Select your pricing tier or enter a custom amount.</p>
                                </div>
                            </li>
                        </ol>
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
