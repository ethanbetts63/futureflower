
import Image from 'next/image';
import { Truck } from 'lucide-react';
import { IMPACT_TIERS, MIN_BUDGET } from '@/utils/pricingConstants';
import { FREE_DELIVERY_THRESHOLD } from '@/utils/systemConstants';

const PricingTiers = () => {
    return (
        <section className="bg-[#fbfaf7] py-14 text-black sm:py-16">
            <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
                <div className="mx-auto mb-12 max-w-2xl text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45">
                        Price guidelines
                    </p>
                    <h2 className="mt-3 text-3xl font-bold leading-tight font-playfair-display sm:text-4xl">
                        How much does it cost?
                    </h2>
                    <p className="mt-4 text-lg leading-relaxed text-black/65">
                        As much as you want. These tiers are just common choices — the florist designs to whatever budget you set.
                    </p>
                </div>

                <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
                    {IMPACT_TIERS.map((tier) => (
                        <div
                            key={tier.name}
                            className={`relative flex flex-col overflow-hidden rounded-xl bg-white ${
                                tier.badge
                                    ? 'shadow-md shadow-black/10 ring-2 ring-[var(--colorgreen)]'
                                    : 'shadow-sm shadow-black/5 ring-1 ring-black/5'
                            }`}
                        >
                            {tier.badge && (
                                <div className="absolute left-1/2 top-3 z-10 -translate-x-1/2">
                                    <span className="rounded-full bg-[var(--colorgreen)] px-4 py-1 text-xs font-bold uppercase tracking-widest text-black">
                                        {tier.badge}
                                    </span>
                                </div>
                            )}

                            <div className="relative h-48 w-full overflow-hidden">
                                <Image
                                    src={tier.image}
                                    alt={tier.name}
                                    fill
                                    sizes="(max-width: 767px) 100vw, 33vw"
                                    className="object-cover"
                                />
                            </div>

                            <div className="flex flex-grow flex-col p-8">
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45">
                                    {tier.name}
                                </p>
                                <p className="mt-2 text-4xl font-bold font-playfair-display">
                                    ${tier.price}
                                </p>
                                {tier.price >= FREE_DELIVERY_THRESHOLD && (
                                    <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-black/70">
                                        <Truck className="h-4 w-4 text-[var(--colorgreen)]" aria-hidden="true" />
                                        Free delivery
                                    </p>
                                )}
                                <p className="mt-4 text-sm leading-relaxed text-black/60">
                                    {tier.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mx-auto mt-6 max-w-5xl rounded-xl border-2 border-dashed border-black/15 p-6 text-center sm:p-7">
                    <p className="text-lg font-bold font-playfair-display">
                        Or name your own number.
                    </p>
                    <p className="mx-auto mt-1.5 max-w-xl text-sm leading-relaxed text-black/60">
                        Set any custom budget from ${MIN_BUDGET} when you order — free delivery kicks in over ${FREE_DELIVERY_THRESHOLD}.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default PricingTiers;
