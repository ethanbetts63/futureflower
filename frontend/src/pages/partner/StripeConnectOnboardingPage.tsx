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
      <div style={{ backgroundColor: 'var(--color4)' }} className="min-h-screen flex items-center justify-center">
        <Spinner className="h-10 w-10" />
      </div>
    </>
  );
};

export default StripeConnectOnboardingPage;
