import React from 'react';

const rows = [
  { feature: 'Commission',       them: '20–30% per order',              us: '0%' },
  { feature: 'Monthly Fees',     them: 'Often $100–$200+ monthly',      us: '$0' },
  { feature: 'Order Rejection',  them: '$10–$25 penalty for rejecting', us: '$0' },
  { feature: 'Delivery Fee',     them: 'Often retain delivery margin',  us: 'Fully Paid' },
  { feature: 'Product Rules',    them: 'Exact vase + stem counts',      us: 'Florist designs freely' },
  { feature: 'Branding',         them: 'Network branding required',     us: 'Florist branding encouraged' },
];

const ComparisonSection: React.FC = () => (
  <section className="bg-[var(--background-white)] pb-8">
    <div className="container mx-auto px-4 lg:px-8">
      <div className="bg-[#f5f0eb] border border-black/10 rounded-2xl p-6 md:p-10 lg:p-12">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs font-semibold tracking-[0.2em] text-black/50 uppercase">
            How Big Online Platforms Compare
          </p>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-black font-['Playfair_Display',_serif]">
            The Secret Big Platforms Don't Tell You
          </h2>
          <p className="mt-4 text-base text-black/60 leading-relaxed">
            Just as convenient as the big networks—only we let the florists keep 100% of their earnings.
          </p>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

          {/* Column headers */}
          <div className="grid grid-cols-[1fr_1fr_1fr] md:grid-cols-[2fr_1fr_1fr] text-sm font-semibold uppercase tracking-wider border-b border-black/5">
            <div className="px-4 md:px-8 py-4 text-black/40">Feature</div>
            <div className="px-4 md:px-6 py-4 text-center text-black/40">Big Networks</div>
            <div className="px-4 md:px-6 py-4 text-center text-[var(--colorgreen)] bg-[var(--colorgreen)]/[0.06]">FutureFlower</div>
          </div>

          {/* Rows */}
          {rows.map((row, i) => (
            <div
              key={row.feature}
              className={`grid grid-cols-[1fr_1fr_1fr] md:grid-cols-[2fr_1fr_1fr] items-center text-sm ${
                i < rows.length - 1 ? 'border-b border-black/5' : ''
              }`}
            >
              <div className="px-4 md:px-8 py-4 md:py-5 font-medium text-black">
                {row.feature}
              </div>
              <div className="px-4 md:px-6 py-4 md:py-5 text-center text-black/50">
                {row.them}
              </div>
              <div className="px-4 md:px-6 py-4 md:py-5 text-center font-semibold text-black bg-[var(--colorgreen)]/[0.06]">
                {row.us}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div className="mt-8 text-center max-w-xl mx-auto">
          <p className="text-sm font-semibold text-black/70 italic">Then how do you make money?</p>
          <p className="mt-2 text-sm text-black/50 leading-relaxed">
            We charge a transparent 10% fee. Our competitors slip a 20–30% commission into the order.
            That's how we are cheaper than our competitors and can still give florists 100% of the flower budget.
          </p>
        </div>

      </div>
    </div>
  </section>
);

export default ComparisonSection;
