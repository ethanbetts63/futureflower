
import Image from 'next/image';
import floristImage from '../../assets/florist.webp';
import { Check } from 'lucide-react';
import { BecomePartnerButton } from './BecomePartnerButton';

const benefits = [
  'Orders from customers who found us, not you',
  'Geographic Delivery Preference in your service area',
  'Zero marketing spend to acquire these customers',
];

export const SendBusinessYourWay = () => {
  return (
    <section className="bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2">

        {/* Image Column */}
        <div className="relative min-h-[320px] h-full order-1 md:order-1">
          <Image
            src={floristImage}
            sizes="(max-width: 768px) 100vw, 50vw"
            alt="A florist preparing a bouquet in their shop."
            fill
            className="object-cover"
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
            <div className="text-center">
              <BecomePartnerButton />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
