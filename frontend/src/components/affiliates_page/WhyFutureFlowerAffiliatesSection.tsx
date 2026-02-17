import React from 'react';
import { ChevronRight } from 'lucide-react';

const customerBenefits = [
  'More of their money goes into actual flowers.',
  'No supermarket-style bundles.',
  'No generic network branding.',
  'Pure floristry from local florists.',
];

export const WhyFutureFlowerAffiliatesSection: React.FC = () => {
  return (
    <section className="bg-[var(--color4)] py-10 md:py-14">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-6">
            Why FutureFlower for your audience?
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Most flower platforms take 20–45% from florists — plus monthly fees, delivery cuts, and penalties — leaving much less money in the bouquet.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            FutureFlower does the opposite. We charge a flat <strong>15% with no hidden fees</strong> — no monthly fees, no delivery cuts.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            When florists win, customers win:
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

          <p className="text-lg text-gray-700 leading-relaxed">
            You're not promoting another impulse purchase. You're sharing a better way to buy something that people are already buying.
          </p>
        </div>
      </div>
    </section>
  );
};
