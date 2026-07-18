// src/components/PlanActivationBanner.tsx
"use client";
import { Button } from '@/shared_components/ui/button';
import { Card, CardDescription, CardTitle } from '@/shared_components/ui/card';
import { useRouter } from 'next/navigation';
import type { PlanActivationBannerProps } from '@/types/PlanActivationBannerProps';

const PlanActivationBanner = ({ planId }: PlanActivationBannerProps) => {
  const router = useRouter();

  const handleActivate = () => {
    router.push(`/dashboard/orders/${planId}/overview`);
  };

  return (
    <Card className="w-full bg-yellow-100 border-yellow-400 shadow-md text-black">
      <div className="p-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <CardTitle className="text-xl">Plan Inactive</CardTitle>
          <CardDescription className="text-black mt-1">
            This plan is not active due to lack of payment. Please complete the payment to activate it.
          </CardDescription>
        </div>
        <Button
          onClick={handleActivate}
          className="rounded-lg px-6 py-3 text-sm font-semibold bg-black text-white hover:bg-black/85 transition-colors shadow-sm border-none"
        >
          Activate Plan
        </Button>
      </div>
    </Card>
  );
};

export default PlanActivationBanner;
