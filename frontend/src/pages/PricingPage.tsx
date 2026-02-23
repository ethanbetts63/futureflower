import React from 'react';
import Seo from '@/components/Seo';
import { HeroV2 } from '../components/home_page/HeroV2';
import PricingFloristAdvantage from '../components/pricing_page/PricingFloristAdvantage';
import PricingTiers from '../components/pricing_page/PricingTiers';
import ComparisonSection from '../components/home_page/ComparisonSectionHome';
import PricingFaq from '../components/pricing_page/PricingFaq';

const PricingPage: React.FC = () => {
    return (
        <main>
            <Seo
                title="Pricing | FutureFlower"
                description="Give florists a budget and preferences. No catalogs, just the freshest, seasonal flowers."
                canonicalPath="/pricing"
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
