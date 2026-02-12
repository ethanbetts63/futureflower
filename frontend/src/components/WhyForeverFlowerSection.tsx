import React, { type RefObject } from 'react';
import { ChevronRight } from 'lucide-react';

interface WhyFutureFlowerSectionProps {
  contentRef: RefObject<HTMLDivElement | null>;
}

const conversationStarters = [
  '"Would you like us to arrange something similar delivered for Mother\'s Day?"',
  '"Would you like us to arrange something similar delivered this time next year?"',
  '"Would you like us to set up a delivery subscription? We can have something like this delivered once a month."',
];

export const WhyFutureFlowerSection: React.FC<WhyFutureFlowerSectionProps> = ({ contentRef }) => {
  return (
    <section ref={contentRef} className="bg-[var(--color4)] py-10 md:py-14">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Right now, when a customer walks into your shop, there's only so much you can upsell: a bigger bouquet, nicer wrapping, maybe an extra gift. And then it's over.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            FutureFlower lets you extend your service beyond today's purchase. We give you the infrastructure to offer <strong>scheduled future deliveries</strong>, <strong>ongoing flower subscriptions</strong>, and <strong>multi-year prepaid flower plans</strong> — all without adding admin, complexity, or operational burden.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            And we are <strong>completely free to use</strong>. Just set up a QR code in-store and/or a link on your website.
          </p>

          {/* Conversation Starters */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <p className="text-gray-800 font-semibold mb-2 text-lg">
              This changes the conversation in your store.
            </p>
            <p className="text-gray-600 mb-6">
              Instead of wrapping it up and saying goodbye — you can say:
            </p>
            <div className="flex flex-col gap-3">
              {conversationStarters.map((line, i) => (
                <div key={i} className="flex items-start gap-3">
                  <ChevronRight className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700 italic">{line}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
