import React from 'react';
import { Check } from 'lucide-react';

const points = [
  'Only sales you\'re leaving behind.',
  'Decline orders, still get paid 7.5%.',
  'Easy upsell. Locked revenue.',
  'We absorb bad reviews.',
];

export const ValuePropsA: React.FC = () => {
  return (
    <section className="bg-[var(--color4)] pt-10">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-center text-black mb-6">
          No Cost, No Admin, No Risk.
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 max-w-2xl mx-auto">
          {points.map((point, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-[var(--color2)] rounded-full">
                <Check className="h-5 w-5 text-black" />
              </div>
              <p className="text-lg md:text-xl font-semibold text-black">{point}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
