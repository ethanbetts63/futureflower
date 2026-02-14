// frontend/src/pages/single_delivery_flow/Step5ConfirmationPage.tsx
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, ArrowRight, Tag } from 'lucide-react';
import Seo from '@/components/Seo';
import BackButton from '@/components/BackButton';
import PreferencesCard from '@/components/PreferencesCard';
import RecipientCard from '@/components/RecipientCard';
import PlanDisplay from '@/components/PlanDisplay';
import SingleDeliveryStructureCard from '@/components/form_flow/SingleDeliveryStructureCard';

import { getUpfrontPlanAsSingleDelivery } from '@/api/singleDeliveryPlans';
import type { Plan, FlowerType, UpfrontPlan } from '@/types';

import PaymentInitiatorButton from '@/components/form_flow/PaymentInitiatorButton';


const Step5ConfirmationPage = () => {
  const { planId } = useParams<{ planId: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <>
      <Seo title="Confirm Your Order | FutureFlower" />
      <div className="min-h-screen w-full py-8" style={{ backgroundColor: 'var(--color4)' }}>
        <div className="container mx-auto px-4 max-w-4xl">
          <PlanDisplay getPlan={getUpfrontPlanAsSingleDelivery} fallbackNavigationPath="/dashboard">
            {({ plan, flowerTypeMap }: { plan: Plan; flowerTypeMap: Map<number, FlowerType> }) => {
              // Since SingleDeliveryPlan is now UpfrontPlan, this check is no longer strictly needed
              // and the plan will always be of type UpfrontPlan in this context.

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
                      plan={plan as UpfrontPlan}
                      editUrl={`/single-delivery-flow/plan/${planId}/structure`}
                    />

                    <PreferencesCard
                      plan={plan}
                      flowerTypeMap={flowerTypeMap}
                      editUrl={`/single-delivery-flow/plan/${planId}/preferences`}
                    />

                    <Card className="bg-white shadow-md border-none text-black">
                      <CardHeader>
                        <CardTitle className="flex items-center"><Tag className="mr-2 h-5 w-5" />Final Price</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center text-2xl font-bold">
                          <span>Single-Delivery Payment</span>
                          <span>${Number((plan as UpfrontPlan).total_amount).toFixed(2)}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">This is the total amount you will be charged to confirm your order.</p>
                      </CardContent>
                    </Card>

                    <div className="flex justify-between items-center mt-8">
                      <BackButton to={`/single-delivery-flow/plan/${planId}/structure`} />
                      <PaymentInitiatorButton
                        itemType="UPFRONT_PLAN_NEW"
                        details={{ upfront_plan_id: planId }}
                        backPath={`/single-delivery-flow/plan/${planId}/confirmation`}
                        disabled={isSubmitting || !planId}
                        onPaymentInitiate={() => setIsSubmitting(true)}
                        onPaymentError={() => setIsSubmitting(false)}
                        size="lg"
                      >
                        Proceed to Payment <ArrowRight className="ml-2 h-5 w-5" />
                      </PaymentInitiatorButton>
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
