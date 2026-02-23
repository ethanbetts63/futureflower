import React from 'react';
import Seo from '@/components/Seo';
import { HeroV2 } from '../components/home_page/HeroV2';

const PricingPage: React.FC = () => {
    return (
        <main>
            <Seo
                title="Pricing | FutureFlower"
                description="Simple, transparent pricing for flower deliveries and subscriptions. Pick a budget and we handle the rest."
                canonicalPath="/pricing"
            />
            <HeroV2
                title={<>Simple, honest <span className="italic">pricing.</span></>}
            />
        </main>
    );
};

export default PricingPage;
