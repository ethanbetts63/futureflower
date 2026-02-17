import React from 'react';
import creditCardIcon from '../../assets/credit_card_symbol.svg';
import deliveryIcon from '../../assets/delivery_symbol.svg';
import flowerIcon from '../../assets/flower_symbol.svg';

const rows = [
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

          {/* Stacked Bar Chart Section */}
          <div className="mt-4 mb-8">
            <h3 className="text-xl font-semibold text-black italic mb-6 font-['Playfair_Display',_serif]">
              Get More Bloom for Your Buck
            </h3>
            
            <div className="flex flex-col gap-6">
              {/* Competitors Bar */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-black/50 uppercase tracking-wider">Competitors</span>
                <div className="flex h-12 w-full rounded-full overflow-hidden shadow-sm">
                  <div className="w-[30%] bg-red-400 flex items-center justify-center relative group" title="Commission/Fees">
                    <img src={creditCardIcon} alt="Fees" className="h-6 w-6 opacity-80 invert brightness-0" />
                  </div>
                  <div className="w-[15%] bg-gray-400 flex items-center justify-center relative group" title="Delivery Cut">
                    <img src={deliveryIcon} alt="Delivery" className="h-5 w-5 opacity-80 invert brightness-0" />
                  </div>
                  <div className="w-[55%] bg-[var(--colorgreen)] flex items-center justify-center relative group" title="Flowers">
                    <img src={flowerIcon} alt="Flowers" className="h-6 w-6 opacity-80 invert brightness-0" />
                  </div>
                </div>
              </div>

              {/* FutureFlower Bar */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-black/50 uppercase tracking-wider">FutureFlower</span>
                <div className="flex h-12 w-full rounded-full overflow-hidden shadow-sm">
                  <div className="w-[15%] bg-red-400 flex items-center justify-center relative group" title="Commission/Fees">
                     <img src={creditCardIcon} alt="Fees" className="h-5 w-5 opacity-80 invert brightness-0" />
                  </div>
                  <div className="w-[90%] bg-[var(--colorgreen)] flex items-center justify-center relative group" title="Flowers">
                    <img src={flowerIcon} alt="Flowers" className="h-6 w-6 opacity-80 invert brightness-0" />
                  </div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-xs font-medium text-black/60">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <span>Commission/Fees</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <span>Delivery Cut</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[var(--colorgreen)] rounded-full"></div>
                <span>Goes to Florist</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-2 border-t border-black/10">
            <p className="text-sm font-semibold text-black/80 italic">Then how do you make money?</p>
            <p className="mt-2 text-sm text-black/70 leading-relaxed">
              Where our competitors slip in a 20–40% commission, monthly fees, and delivery cuts, we charge a simple 15%. You get more, the florist gets more, and we get customers that keep coming back.
            </p>
          </div>
        </div>
      </div>

      {/* Right Column — Table */}
      <div className="flex flex-col items-center justify-center p-4 md:p-12 lg:px-20 bg-[var(--color4)]">
        <p className="mb-6 text-s font-bold tracking-[0.2em] text-black uppercase">
          How Big Online Platforms Compare
        </p>
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-md border border-black/5 overflow-hidden">

          {/* Column headers */}
          <div className="grid grid-cols-3 text-[10px] md:text-xs font-semibold uppercase tracking-wider border-b border-black/5">
            <div className="px-4 md:px-8 py-4 text-black/40">Feature</div>
            <div className="px-2 md:px-6 py-4 text-center text-black/40">Big Networks</div>
            <div className="px-2 md:px-6 py-4 text-center text-black font-bold bg-[var(--colorgreen)]/[0.06]">FutureFlower</div>
          </div>

          {/* Rows */}
          {rows.map((row, i) => (
            <div
              key={row.feature}
              className={`grid grid-cols-3 text-xs md:text-sm ${
                i < rows.length - 1 ? 'border-b border-black/5' : ''
              }`}
            >
              <div className="flex items-center px-4 md:px-8 py-4 md:py-5 font-medium text-black">
                {row.feature}
              </div>
              <div className="flex items-center justify-center px-2 md:px-6 py-4 md:py-5 text-center text-black/50">
                {row.them}
              </div>
              <div className="flex items-center justify-center px-2 md:px-6 py-4 md:py-5 text-center font-semibold text-black bg-[var(--colorgreen)]/[0.06]">
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
