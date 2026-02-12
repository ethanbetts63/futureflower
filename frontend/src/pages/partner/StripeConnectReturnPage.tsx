import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Seo from '@/components/Seo';
import { getStripeConnectStatus } from '@/api/partners';

const StripeConnectReturnPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const status = await getStripeConnectStatus();
        setIsComplete(status.onboarding_complete);
      } catch {
        // ignore
      } finally {
        setIsLoading(false);
      }
    };
    checkStatus();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

  return (
    <>
      <Seo title="Stripe Connect | FutureFlower" />
      <div className="min-h-screen w-full py-8" style={{ backgroundColor: 'var(--color4)' }}>
        <div className="container mx-auto px-4 max-w-lg">
          <Card className="bg-white shadow-md border-none text-black text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                {isComplete ? (
                  <CheckCircle className="h-16 w-16 text-green-500" />
                ) : (
                  <XCircle className="h-16 w-16 text-yellow-500" />
                )}
              </div>
              <CardTitle className="text-2xl">
                {isComplete ? 'Onboarding Complete!' : 'Onboarding Incomplete'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                {isComplete
                  ? 'Your Stripe account is set up. You can now receive payouts.'
                  : 'Your Stripe onboarding is not yet complete. Please try again from your dashboard.'}
              </p>
              <Button onClick={() => navigate('/dashboard/partner')}>
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default StripeConnectReturnPage;
