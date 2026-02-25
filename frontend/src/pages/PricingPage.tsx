import React from 'react';
import Seo from '@/components/Seo';
import { HeroV2 } from '../components/home_page/HeroV2';
import PricingFloristAdvantage from '../components/pricing_page/PricingFloristAdvantage';
import PricingTiers from '../components/pricing_page/PricingTiers';
import ComparisonSection from '../components/home_page/ComparisonSectionHome';
import PricingFaq from '../components/pricing_page/PricingFaq';
import { IMPACT_TIERS } from '@/utils/pricingConstants';

const PricingPage: React.FC = () => {
    const serviceSchema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": "Flower Delivery and Subscription",
        "name": "FutureFlower Flower Delivery",
        "description": "Personalized flower delivery and subscription service. Choose a budget tier, set your dates, and local florists handle the rest.",
        "provider": {
            "@type": "Organization",
            "name": "FutureFlower",
            "url": "https://www.futureflower.app"
        },
        "areaServed": [
            { "@type": "Country", "name": "Australia" },
            { "@type": "Country", "name": "United Kingdom" },
            { "@type": "Country", "name": "United States" },
            { "@type": "Country", "name": "New Zealand" },
            { "@type": "Continent", "name": "Europe" }
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
        <main>
            <Seo
                title="Flower Subscription Pricing Plans | FutureFlower"
                description="Simple, transparent pricing for flower delivery and subscriptions. Set your budget, choose your dates, and local florists handle the rest."
                canonicalPath="/pricing"
                structuredData={serviceSchema}
            />
            <HeroV2
                title={<>More flowers. Fewer fees.</>}
                subtext="Give florists a budget and preferences. No catalogs, just the freshest, seasonal flowers."
            />
            <PricingFloristAdvantage />
            <PricingTiers />
            <ComparisonSection />
            <PricingFaq />
        </main>
    );
};

export default PricingPage;
