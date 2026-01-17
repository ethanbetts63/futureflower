import React from 'react';
import heroImage from '../assets/hero1.webp';
import heroMobileImage from '../assets/hero_mobile.webp';

interface HeroV2Props {
  title: React.ReactNode;
  subtitle: React.ReactNode;
}

export const HeroV2: React.FC<HeroV2Props> = ({ title, subtitle }) => {
  return (
    <section className="relative h-screen w-full flex items-end md:items-center">
      <picture className="absolute inset-0 w-full h-full">
        <source media="(min-width: 768px)" srcSet={heroImage} />
        <img 
          src={heroMobileImage} 
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
        <p className="mt-6 text-lg sm:text-xl leading-8">
          {subtitle}
        </p>
      </div>
    </section>
  );
};
