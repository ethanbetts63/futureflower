
import { Check } from 'lucide-react';
import type { ValuePropsAffiliatesProps } from '@/types/ValuePropsAffiliatesProps';

const points = [
  'Flat $10 for every new customer you send.',
  'A custom $5 discount code for your audience.',
  'No tiers, no caps, no tracking spreadsheets.',
  'Custom bouquets from local florists — an easy sell.',
];

export const ValuePropsAffiliates = ({ contentRef }: ValuePropsAffiliatesProps) => {
  return (
    <section ref={contentRef} className="scroll-mt-10 bg-[#fbfaf7] py-14 text-black sm:py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45">
            The whole deal
          </p>
          <h2 className="mt-3 text-3xl font-bold leading-tight font-playfair-display sm:text-4xl">
            A partnership that actually pays.
          </h2>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-black/65">
            One code, one flat rate. You share it wherever your audience already is — we handle everything after the click.
          </p>
        </div>

        <div className="self-center rounded-xl bg-white shadow-sm shadow-black/5">
          <ul className="divide-y divide-black/5">
            {points.map((point) => (
              <li key={point} className="flex items-start gap-3 px-5 py-4">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-[var(--colorgreen)]" />
                <p className="font-medium leading-relaxed text-black/70">{point}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
