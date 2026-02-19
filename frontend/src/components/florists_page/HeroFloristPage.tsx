import React from 'react';
import { ArrowDown } from 'lucide-react';
import { BecomePartnerButton } from './BecomePartnerButton';
import moneyBagIcon from '../../assets/money_bag.svg';
import Badge from '../Badge';
import type { HeroFloristPageProps } from '@/types/HeroFloristPageProps';

import deliveryImage from '../../assets/delivery.webp';
import deliveryImage320 from '../../assets/delivery-320w.webp';
import deliveryImage640 from '../../assets/delivery-640w.webp';
import deliveryImage768 from '../../assets/delivery-768w.webp';
import deliveryImage1024 from '../../assets/delivery_med.png';
import deliveryImage1280 from '../../assets/delivery_high.png';

export const HeroFloristPage: React.FC<HeroFloristPageProps> = ({ scrollToContent }) => {
  return (
    <section className="relative h-screen w-full flex items-end md:items-center">
      <picture className="absolute inset-0 w-full h-full">
        <source
          media="(min-width: 768px)"
          srcSet={`${deliveryImage320} 320w, ${deliveryImage640} 640w, ${deliveryImage768} 768w, ${deliveryImage1024} 1024w, ${deliveryImage1280} 1280w`}
          sizes="100vw"
        />
        <img
          src={deliveryImage}
          srcSet={`${deliveryImage320} 320w, ${deliveryImage640} 640w, ${deliveryImage768} 768w, ${deliveryImage1024} 1024w, ${deliveryImage1280} 1280w`}
          sizes="100vw"
          alt="Florist delivering a bouquet of flowers"
          fetchPriority="high"
          className="w-full h-full object-cover"
        />
      </picture>
      <Badge
        title="Bi-Weekly Payouts"
        subtext="Fast cash flow you control"
        symbol={
          <img
            src={moneyBagIcon}
            alt=""
            className="h-5 w-5 md:h-7 md:w-7 animate-bounce"
            style={{ animationDuration: '2s' }}
          />
        }
        className="absolute top-8 right-6 sm:top-12 sm:right-12"
      />



      <div className="relative ml-0 sm:ml-12 md:ml-24 w-full sm:w-2/3 md:w-1/2 lg:w-1/3 bg-black/70 p-8 sm:p-12 rounded-none sm:rounded-lg text-white">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
          Turn one sale into <span className="italic">many</span>.
        </h1>
        <p className="mt-6 text-lg sm:text-xl leading-8">
          Extend your service beyond today's purchase. Offer scheduled deliveries, subscriptions, and prepaid plans — completely free, with zero admin.
        </p>
        <div className="mt-8 flex items-center gap-8">
          <button
            onClick={scrollToContent}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <span className="text-sm font-medium">Learn more</span>
            <ArrowDown className="h-4 w-4 animate-bounce" />
          </button>
          <BecomePartnerButton />
        </div>
      </div>
    </section>
  );
};
