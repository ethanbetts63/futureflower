import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import placeholderImg from '../../assets/florist_packing.webp';
import flowerIcon from '../../assets/flower_symbol.svg';
import subscriptionIconWhite from '../../assets/subscription_symbol_white.svg';
import FreeDeliveryBadge from './FreeDeliveryBadge';

const OfferingSection: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleNav = (path: string) => {
    if (isAuthenticated) {
      navigate(path);
    } else {
      navigate(`/upfront-flow/create-account?next=${path}`);
    }
  };

  return (
    <section className="bg-[var(--background-white)] pb-8 md:pt-8">
      <div className="container mx-auto px-0 md:px-4 lg:px-8">
        <div className="bg-[#f5f0eb] md:border md:border-black/10 md:rounded-2xl p-6 md:p-10 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">

            {/* Left — Image */}
            <div className="relative rounded-xl overflow-hidden">
              <FreeDeliveryBadge className="absolute top-4 left-4 scale-85 origin-top-left" />
              <img
                src={placeholderImg}
                alt="A florist carefully preparing a bouquet"
                className="w-full h-[400px] md:h-[540px] object-cover"
              />
            </div>

            {/* Right — Content */}
            <div className="flex flex-col gap-8">

              {/* Subscription Card */}
              <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm">
                <p className="text-xs font-semibold tracking-[0.2em] text-black/50 uppercase">Annual Subscription</p>
                <h2 className="mt-3 text-3xl md:text-4xl font-bold text-black font-['Playfair_Display',_serif]">
                  THE PERSON WHO NEVERS FORGETS
                </h2>
                <p className="mt-4 text-base text-black/60 leading-relaxed">
                  Don't leave your most important gestures to a last-minute reminder.
                </p>

                <div className="mt-6 flex flex-col gap-4">
                  <div className="flex items-start gap-3">
                    <svg className="h-5 w-5 text-[var(--colorgreen)] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <p className="text-sm font-semibold text-black">Dates, budget, done</p>
                      <p className="text-sm text-black/50">Set it up once, we handle the rest.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <svg className="h-5 w-5 text-[var(--colorgreen)] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <p className="text-sm font-semibold text-black">Milestones first, flexibility second</p>
                      <p className="text-sm text-black/50">Annual moments by default — weekly or monthly if you want more.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <svg className="h-5 w-5 text-[var(--colorgreen)] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <p className="text-sm font-semibold text-black">Thoughtful by design</p>
                      <p className="text-sm text-black/50">Customize messages and bouquet preferences.</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleNav('/event-gate/subscription')}
                  className="mt-8 w-full flex items-center justify-between bg-black text-white font-semibold px-6 py-4 rounded-lg hover:bg-black/85 transition-colors cursor-pointer text-sm uppercase tracking-wider group"
                >
                  <div className="flex items-center gap-2">
                    <img src={subscriptionIconWhite} alt="" className="h-5 w-5" />
                    <span>Subscribe & Secure</span>
                  </div>
                  <svg className="h-4 w-4 text-white/40 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>

              {/* One-Off Card */}
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-black font-['Playfair_Display',_serif]">The One-Off Delivery</h3>
                    <p className="mt-1 text-sm text-black/50">No subscription required. Just a single, beautiful gesture for a specific date.</p>
                  </div>
                  <button
                    onClick={() => handleNav('/event-gate/single-delivery')}
                    className="flex-shrink-0 flex items-center gap-2 bg-[var(--colorgreen)] text-black font-semibold px-5 py-3 rounded-lg hover:brightness-110 transition-all cursor-pointer text-sm group"
                  >
                    <img src={flowerIcon} alt="" className="h-5 w-5" />
                    <span>Send Flowers</span>
                    <svg className="h-4 w-4 text-black/40 group-hover:text-black transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OfferingSection;
