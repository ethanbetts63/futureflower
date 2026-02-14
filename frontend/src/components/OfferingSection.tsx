import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import placeholderImg from '../assets/florist_packing.webp';

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
    <section className="bg-[#f5f0eb] py-16 md:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Left — Image */}
          <div className="rounded-2xl overflow-hidden">
            <img
              src={placeholderImg}
              alt="A florist carefully preparing a bouquet"
              className="w-full h-[400px] md:h-[540px] object-cover"
            />
          </div>

          {/* Right — Content */}
          <div className="flex flex-col gap-10">

            {/* Subscription Card */}
            <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm">
              <p className="text-xs font-semibold tracking-[0.2em] text-black/50 uppercase">Annual Subscription</p>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold text-black font-['Playfair_Display',_serif]">
                The Person Who Never Forgets
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
                className="mt-8 w-full bg-black text-white font-semibold px-6 py-4 rounded-lg hover:bg-black/85 transition-colors cursor-pointer text-sm uppercase tracking-wider"
              >
                Subscribe & Secure
              </button>
            </div>

            {/* One-Off Card */}
            <div className="border border-black/10 rounded-2xl p-8 md:p-10 bg-white/50">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-black font-['Playfair_Display',_serif]">The One-Off Delivery</h3>
                  <p className="mt-2 text-sm text-black/50">No subscription required. Just a single, beautiful gesture for a specific date.</p>
                </div>
                <button
                  onClick={() => handleNav('/event-gate/single-delivery')}
                  className="flex-shrink-0 bg-[var(--colorgreen)] text-black font-semibold px-5 py-3 rounded-lg hover:brightness-110 transition-all cursor-pointer text-sm"
                >
                  Send Flowers
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default OfferingSection;
