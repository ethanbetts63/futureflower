import React from 'react';
import kitchenImage from '../../assets/kitchen.webp';
import kitchenImage320 from '../../assets/kitchen-320w.webp';
import kitchenImage640 from '../../assets/kitchen-640w.webp';
import kitchenImage768 from '../../assets/kitchen-768w.webp';
import kitchenImage1024 from '../../assets/kitchen-1024w.webp';
import kitchenImage1280 from '../../assets/kitchen-1280w.webp';
import { Check } from 'lucide-react';

const features = [
  "Your gesture stays personal. We don’t add logos or branding to the bouquet — and we source from small businesses wherever possible.",
  "Planning ahead means choosing reliability. ", 
  "Set it up once. We handle the coordination and logistics from there."
];

export const RomanceSection: React.FC = () => {
  return (
    <section className="bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2">

        {/* Text Column */}
        <div className="text-black flex items-center p-8 md:p-16 order-2 md:order-1">
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
        <div className="h-full order-1 md:order-2">
          <img 
            src={kitchenImage} 
            srcSet={`${kitchenImage320} 320w, ${kitchenImage640} 640w, ${kitchenImage768} 768w, ${kitchenImage1024} 1024w, ${kitchenImage1280} 1280w`}
            sizes="(max-width: 768px) 100vw, 50vw"
            alt="A beautiful bouquet of flowers on a kitchen table with a couple dancing in the background." 
            className="w-full h-full object-cover"
          />
        </div>

      </div>
    </section>
  );
};
