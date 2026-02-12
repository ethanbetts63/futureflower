import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { CreditCard } from 'lucide-react';
import { initiateStripeConnectOnboarding } from '@/api/partners';
import { toast } from 'sonner';

interface StripeConnectBannerProps {
  onboardingComplete: boolean;
}

const StripeConnectBanner: React.FC<StripeConnectBannerProps> = ({ onboardingComplete }) => {
  const [isLoading, setIsLoading] = useState(false);

  if (onboardingComplete) return null;

  const handleSetup = async () => {
    setIsLoading(true);
    try {
      const { url } = await initiateStripeConnectOnboarding();
      window.location.href = url;
    } catch (err: any) {
      toast.error('Failed to start onboarding', {
        description: err.message || 'Please try again.',
      });
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-amber-200 bg-amber-50">
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <CreditCard className="h-5 w-5 text-amber-600" />
          <div>
            <p className="font-medium text-amber-900">Set up payouts</p>
            <p className="text-sm text-amber-700">Connect your Stripe account to receive automatic payouts.</p>
          </div>
        </div>
        <Button onClick={handleSetup} disabled={isLoading} size="sm">
          {isLoading ? <Spinner className="h-4 w-4" /> : 'Set Up'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default StripeConnectBanner;
