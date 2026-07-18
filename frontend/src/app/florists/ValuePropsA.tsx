
import { Check } from 'lucide-react';
import type { ValuePropsAProps } from '@/types/ValuePropsAProps';

const points = [
  'Fully paid orders, sent straight to your phone.',
  'Accept or decline — no penalties, no explanations.',
  'Design freely from the stock you have on hand.',
  'Your branding on every delivery.',
];

export const ValuePropsA = ({ contentRef }: ValuePropsAProps) => {
  return (
    <section ref={contentRef} className="scroll-mt-10 bg-[#fbfaf7] py-14 text-black sm:py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45">
            The whole deal
          </p>
          <h2 className="mt-3 text-3xl font-bold leading-tight font-playfair-display sm:text-4xl">
            No cost, no admin, no risk.
          </h2>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-black/65">
            Signing up costs nothing and commits you to nothing. Orders come to you — what you do with them is up to you.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {points.map((point) => (
            <div key={point} className="flex items-start gap-3 rounded-lg bg-white p-4 shadow-sm shadow-black/5">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-[var(--colorgreen)]" />
              <p className="text-sm font-medium leading-relaxed text-black/70">{point}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
