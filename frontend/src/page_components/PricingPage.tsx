
import Link from 'next/link';
import { Truck } from 'lucide-react';
import Seo from '@/components/Seo';
import deliverToDoor from '../assets/deliver_to_door.png';
import PricingFloristAdvantage from '../components/pricing_page/PricingFloristAdvantage';
import PricingTiers from '../components/pricing_page/PricingTiers';
import PricingFaq from '../components/pricing_page/PricingFaq';
import { FREE_DELIVERY_THRESHOLD } from '@/utils/systemConstants';
import { IMPACT_TIERS } from '@/utils/pricingConstants';
import { assetSrc } from '@/lib/assets';

const SEND_HREF = '/create-account?next=%2Fevent-gate%2Fsingle-delivery';

const PricingPage = () => {
    const serviceSchema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": "Flower Delivery",
        "name": "FutureFlower Flower Delivery",
        "description": "Personalized flower delivery. Choose a budget tier, add your preferences, and a local florist designs and delivers the bouquet.",
        "provider": {
            "@type": "Organization",
            "name": "FutureFlower",
            "url": "https://www.futureflower.app"
        },
        "areaServed": [
            { "@type": "Country", "name": "Australia" }
        ],
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Flower Delivery Budget Tiers",
            "itemListElement": IMPACT_TIERS.map((tier) => ({
                "@type": "Offer",
                "name": tier.name,
                "description": tier.description,
                "price": tier.price.toString(),
                "priceCurrency": "AUD"
            }))
        }
    };

    return (
        <main className="text-black">
            <Seo
                title="Flower Delivery Pricing | FutureFlower"
                description="Simple, transparent pricing for flower delivery. Set your budget, add your preferences, and a local Australian florist handles the rest."
                canonicalPath="/pricing"
                structuredData={serviceSchema}
            />

            {/* Hero */}
            <section className="relative overflow-hidden bg-[#f8f3ef]">
                <div className="mx-auto grid min-h-[70vh] max-w-7xl grid-cols-1 items-center gap-0 px-0 pb-0 pt-8 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:gap-8 lg:px-8 lg:py-12">
                    <div className="min-w-0 px-5 pb-10 sm:px-6 lg:px-0 lg:pb-0">
                        <div className="max-w-full sm:max-w-2xl">
                            <div className="flex flex-wrap items-center gap-2">
                                <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-black/60 shadow-sm">
                                    <span className="h-2 w-2 rounded-full bg-[var(--colorgreen)]" />
                                    Simple pricing
                                </p>
                                <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-black/60 shadow-sm">
                                    <Truck className="h-3.5 w-3.5 text-[var(--colorgreen)]" aria-hidden="true" />
                                    Free delivery over ${FREE_DELIVERY_THRESHOLD}
                                </p>
                            </div>
                            <h1 className="mt-5 text-4xl font-bold leading-[1.05] font-playfair-display sm:text-6xl lg:text-7xl">
                                More flowers. Fewer fees.
                            </h1>
                            <p className="mt-5 max-w-xl text-lg leading-relaxed text-black/65">
                                The budget you set is the amount you pay — delivery included, nothing added at checkout. A local florist puts it into the bouquet.
                            </p>
                            <div className="mt-8">
                                <Link
                                    href={SEND_HREF}
                                    className="inline-flex items-center gap-2 rounded-md bg-green-600 px-6 py-3 text-center font-medium text-white shadow-sm transition-colors hover:bg-green-700"
                                >
                                    Send flowers
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="relative min-h-[420px] overflow-hidden bg-black lg:min-h-[560px] lg:rounded-xl">
                        <img
                            src={assetSrc(deliverToDoor)}
                            alt="Florist delivering a bouquet of flowers to a customer at their door"
                            fetchPriority="high"
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5 sm:p-8">
                            <div className="max-w-sm text-white">
                                <p className="text-sm font-semibold">Free delivery over ${FREE_DELIVERY_THRESHOLD}.</p>
                                <p className="mt-1 text-sm leading-relaxed text-white/70">
                                    Your budget goes into the flowers, not the fees.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <PricingTiers />
            <PricingFloristAdvantage />
            <PricingFaq />
        </main>
    );
};

export default PricingPage;
