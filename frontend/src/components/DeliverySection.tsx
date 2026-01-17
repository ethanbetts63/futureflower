import React from 'react';
import deliveryImage from '../assets/delivery.webp';
import { Check } from 'lucide-react';

const features = [
  "We coordinate delivery through florists who already serve your area, prioritising local partners wherever possible.",
  "Addresses, dates, and delivery frequency can be changed at any time. Moves don’t interrupt deliveries, and plans can be adjusted or cancelled with ease.",
  "Each bouquet can include a personalised message, written once and updated whenever you like. Bouquet preferences and color choices are completely within your control."
];

export const DeliverySection: React.FC = () => {
  return (
    <section className="bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2">
        
        {/* Image Column */}
        <div className="h-full">
          <img 
            src={deliveryImage} 
            alt="Florist delivering a bouquet of flowers" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Text Column */}
        <div className="text-black flex items-center p-8 md:p-16">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Delivery, handled properly.
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
              Our role is simple: make sure flowers arrive, every time.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
