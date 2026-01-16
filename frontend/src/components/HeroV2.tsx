import React from 'react';
import heroImage from '../assets/hero1.png';

interface HeroV2Props {
  title: React.ReactNode;
  subtitle: React.ReactNode;
}

export const HeroV2: React.FC<HeroV2Props> = ({ title, subtitle }) => {
  return (
    <section 
      style={{ backgroundImage: `url(${heroImage})` }} 
      className="h-screen w-full bg-cover bg-right flex items-center"
    >
      <div className="ml-24 w-1/3 bg-black/70 p-12 rounded-lg text-white">
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
          {title}
        </h1>
        <p className="mt-6 text-xl leading-8">
          {subtitle}
        </p>
      </div>
    </section>
  );
};
