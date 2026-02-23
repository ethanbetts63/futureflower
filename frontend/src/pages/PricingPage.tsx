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
                description="Simple, transparent pricing for flower deliveries and subscriptions. Pick a budget and we handle the rest."
                canonicalPath="/pricing"
            />
            <HeroV2
                title={<>More flowers. Fewer fees.</>}
                subtext="Simple, transparent pricing with free delivery built in. You set the budget — we handle the rest."
            />
            <PricingFloristAdvantage />
            <PricingTiers />
            <ComparisonSection />
            <PricingFaq />
        </main>
    );
};

export default PricingPage;
