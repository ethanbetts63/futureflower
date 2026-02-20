import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import type { HeroV2Props } from '../../types/HeroV2Props';
import heroImage320 from '../../assets/hero2.png';
import heroImage640 from '../../assets/hero2.png';
import heroImage768 from '../../assets/hero2.png';
import heroImage1024 from '../../assets/hero2.png';
import heroImage1280 from '../../assets/hero2.png';
import heroMobileImage from '../../assets/hero2.png';
import heroMobileImage320 from '../../assets/hero2.png';
import heroMobileImage640 from '../../assets/hero2.png';
import heroMobileImage768 from '../../assets/hero2.png';
import heroMobileImage1024 from '../../assets/hero2.png';
import heroMobileImage1280 from '../../assets/hero2.png';
import flowerIcon from '../../assets/flower_symbol.svg';
import subscriptionIcon from '../../assets/subscription_symbol.svg';
import deliveryIcon from '../../assets/delivery_symbol.svg';
import Badge from '../Badge';

export const HeroV2: React.FC<HeroV2Props> = ({ title }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleNav = (path: string) => {
    if (isAuthenticated) {
      navigate(path);
    } else {
      navigate(`/upfront-flow/create-account?next=${path}`);
    }
  };

  return (
    <section className="relative h-screen w-full flex items-end md:items-center">
      <picture className="absolute inset-0 w-full h-full">
        <source
          media="(min-width: 768px)"
          srcSet={`${heroImage320} 320w, ${heroImage640} 640w, ${heroImage768} 768w, ${heroImage1024} 1024w, ${heroImage1280} 1280w`}
          sizes="100vw"
        />
        <img
          src={heroMobileImage}
          srcSet={`${heroMobileImage320} 320w, ${heroMobileImage640} 640w, ${heroMobileImage768} 768w, ${heroMobileImage1024} 1024w, ${heroMobileImage1280} 1280w`}
          sizes="100vw"
          alt="A woman holding a large bouquet of flowers."
          fetchPriority="high"
          className="w-full h-full object-cover"
        />
      </picture>
      <Badge
        title="Free Delivery"
        subtext="Included on all products"
        symbol={
          <img
            src={deliveryIcon}
            alt=""
            className="h-5 w-5 md:h-7 md:w-7 animate-bounce"
            style={{ animationDuration: '2s' }}
          />
        }
        className="absolute top-8 right-6 sm:top-12 sm:right-12"
      />



      {/* Overlay Content */}
      <div className="relative ml-0 sm:ml-12 md:ml-24 w-full sm:w-2/3 md:w-1/2 lg:w-1/3 bg-black/70 p-8 sm:p-12 rounded-none sm:rounded-lg text-white">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
          {title}
        </h1>
        <p className="mt-4 text-base sm:text-lg text-white">
          Pick a date. Pick a budget. We handle the rest.
        </p>

        {/* Two primary CTAs */}
        <div className="mt-4 flex flex-col gap-3">
          <button
            onClick={() => handleNav('/event-gate/single-delivery')}
            className="w-full flex items-center justify-between bg-[var(--colorgreen)] text-black font-semibold px-6 py-4 rounded-lg hover:brightness-110 transition-all cursor-pointer group shadow-lg"
          >
            <div className="flex items-center gap-4">
              <img src={flowerIcon} alt="" className="h-8 w-8" />
              <div className="text-left">
                <span className="block text-base">Send Flowers</span>
                <span className="block text-xs font-normal text-black/60">One-time delivery for a specific date</span>
              </div>
            </div>
            <svg className="h-5 w-5 text-black/40 group-hover:text-black transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>

          <button
            onClick={() => handleNav('/event-gate/subscription')}
            className="w-full flex items-center justify-between bg-white text-black font-semibold px-6 py-4 rounded-lg hover:bg-gray-100 transition-all cursor-pointer group shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div className="flex -space-x-4">
                <img src={subscriptionIcon} alt="" className="h-8 w-8" />
              </div>
              <div className="text-left">
                <span className="block text-base">Flower Subscriptions</span>
                <span className="block text-xs font-normal text-gray-500">Recurring flowers for every date that matters</span>
              </div>
            </div>
            <svg className="h-5 w-5 text-gray-400 group-hover:text-black transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
    </section>
  );
};
