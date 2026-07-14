
import { ArrowDown } from 'lucide-react';
import Image from 'next/image';
import { BecomePartnerButton } from './BecomePartnerButton';
import type { HeroFloristPageProps } from '@/types/HeroFloristPageProps';

import deliveryImage from '../../assets/delivery.webp';

export const HeroFloristPage = ({ scrollToContent }: HeroFloristPageProps) => {
  return (
    <section className="relative overflow-hidden bg-[#f8f3ef] text-black">
      <div className="mx-auto grid min-h-[calc(100vh-72px)] max-w-7xl grid-cols-1 items-center gap-0 px-0 pb-0 pt-8 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:gap-8 lg:px-8 lg:py-12">

        {/* Text column */}
        <div className="min-w-0 px-5 pb-10 sm:px-6 lg:px-0 lg:pb-0">
          <div className="max-w-full sm:max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-black/60 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[var(--colorgreen)]" />
              For Australian florists
            </p>
            <h1 className="mt-5 text-4xl font-bold leading-[1.05] font-playfair-display sm:text-6xl lg:text-7xl">
              Orders on <em>your</em> terms.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-black/65">
              We send you fully paid local orders. Take the ones you want, design them from the stock you have, and deliver under your own brand. Free to join.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <BecomePartnerButton />
              <button
                onClick={scrollToContent}
                className="flex cursor-pointer items-center gap-2 text-black/60 transition-colors hover:text-black"
              >
                <span className="text-sm font-medium">Learn more</span>
                <ArrowDown className="h-4 w-4 animate-bounce motion-reduce:animate-none" />
              </button>
            </div>
          </div>
        </div>

        {/* Image column */}
        <div className="relative min-h-[420px] overflow-hidden bg-black lg:min-h-[720px] lg:rounded-xl">
          <Image
            src={deliveryImage}
            sizes="(max-width: 1023px) 100vw, 50vw"
            alt="Florist delivering a bouquet of flowers"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5 sm:p-8">
            <div className="max-w-sm text-white">
              <p className="text-sm font-semibold">Fully paid, before you pick up a stem.</p>
              <p className="mt-1 text-sm leading-relaxed text-white/70">
                Your flowers, your design, your name on the delivery.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
