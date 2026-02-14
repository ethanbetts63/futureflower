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
  <section className="bg-[var(--color4)] border-t border-black/5">
    <div className="grid grid-cols-1 lg:grid-cols-2">

      {/* Left Column — Text */}
      <div className="flex items-center justify-center p-8 md:p-16 lg:p-24 bg-[var(--color4)]">
        <div className="max-w-xl w-full">
          <h2 className="mt-3 text-3xl md:text-4xl lg:text-5xl font-bold text-black font-['Playfair_Display',_serif] leading-tight">
            The Secret Big Platforms Don't Tell You
          </h2>
          <p className="mt-6 text-lg text-black/60 leading-relaxed">
            Just as convenient as the big networks—only we let the florists keep 100% of their earnings.
          </p>

          <div className="mt-12 pt-8 border-t border-black/10">
            <p className="text-sm font-semibold text-black/70 italic">Then how do you make money?</p>
            <p className="mt-2 text-sm text-black/50 leading-relaxed">
              We charge a transparent 10% fee. Our competitors slip a 20–30% commission into the order.
              That's how we are cheaper than our competitors and can still give florists 100% of the flower budget.
            </p>
          </div>
        </div>
      </div>

      {/* Right Column — Table */}
      <div className="flex flex-col items-center justify-center p-4 md:p-12 lg:p-20 bg-[var(--color4)]">
        <p className="mb-6 text-xs font-semibold tracking-[0.2em] text-black/50 uppercase">
          How Big Online Platforms Compare
        </p>
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-black/5 overflow-hidden">

          {/* Column headers */}
          <div className="grid grid-cols-3 text-[10px] md:text-xs font-semibold uppercase tracking-wider border-b border-black/5">
            <div className="px-4 md:px-8 py-4 text-black/40">Feature</div>
            <div className="px-2 md:px-6 py-4 text-center text-black/40">Big Networks</div>
            <div className="px-2 md:px-6 py-4 text-center text-[var(--colorgreen)] bg-[var(--colorgreen)]/[0.06]">FutureFlower</div>
          </div>

          {/* Rows */}
          {rows.map((row, i) => (
            <div
              key={row.feature}
              className={`grid grid-cols-3 items-center text-xs md:text-sm ${
                i < rows.length - 1 ? 'border-b border-black/5' : ''
              }`}
            >
              <div className="px-4 md:px-8 py-4 md:py-5 font-medium text-black">
                {row.feature}
              </div>
              <div className="px-2 md:px-6 py-4 md:py-5 text-center text-black/50">
                {row.them}
              </div>
              <div className="px-2 md:px-6 py-4 md:py-5 text-center font-semibold text-black bg-[var(--colorgreen)]/[0.06]">
                {row.us}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  </section>
);

export default ComparisonSection;
