import React from 'react';
import floristImage from '../assets/florist.webp';
import floristImage320 from '../assets/florist-320w.webp';
import floristImage640 from '../assets/florist-640w.webp';
import floristImage768 from '../assets/florist-768w.webp';
import floristImage1024 from '../assets/florist-1024w.webp';
import floristImage1280 from '../assets/florist-1280w.webp';
import { Check } from 'lucide-react';

const benefits = [
  'Orders from customers who found us, not you',
  'Full budget payment for every delivery you accept',
  'Geographic exclusivity in your service area',
  'Zero marketing spend to acquire these customers',
];

export const SendBusinessYourWay: React.FC = () => {
  return (
    <section className="bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2">

        {/* Image Column */}
        <div className="h-full order-1 md:order-1">
          <img
            src={floristImage}
            srcSet={`${floristImage320} 320w, ${floristImage640} 640w, ${floristImage768} 768w, ${floristImage1024} 1024w, ${floristImage1280} 1280w`}
            sizes="(max-width: 768px) 100vw, 50vw"
            alt="A florist preparing a bouquet in their shop."
            className="w-full h-full object-cover"
          />
        </div>

        {/* Text Column */}
        <div className="text-black flex items-center p-8 md:p-16 order-2 md:order-2">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              We Send Business Your Way
            </h2>

            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              We're not just helping you capture in-store opportunities — we're actively marketing flower subscriptions and scheduled deliveries online. When customers in your area find us through Google, Instagram, or referrals, we send them directly to you.
            </p>

            <ul className="space-y-4 mb-6">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="h-6 w-6 mt-1 text-green-500 flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
};
