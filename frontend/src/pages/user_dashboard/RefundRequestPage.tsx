import React from 'react';
import Seo from '@/components/Seo';
import UnifiedSummaryCard from '@/components/form_flow/UnifiedSummaryCard';
import FlowBackButton from '@/components/form_flow/FlowBackButton';

const REFUND_EMAIL = 'ethanbetts63@gmail.com';

const RefundRequestPage: React.FC = () => {
  return (
    <>
      <Seo title="Request a Refund | FutureFlower" />
      <div className="min-h-screen w-full py-0 md:py-12" style={{ backgroundColor: 'var(--color4)' }}>
        <div className="container mx-auto px-0 md:px-4 max-w-4xl">
          <UnifiedSummaryCard
            title="Request a Refund"
            description="We handle refund requests manually to make sure every case is treated fairly."
            footer={
              <div className="flex justify-start items-center w-full">
                <FlowBackButton to="/dashboard/plans" />
              </div>
            }
          >
            <div className="py-6 space-y-6">
              <p className="text-black/70 leading-relaxed">
                To request a refund, please send us an email at the address below. We'll review
                your request and get back to you within 1–2 business days.
              </p>

              <div className="bg-black/5 rounded-2xl p-6 space-y-2">
                <p className="text-xs font-bold tracking-widest uppercase text-black/40">Contact</p>
                <a
                  href={`mailto:${REFUND_EMAIL}?subject=Refund%20Request%20-%20FutureFlower`}
                  className="text-lg font-semibold text-black underline hover:text-black/70 transition-colors"
                >
                  {REFUND_EMAIL}
                </a>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-bold text-black/60 uppercase tracking-widest">
                  Please include in your email:
                </p>
                <ul className="space-y-2 text-black/70">
                  <li className="flex items-start gap-2">
                    <span className="text-black/30 mt-0.5">•</span>
                    <span>Your plan type (Upfront Plan or Subscription)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-black/30 mt-0.5">•</span>
                    <span>The date you placed the order or started the subscription</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-black/30 mt-0.5">•</span>
                    <span>The reason for your refund request</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-black/30 mt-0.5">•</span>
                    <span>Any relevant order details (recipient name, delivery date, etc.)</span>
                  </li>
                </ul>
              </div>
            </div>
          </UnifiedSummaryCard>
        </div>
      </div>
    </>
  );
};

export default RefundRequestPage;
