import React from 'react';
import heroImage320 from '../../assets/hero2-320w.webp';
import heroImage640 from '../../assets/hero2-640w.webp';
import heroImage768 from '../../assets/hero2-768w.webp';
import heroImage1024 from '../../assets/hero2-1024w.webp';
import heroImage1280 from '../../assets/hero2-1280w.webp';
import heroMobileImage320 from '../../assets/hero2_mobile2-320w.webp';
import heroMobileImage412 from '../../assets/hero2_mobile2-412w.webp';
import heroMobileImage640 from '../../assets/hero2_mobile2-640w.webp';
import heroMobileImage768 from '../../assets/hero2_mobile2-768w.webp';

export const ContactHero: React.FC = () => {
  return (
    <section className="w-full md:relative md:h-screen md:flex md:items-center">

      {/* Image — in normal flow on mobile, fills section absolutely on desktop */}
      <div className="w-full md:absolute md:inset-0">
        <picture className="block w-full h-full">
          <source
            media="(max-width: 767px)"
            srcSet={`${heroMobileImage320} 320w, ${heroMobileImage412} 412w, ${heroMobileImage640} 640w, ${heroMobileImage768} 768w`}
            sizes="100vw"
          />
          <img
            src={heroImage1280}
            srcSet={`${heroImage320} 320w, ${heroImage640} 640w, ${heroImage768} 768w, ${heroImage1024} 1024w, ${heroImage1280} 1280w`}
            sizes="100vw"
            alt="A woman holding a large bouquet of flowers."
            fetchPriority="high"
            className="w-full h-80 sm:h-96 object-cover md:h-full"
          />
        </picture>
      </div>

      {/* Content — below image on mobile, overlaid on desktop */}
      <div className="relative w-full md:ml-24 md:w-1/2 lg:w-1/3 bg-[var(--color4)] md:bg-black/70 p-8 sm:p-12 md:rounded-lg">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-black md:text-white">
          Contact Us
        </h1>
        <p className="mt-4 text-base sm:text-lg text-black md:text-white">
          Have questions, suggestions, or feedback? I'd love to hear from you.
        </p>
        <a
          href="mailto:ethanbetts63@gmail.com"
          className="mt-6 inline-flex items-center gap-3 bg-[var(--colorgreen)] text-black font-semibold px-6 py-4 rounded-lg hover:brightness-110 transition-all shadow-lg"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          ethanbetts63@gmail.com
        </a>
      </div>
    </section>
  );
};
