import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initiateStripeConnectOnboarding } from '@/api/partners';
import { Spinner } from '@/components/ui/spinner';
import Seo from '@/components/Seo';

const StripeConnectOnboardingPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    initiateStripeConnectOnboarding()
      .then((data) => {
        window.location.href = data.url;
      })
      .catch(() => navigate('/dashboard/partner', { state: { stripeError: true } }));
  }, []);

  return (
    <>
      <Seo title="Stripe Setup | FutureFlower" />
      <div style={{ backgroundColor: 'var(--color4)' }} className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white rounded-[2rem] shadow-md px-10 py-12 flex flex-col items-center gap-5 max-w-sm w-full text-center">
          <h1 className="text-2xl font-bold font-['Playfair_Display',_serif] text-black">
            Connecting you to Stripe
          </h1>
          <Spinner className="h-8 w-8" />
          <p className="text-sm text-black/50">
            You'll be redirected to Stripe to securely set up your payout account. This only takes a moment.
          </p>
        </div>
      </div>
    </>
  );
};

export default StripeConnectOnboardingPage;
