import React from 'react';
import { Check } from 'lucide-react';

const points = [
  'Tiered Rewards: Earn $5–$25 per sale based on bouquet size.',
  'The Power of Threes: We pay you for the first three orders a customer makes.',
  'Follower Perk: A custom $5 discount code for your audience.',
  'High-Value Product: Locally crafted, high quality bouquets.',
];

interface ValuePropsAffiliatesProps {
  contentRef?: React.RefObject<HTMLDivElement | null>;
}

export const ValuePropsAffiliates: React.FC<ValuePropsAffiliatesProps> = ({ contentRef }) => {
  return (
    <section ref={contentRef} className="bg-[var(--color4)] pt-10 scroll-mt-10">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-center text-black mb-6">
          A partnership that actually pays.
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 max-w-2xl mx-auto">
          {points.map((point, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-[var(--color2)] rounded-full mt-0.5">
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
