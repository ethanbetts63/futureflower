import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from '@/components/ui/button';

// Define the possible views
type View = 'prepaid' | 'subscription' | 'one-time';

// A reusable component to display product information
interface ProductInfoProps {
  title: string;
  tagline: string;
  salesPoints: string[];
  onGetStarted: () => void;
  buttonText?: string;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ title, tagline, salesPoints, onGetStarted, buttonText = "Get Started" }) => {
  return (
    <div className="text-center flex flex-col h-full">
      <div className="flex-grow">
        <h3 className="text-xl font-bold font-['Playfair_Display',_serif]">{title}</h3>
        <p className="text-md italic text-gray-700 my-3">“{tagline}”</p>
        <ul className="text-left my-4 space-y-2 text-sm">
          {salesPoints.map((point, index) => (
            <li key={index} className="flex items-start">
              <span className="text-primary mr-2">✔</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
      <Button onClick={onGetStarted} className="mt-4 w-full">{buttonText}</Button>
    </div>
  );
};

export const CtaCard: React.FC = () => {
  const [view, setView] = useState<View>('prepaid');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Unified navigation handler
  const handleNavigation = (path: string) => {
    if (isAuthenticated) {
      navigate(path);
    } else {
      // Redirect to account creation with the intended destination
      navigate(`/book-flow/create-account?next=${path}`);
    }
  };

  // Static data for each product offering
  const productData = {
    subscription: {
      title: 'Subscription (Pay-as-you-go)',
      tagline: 'You’re not just sending flowers — you’re showing up, again and again.',
      salesPoints: [
        'Weekly, Fortnightly, Monthly, Binannual or Yearly Delivery.',
        'Fully customizable budget. ($75 to $500 per delivery)',
        'Customizable Personal Messages',
        'Perfect for birthdays, anniversaries, Mother’s Day, or “just because”',
        'Update dates, addresses, Budgets or preferences anytime',
        'Be the person who always remembers, with no effort after setup.',
      ],
      onGetStarted: () => handleNavigation('/event-gate/subscription'),
    },
    prepaid: {
      title: 'Prepaid Plan',
      tagline: 'Make a promise once. Keep it for years.',
      salesPoints: [
        'Weekly, Fortnightly, Monthly, Binannual or Yearly Delivery.',
        'Save up to 32% when paying upfront.',
        'Customizable Personal Messages',
        'Customizable budget ($75 - $500 per bouquet)',
        'Guaranteed flowers for future birthdays, anniversaries, or milestones',
        'A huge romantic gesture',
      ],
      onGetStarted: () => handleNavigation('/book-flow/flower-plan'),
    },
    'one-time': {
      title: 'One-Time Scheduled Delivery',
      tagline: 'Send flowers exactly when they matter — even years from now.',
      salesPoints: [
        'Schedule a single delivery up to years in advance',
        'Customizable budget and bouquet preferences',
        'Write the message today — we deliver it at the right moment',
        'No subscriptions, no ongoing commitment',
        'Ideal for surprises, memorials, or future anniversaries',
        'Peace of mind knowing it’s already handled',
      ],
      onGetStarted: () => handleNavigation('/event-gate/one-time'),
    },
  };

  const currentProduct = productData[view];

  return (
    <Card className="w-full bg-white shadow-md text-gray-900 rounded-none sm:rounded-xl border-0">
      <CardHeader className="p-4 text-center">
        <h2 className="font-bold text-3xl italic text-black font-['Playfair_Display',_serif] mb-4">
          FOREVERFLOWER
        </h2>
        <div className="flex justify-center bg-muted p-1 rounded-md">
          <button onClick={() => setView('prepaid')} className={`w-1/3 px-2 py-2 text-sm font-bold rounded ${view === 'prepaid' ? 'bg-primary text-primary-foreground' : 'text-black'}`}>Prepaid</button>
          <button onClick={() => setView('subscription')} className={`w-1/3 px-2 py-2 text-sm font-bold rounded ${view === 'subscription' ? 'bg-primary text-primary-foreground' : 'text-black'}`}>Subscription</button>
          <button onClick={() => setView('one-time')} className={`w-1/3 px-2 py-2 text-sm font-bold rounded ${view === 'one-time' ? 'bg-primary text-primary-foreground' : 'text-black'}`}>One-Time</button>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-2 text-black">
        {currentProduct && (
          <ProductInfo
            title={currentProduct.title}
            tagline={currentProduct.tagline}
            salesPoints={currentProduct.salesPoints}
            onGetStarted={currentProduct.onGetStarted}
          />
        )}
      </CardContent>
    </Card>
  );
};
