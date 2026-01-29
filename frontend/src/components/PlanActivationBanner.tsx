// src/components/PlanActivationBanner.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import type { PlanActivationBannerProps } from '../types/PlanActivationBannerProps';

const PlanActivationBanner: React.FC<PlanActivationBannerProps> = ({ planId }) => {
  const navigate = useNavigate();

  const handleActivate = () => {
    navigate(`/dashboard/plans/${planId}/edit-structure`);
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
          className="bg-yellow-500 hover:bg-yellow-600 text-white"
        >
          Activate Plan
        </Button>
      </div>
    </Card>
  );
};

export default PlanActivationBanner;
