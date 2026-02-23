import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from '@/components/ui/button';

import type { View, DetailedProductInfoProps, ProductData } from '@/types';

const DetailedProductInfo: React.FC<DetailedProductInfoProps> = ({ subtitle, paragraph, features, onGetStarted, buttonText = "Get Started" }) => {
  return (
    <div className="text-left">
      <h3 className="text-xl font-bold font-['Playfair_Display',_serif] text-center mb-3">{subtitle}</h3>
      <p className="text-center text-gray-700 my-3 text-sm">{paragraph}</p>
      <ul className="my-4 space-y-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <span className="text-[var(--colorgreen)] mr-3 mt-1 text-lg font-bold">✔</span>
            <div>
              <p className="font-bold text-md">{feature.heading}</p>
              <p className="text-sm text-gray-600">{feature.subtext}</p>
            </div>
          </li>
        ))}
      </ul>
      <Button onClick={onGetStarted} className="mt-4 w-full bg-[var(--colorgreen)] text-black font-bold hover:brightness-105 transition-all">{buttonText}</Button>
    </div>
  );
};



export const CtaCard: React.FC = () => {
  const [view, setView] = useState<View>('subscription');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    if (isAuthenticated) {
      navigate(path);
    } else {
      navigate(`/upfront-flow/create-account?next=${path}`);
    }
  };

  const productData: Record<View, ProductData> = {
    subscription: {
      content: {
        subtitle: 'Subscriptions',
        paragraph: 'Set up flowers for the dates that matter most — from annual milestones like birthdays and anniversaries, to weekly or monthly deliveries if you want more.',
        features: [
          { heading: 'Dates, budget, done', subtext: 'Set it up once, we handle the rest.' },
          { heading: 'Milestones first, flexibility second', subtext: 'Annual moments by default — weekly or monthly if you want more.' },
          { heading: 'Thoughtful by design', subtext: 'Customize messages and bouquet preferences.' },
        ],
      },
      onGetStarted: () => handleNavigation('/event-gate/subscription'),
    },
    'single-delivery': {
      content: {
        subtitle: 'One-time Bouquet Delivery',
        paragraph: 'Flowers, scheduled today, delivered on a future date you choose. No matter how distant.',
        features: [
          { heading: 'Made for meaningful dates', subtext: 'Ideal for anniversaries, birthdays, Mother’s Day, and moments you don’t want to miss.' },
          { heading: 'No subscription required', subtext: 'One bouquet, one date, nothing ongoing.' },
          { heading: '100% refundable', subtext: 'Full refund available up to 14 days before delivery.' },
        ],
      },
      onGetStarted: () => handleNavigation('/event-gate/single-delivery'),
    },
  };

  const currentProduct = productData[view];

  return (
    <Card className="w-full bg-white shadow-md text-gray-900 rounded-none sm:rounded-xl border-0">
      <CardHeader className="px-4 pt-0 pb-0 text-center">
        <h2 className="font-bold text-4xl text-black font-['Playfair_Display',_serif] mb-2">
          Our Services
        </h2>
        <div className="flex justify-center bg-white p-1 rounded-md">
          <button onClick={() => setView('subscription')} className={`w-1/3 px-2 py-2 text-sm font-bold rounded transition-colors ${view === 'subscription' ? 'bg-[var(--colorgreen)] text-black' : 'text-black hover:bg-gray-100'}`}>Subscription</button>
          <button onClick={() => setView('single-delivery')} className={`w-1/3 px-2 py-2 text-sm font-bold rounded transition-colors ${view === 'single-delivery' ? 'bg-[var(--colorgreen)] text-black' : 'text-black hover:bg-gray-100'}`}>Single-Delivery</button>
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-2 text-black">
        <DetailedProductInfo
          subtitle={currentProduct.content.subtitle}
          paragraph={currentProduct.content.paragraph}
          features={currentProduct.content.features}
          onGetStarted={currentProduct.onGetStarted}
        />
      </CardContent>
    </Card>
  );
};