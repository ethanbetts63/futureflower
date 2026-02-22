import React from 'react';
import deliveryImage from '../../assets/delivery.webp';
import deliveryImage320 from '../../assets/delivery-320w.webp';
import deliveryImage640 from '../../assets/delivery-640w.webp';
import deliveryImage768 from '../../assets/delivery-768w.webp';
import deliveryImage1024 from '../../assets/delivery-1024w.webp';
import deliveryImage1280 from '../../assets/delivery-1280w.webp';
import { Check } from 'lucide-react';

const features = [
  "Coordinated delivery through florists who already serve your area, prioritising local partners wherever possible.",
  "Addresses, dates, and delivery frequency can be changed at any time. Plans can be adjusted or cancelled with ease.",
  "Each bouquet can include a personalised message, written once and updated whenever you like. Bouquet preferences are completely within your control."
];

export const DeliverySection: React.FC = () => {
  return (
    <section className="bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2">
        
        {/* Image Column */}
        <div className="h-full">
          <img
            src={deliveryImage}
            srcSet={`${deliveryImage320} 320w, ${deliveryImage640} 640w, ${deliveryImage768} 768w, ${deliveryImage1024} 1024w, ${deliveryImage1280} 1280w`}
            sizes="(max-width: 768px) 100vw, 50vw"
            alt="Florist delivering a bouquet of flowers"
            className="w-full h-full object-cover"
            loading="lazy"
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

            <p className="text-lg">
              <span className="font-bold">Our role is simple:</span> <span className="italic">make sure quality flowers arrive, every time.</span>
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
