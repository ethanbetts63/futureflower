import React from 'react';
import kitchenImage from '../assets/kitchen.png';
import { Check } from 'lucide-react';

const features = [
  "Our service is discreet. You won't find our branding on the bouquets, preserving the personal touch of your gesture.",
  "Include a unique, personal message with each delivery, or write one timeless note. It's your story to tell.",
  "Pay upfront and save — Organizing years worth of flowers at once means a discount, just like any bulk purchase.",
    "Planning ahead is an act of care, not a substitute for romance. We handle the logistics so you can focus on the love."
];

export const RomanceSection: React.FC = () => {
  return (
    <section className="bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2">

        {/* Text Column */}
        <div className="text-black flex items-center p-8 md:p-16">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              The art of thoughtful giving.
            </h2>
            
            <ul className="space-y-4 mb-6">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="h-6 w-6 mt-1 text-green-500 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <p className="text-lg italic">
              Because there's nothing less romantic than forgetting.
            </p>
          </div>
        </div>

        {/* Image Column */}
        <div className="h-full">
          <img 
            src={kitchenImage} 
            alt="A beautiful bouquet of flowers on a kitchen table with a couple dancing in the background." 
            className="w-full h-full object-cover"
          />
        </div>

      </div>
    </section>
  );
};
