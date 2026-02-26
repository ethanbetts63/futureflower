import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadConnectAndInitialize } from '@stripe/connect-js';
import { ConnectAccountOnboarding, ConnectComponentsProvider } from '@stripe/react-connect-js';
import { initiateStripeConnectOnboarding } from '@/api/partners';
import { Spinner } from '@/components/ui/spinner';
import Seo from '@/components/Seo';
import StepProgressBar from '@/components/form_flow/StepProgressBar';

const StripeConnectOnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initiateStripeConnectOnboarding()
      .then((data) => setClientSecret(data.client_secret))
      .catch(() => setError('Failed to start Stripe setup. Please try again from your dashboard.'));
  }, []);

  const stripeConnectInstance = useMemo(() => {
    if (!clientSecret) return null;
    return loadConnectAndInitialize({
      publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string,
      fetchClientSecret: async () => clientSecret,
    });
  }, [clientSecret]);

  if (error) {
    return (
      <div style={{ backgroundColor: 'var(--color4)' }} className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-4 max-w-md">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => navigate('/dashboard/partner')}
            className="text-sm underline text-black/60 hover:text-black"
          >
            Go to dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!stripeConnectInstance) {
    return (
      <div style={{ backgroundColor: 'var(--color4)' }} className="min-h-screen flex items-center justify-center">
        <Spinner className="h-10 w-10" />
      </div>
    );
  }

  return (
    <>
      <Seo title="Stripe Setup | FutureFlower" />
      <StepProgressBar currentStep={3} totalSteps={3} planName="Partner Registration" />
      <div style={{ backgroundColor: 'var(--color4)' }} className="min-h-screen py-0 md:py-12 px-0 md:px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="bg-white rounded-none md:rounded-[2rem] overflow-hidden shadow-none md:shadow-xl md:shadow-black/5">
            <div className="px-4 md:px-8 pt-8 pb-4">
              <h1 className="text-3xl md:text-4xl font-bold font-['Playfair_Display',_serif] text-black">
                Set Up Payouts
              </h1>
              <p className="mt-2 text-black/60 text-sm">
                Connect your bank account so we can pay you. Your information is handled securely by Stripe.
              </p>
            </div>
            <div className="px-4 md:px-8 pb-8">
              <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
                <ConnectAccountOnboarding
                  onExit={() => navigate('/partner/stripe-connect/return')}
                />
              </ConnectComponentsProvider>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StripeConnectOnboardingPage;
