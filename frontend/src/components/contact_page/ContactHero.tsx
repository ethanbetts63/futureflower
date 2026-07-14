
import Image from 'next/image';
import heroImage from '../../assets/flowers2.webp';

export const ContactHero = () => {
  return (
    <section className="w-full md:relative md:h-screen md:flex md:items-center">

      {/* Image — in normal flow on mobile, fills section absolutely on desktop */}
      <div className="relative w-full h-80 sm:h-96 md:absolute md:inset-0 md:h-full">
        <Image
          src={heroImage}
          alt="A woman holding a large bouquet of flowers."
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
      </div>

      {/* Content — below image on mobile, overlaid on desktop */}
      <div className="relative w-full md:ml-24 md:w-1/2 lg:w-1/3 bg-[var(--color4)] md:bg-black/70 p-8 sm:p-12 md:rounded-lg">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-black md:text-white">
          Contact Us
        </h1>
        <p className="mt-4 text-base sm:text-lg text-black md:text-white">
          Have questions, suggestions, or feedback? we'd love to hear from you. Contact our admin at the following email address, and we'll get back to you as soon as possible! Whether it's about our plans, delivery, or anything else, we're here to help.
        </p>
        <a
          href="mailto:ethan.betts.dev@gmail.com"
          className="mt-6 inline-flex items-center gap-3 bg-[var(--colorgreen)] text-black font-semibold px-6 py-4 rounded-lg hover:brightness-110 transition-all shadow-lg"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          ethan.betts.dev@gmail.com
        </a>
      </div>
    </section>
  );
};
