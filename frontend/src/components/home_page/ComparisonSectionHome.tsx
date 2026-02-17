import React from 'react';
import { ComparisonBarChart, defaultComparisonBars, defaultComparisonLegend } from '../ComparisonBarChart';
import { ComparisonTable } from '../ComparisonTable';
import type { ComparisonRow } from '../ComparisonTable';

const rows: ComparisonRow[] = [
  { feature: 'Commission',       them: '20–40% per order',              us: '15%' },
  { feature: 'Monthly Fees',     them: 'Often $100–$200+ monthly',      us: '$0' },
  { feature: 'Order Rejection',  them: '$10–$25 penalty for rejecting', us: '$0' },
  { feature: 'Delivery Fee',     them: 'Often retain delivery margin',  us: 'Fully Paid' },
  { feature: 'Product Rules',    them: 'Exact vase + stem counts',      us: 'Florist designs freely' },
  { feature: 'Branding',         them: 'Network branding required',     us: 'Florist branding encouraged' },
];

const ComparisonSection: React.FC = () => (
  <section className="bg-[var(--color4)] border-t border-black/5">
    <div className="grid grid-cols-1 lg:grid-cols-2">

      {/* Left Column — Text */}
      <div className="flex items-center justify-center p-8 bg-[var(--color4)]">
        <div className="max-w-xl w-full">
          <h2 className="mt-3 text-3xl md:text-4xl lg:text-5xl font-bold text-black font-['Playfair_Display',_serif] leading-tight">
            The Secret Big Platforms Don't Tell You
          </h2>
          <p className="mt-2 text-lg text-black/60 leading-relaxed">
            Same price, more flowers. By cutting the fees big networks charge, we ensure more of your money ends up in the bouquet.
          </p>

          <ComparisonBarChart
            heading="Get More Bloom for Your Buck"
            bars={defaultComparisonBars}
            legend={defaultComparisonLegend}
          />

          <div className="mt-6 pt-2 border-t border-black/10">
            <p className="text-sm font-semibold text-black/80 italic">Then how do you make money?</p>
            <p className="mt-2 text-sm text-black/70 leading-relaxed">
              Where our competitors slip in a 20–40% commission, monthly fees, and delivery cuts, we charge a simple 15%. You get more, the florist gets more, and we get customers that keep coming back.
            </p>
          </div>
        </div>
      </div>

      {/* Right Column — Table */}
      <ComparisonTable
        title="How Big Online Platforms Compare"
        rows={rows}
      />

    </div>
  </section>
);

export default ComparisonSection;
