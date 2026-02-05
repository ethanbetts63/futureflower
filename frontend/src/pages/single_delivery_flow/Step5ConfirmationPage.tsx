// frontend/src/pages/single_delivery_flow/Step5ConfirmationPage.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, ArrowRight, Tag } from 'lucide-react';
import Seo from '@/components/Seo';
import BackButton from '@/components/BackButton';
import PreferencesCard from '@/components/PreferencesCard';
import RecipientCard from '@/components/RecipientCard';
import PlanDisplay from '@/components/PlanDisplay';
import SingleDeliveryStructureCard from '@/components/SingleDeliveryStructureCard';
import { Button } from '@/components/ui/button';

import { getSingleDeliveryPlan, updateSingleDeliveryPlan } from '@/api';
import type { Plan, Color, FlowerType } from '@/types';
import { isSingleDeliveryPlan } from '@/types/typeGuards';


const Step5ConfirmationPage = () => {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();

  // Placeholder for payment button action
  const handleProceed = () => {
    // In a real scenario, this would navigate to the payment page.
    // For now, it can navigate to the dashboard or a placeholder page.
    navigate('/dashboard'); 
  };

  return (
    <>
      <Seo title="Confirm Your Order | ForeverFlower" />
      <div className="min-h-screen w-full py-8" style={{ backgroundColor: 'var(--color4)' }}>
        <div className="container mx-auto px-4 max-w-4xl">
          <PlanDisplay getPlan={getSingleDeliveryPlan} fallbackNavigationPath="/dashboard">
            {({ plan, colorMap, flowerTypeMap }: { plan: Plan; colorMap: Map<number, Color>; flowerTypeMap: Map<number, FlowerType> }) => {
              if (!isSingleDeliveryPlan(plan)) {
                return null;
              }

              return (
                <div className="space-y-8">
                  <Card className="text-center w-full bg-white shadow-md border-none text-black">
                    <CardHeader>
                      <div className="flex justify-center items-center mb-4">
                        <CheckCircle className="h-16 w-16 text-green-500" />
                      </div>
                      <CardTitle className="text-3xl">Confirm Your Flower Delivery</CardTitle>
                      <CardDescription className="text-muted-foreground">
                        Please review the details of your order below.
                      </CardDescription>
                    </CardHeader>
                  </Card>

                  <div className="space-y-6">
                    <RecipientCard
                      plan={plan}
                      editUrl={`/single-delivery-flow/plan/${planId}/recipient`}
                    />

                    <SingleDeliveryStructureCard
                      plan={plan}
                      editUrl={`/single-delivery-flow/plan/${planId}/structure`}
                    />

                    <PreferencesCard
                      plan={plan}
                      colorMap={colorMap}
                      flowerTypeMap={flowerTypeMap}
                      editUrl={`/single-delivery-flow/plan/${planId}/preferences`}
                      getPlan={getSingleDeliveryPlan}
                      updatePlan={updateSingleDeliveryPlan}
                    />

                    <Card className="bg-white shadow-md border-none text-black">
                      <CardHeader>
                        <CardTitle className="flex items-center"><Tag className="mr-2 h-5 w-5" />Final Price</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center text-2xl font-bold">
                          <span>One-Time Payment</span>
                          <span>${Number(plan.total_amount).toFixed(2)}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">This is the total amount you will be charged to confirm your order.</p>
                      </CardContent>
                    </Card>

                    <div className="flex justify-between items-center mt-8">
                      <BackButton to={`/single-delivery-flow/plan/${planId}/structure`} />
                      {/* PaymentInitiatorButton is omitted as per instruction */}
                      <Button onClick={handleProceed} size="lg">
                          Confirm Order <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            }}
          </PlanDisplay>
        </div>
      </div>
    </>
  );
};

export default Step5ConfirmationPage;
