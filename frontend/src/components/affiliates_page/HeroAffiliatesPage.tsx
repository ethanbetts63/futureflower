import React from 'react';
import { ArrowDown } from 'lucide-react';
import { BecomePartnerButton } from '../florists_page/BecomePartnerButton'; // Reusing the button component

import heroAffiliateImage from '../../assets/florist_packing.webp'; // Placeholder image
import heroAffiliateImage320 from '../../assets/florist_packing-320w.webp'; // Placeholder image
import heroAffiliateImage640 from '../../assets/florist_packing-640w.webp'; // Placeholder image
import heroAffiliateImage768 from '../../assets/florist_packing-768w.webp'; // Placeholder image
import heroAffiliateImage1024 from '../../assets/florist_packing-1024w.webp'; // Placeholder image
import heroAffiliateImage1280 from '../../assets/florist_packing-1280w.webp'; // Placeholder image


interface HeroAffiliatesPageProps {
  scrollToContent: () => void; // Assuming similar functionality as FloristsPage
}

export const HeroAffiliatesPage: React.FC<HeroAffiliatesPageProps> = ({ scrollToContent }) => {
  return (
    <section className="relative h-screen w-full flex items-end md:items-center">
      <picture className="absolute inset-0 w-full h-full">
        <source
          media="(min-width: 768px)"
          srcSet={`${heroAffiliateImage320} 320w, ${heroAffiliateImage640} 640w, ${heroAffiliateImage768} 768w, ${heroAffiliateImage1024} 1024w, ${heroAffiliateImage1280} 1280w`}
          sizes="100vw"
        />
        <img
          src={heroAffiliateImage}
          srcSet={`${heroAffiliateImage320} 320w, ${heroAffiliateImage640} 640w, ${heroAffiliateImage768} 768w, ${heroAffiliateImage1024} 1024w, ${heroAffiliateImage1280} 1280w`}
          sizes="100vw"
          alt="Person arranging flowers, representing affiliate influence" // SEO Alt Text
          fetchPriority="high"
          className="w-full h-full object-cover"
        />
      </picture>

      <div className="relative ml-0 sm:ml-12 md:ml-24 w-full sm:w-2/3 md:w-1/2 lg:w-1/3 bg-black/70 p-8 sm:p-12 rounded-none sm:rounded-lg text-white">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
          Turn your influence into flowers.
        </h1>
        <p className="mt-6 text-lg sm:text-xl leading-8">
          Give your audience $5 off their first order and earn up to $75 per referral. No limits. No confusing tracking. Just thoughtful gifting that keeps paying.
        </p>
        <div className="mt-8 flex items-center gap-8">
          <button
            onClick={scrollToContent}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <span className="text-sm font-medium">Read more</span>
            <ArrowDown className="h-4 w-4 animate-bounce" />
          </button>
          <BecomePartnerButton buttonText="Get Started" /> {/* Reusing and customizing text */}
        </div>
      </div>
    </section>
  );
};