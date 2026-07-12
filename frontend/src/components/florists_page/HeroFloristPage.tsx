
import { ArrowDown } from 'lucide-react';
import { BecomePartnerButton } from './BecomePartnerButton';
import type { HeroFloristPageProps } from '@/types/HeroFloristPageProps';

import deliveryImage from '../../assets/delivery.webp';
import deliveryImage320 from '../../assets/delivery-320w.webp';
import deliveryImage640 from '../../assets/delivery-640w.webp';
import deliveryImage768 from '../../assets/delivery-768w.webp';
import deliveryImage1024 from '../../assets/delivery-1024w.webp';
import deliveryImage1280 from '../../assets/delivery-1280w.webp';
import { assetSrc } from '@/lib/assets';

export const HeroFloristPage = ({ scrollToContent }: HeroFloristPageProps) => {
  return (
    <section className="relative h-screen w-full flex items-end md:items-center">
      <picture className="absolute inset-0 w-full h-full">
        <source
          media="(min-width: 768px)"
          srcSet={`${assetSrc(deliveryImage320)} 320w, ${assetSrc(deliveryImage640)} 640w, ${assetSrc(deliveryImage768)} 768w, ${assetSrc(deliveryImage1024)} 1024w, ${assetSrc(deliveryImage1280)} 1280w`}
          sizes="100vw"
        />
        <img
          src={assetSrc(deliveryImage)}
          srcSet={`${assetSrc(deliveryImage320)} 320w, ${assetSrc(deliveryImage640)} 640w, ${assetSrc(deliveryImage768)} 768w, ${assetSrc(deliveryImage1024)} 1024w, ${assetSrc(deliveryImage1280)} 1280w`}
          sizes="100vw"
          alt="Florist delivering a bouquet of flowers"
          fetchPriority="high"
          className="w-full h-full object-cover"
        />
      </picture>

      <div className="relative ml-0 sm:ml-12 md:ml-24 w-full sm:w-2/3 md:w-1/2 lg:w-1/3 bg-black/70 p-8 sm:p-12 rounded-none sm:rounded-lg text-white">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
          Orders on <span className="italic">your</span> terms.
        </h1>
        <p className="mt-6 text-lg sm:text-xl leading-8">
          We send you fully paid local orders. Take the ones you want, design them from the stock you have, and deliver under your own brand. Free to join.
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
