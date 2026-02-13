import React from 'react';
import { ArrowDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import type { HeroV2Props } from '../types/HeroV2Props';
import heroImage320 from '../assets/hero2-320w.webp';
import heroImage640 from '../assets/hero2-640w.webp';
import heroImage768 from '../assets/hero2-768w.webp';
import heroImage1024 from '../assets/hero2.png';
import heroImage1280 from '../assets/hero2.png';
import heroMobileImage from '../assets/hero2_mobile.webp';
import heroMobileImage320 from '../assets/hero2_mobile-320w.webp';
import heroMobileImage640 from '../assets/hero2_mobile-640w.webp';
import heroMobileImage768 from '../assets/hero2_mobile-768w.webp';
import heroMobileImage1024 from '../assets/hero2_mobile-1024w.webp';
import heroMobileImage1280 from '../assets/hero2_mobile-1280w.webp';

export const HeroV2: React.FC<HeroV2Props> = ({ title, onLearnMore }) => {
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

      {/* Overlay Content */}
      <div className="relative ml-0 sm:ml-12 md:ml-24 w-full sm:w-2/3 md:w-1/2 lg:w-1/3 bg-black/70 p-8 sm:p-12 rounded-none sm:rounded-lg text-white">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
          {title}
        </h1>
        <p className="mt-4 text-base sm:text-lg text-white/80">
          Pick a date. Pick a budget. We handle the rest.
        </p>

        {/* Two primary CTAs */}
        <div className="mt-8 flex flex-col gap-3">
          <button
            onClick={() => handleNav('/event-gate/single-delivery')}
            className="w-full flex items-center justify-between bg-white text-black font-semibold px-6 py-4 rounded-lg hover:bg-white/90 transition-colors cursor-pointer group"
          >
            <div className="text-left">
              <span className="block text-base">Send Flowers</span>
              <span className="block text-xs font-normal text-gray-500">One-time delivery for a specific date</span>
            </div>
            <svg className="h-5 w-5 text-gray-400 group-hover:text-black transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>

          <button
            onClick={() => handleNav('/event-gate/subscription')}
            className="w-full flex items-center justify-between bg-white/10 text-white font-semibold px-6 py-4 rounded-lg border border-white/20 hover:bg-white/20 transition-colors cursor-pointer group"
          >
            <div className="text-left">
              <span className="block text-base">Never Forget Again</span>
              <span className="block text-xs font-normal text-white/60">Recurring flowers for every date that matters</span>
            </div>
            <svg className="h-5 w-5 text-white/40 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        {/* Learn more */}
        {onLearnMore && (
          <button
            onClick={onLearnMore}
            className="mt-6 flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors cursor-pointer mx-auto"
          >
            <span className="text-xs font-medium">Learn more</span>
            <ArrowDown className="h-3 w-3 animate-bounce" />
          </button>
        )}
      </div>
    </section>
  );
};
