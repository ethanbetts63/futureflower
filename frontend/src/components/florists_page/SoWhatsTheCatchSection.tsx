import React from 'react';
import { ChevronRight } from 'lucide-react';

export const SoWhatsTheCatchSection: React.FC = () => {
  return (
    <section className="bg-[var(--color4)] py-10 md:py-14">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-6 text-center">
            So what's the catch?
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            The most honest answer is that <strong>we handle the customer</strong>. The customers learn to use our service, pay with our system, and give us their details.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            These are our counter arguments:
          </p>
          <div className="flex flex-col gap-3">
            {[
              'This is mostly or entirely business you wouldn\'t have grabbed or been able to serve without us. You\'re not losing customers — you\'re gaining new business.',
              'We encourage you to use your logos on the bouquet. We differentiate ourselves by standing by local florists. If the flowers are so good the customer wants to skip the middle man and go in-store next time? So be it.',
              'In addition to carrying the complexity, headache, and capital risk of delivery commitments — we also carry the risk of bad reviews.',
              'If you decide to stop using our service, you can. We\'ll help you transition customers back in-house by providing you with the details of all customers you signed up. Perfect for a bulk email.',
              'Your not indebted to the customer and theres no risk of forgetting the order. The reason most florists don\'t offer scheduled deliveries is because of the risk and admin. We take care of all of that, so you can just focus on what you do best: making beautiful bouquets.',
            ].map((point, i) => (
              <div key={i} className="flex items-start gap-3 bg-white rounded-lg p-4 shadow-sm">
                <ChevronRight className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
