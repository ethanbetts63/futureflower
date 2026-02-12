import React from 'react';
import { Check } from 'lucide-react';

import kitchenImage from '../assets/kitchen.webp';
import kitchenImage320 from '../assets/kitchen-320w.webp';
import kitchenImage640 from '../assets/kitchen-640w.webp';
import kitchenImage768 from '../assets/kitchen-768w.webp';
import kitchenImage1024 from '../assets/kitchen-1024w.webp';
import kitchenImage1280 from '../assets/kitchen-1280w.webp';

const features = [
  "All you need is a small poster in-store or a link on your website.",
  "You get a 5% referral commission on all purchases.",
  "We handle all the logistics, customer service, and delivery.",
  "Unlock an easy and helpful upsell opportunity."
];

export const NonDeliveryPartnersSection: React.FC = () => {
  return (
    <section className="bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2">

        {/* Image Column */}
        <div className="h-full order-1 md:order-2">
          <img 
            src={kitchenImage} 
            srcSet={`${kitchenImage320} 320w, ${kitchenImage640} 640w, ${kitchenImage768} 768w, ${kitchenImage1024} 1024w, ${kitchenImage1280} 1280w`}
            sizes="(max-width: 768px) 100vw, 50vw"
            alt="A beautiful bouquet of flowers on a kitchen table." 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Text Column */}
        <div className="text-black flex items-center p-8 md:p-16 order-2 md:order-1">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              For non-delivery partners.
            </h2>
            
            <p className="text-lg mb-6">
              Not every florist wants to deliver — it's expensive, complicated, and time consuming. But that doesn't mean it hurts any less when you have to say no to a customer. FutureFlower gives you the ability to say: <strong>"No, but…"</strong>. A small difference that goes a long way.
            </p>

            <ul className="space-y-4 mb-6">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="h-6 w-6 mt-1 text-green-500 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

          </div>
        </div>

      </div>
    </section>
  );
};
