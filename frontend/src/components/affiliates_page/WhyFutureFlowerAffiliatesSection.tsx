import { ChevronRight } from 'lucide-react';
import { BecomePartnerButton } from '../florists_page/BecomePartnerButton';

const customerBenefits = [
  'A florist designs from their budget and preferences — not a warehouse catalog.',
  'Every bouquet is made and delivered by a real local florist.',
  'No supermarket-style bundles or generic network branding.',
  'Money spent stays with a local business.',
];

export const WhyFutureFlowerAffiliatesSection = () => {
  return (
    <section className="bg-[var(--color4)] py-10 md:py-14">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-6">
            Why FutureFlower for your audience?
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            The pitch fits in one sentence: tell us the occasion, budget, and preferences, and a local florist designs something custom. No scrolling through lookalike catalog bouquets.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            That makes it an easy share:
          </p>

          <div className="bg-white rounded-xl shadow-md p-8 mb-6">
            <div className="flex flex-col gap-3">
              {customerBenefits.map((benefit, i) => (
                <div key={i} className="flex items-start gap-3">
                  <ChevronRight className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">{benefit}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            You're not promoting another impulse purchase. You're sharing a better way to buy something people are already buying.
          </p>

          <div className="flex justify-center">
            <BecomePartnerButton />
          </div>
        </div>
      </div>
    </section>
  );
};
