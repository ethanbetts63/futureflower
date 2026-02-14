// futureflower/frontend/src/pages/flow/Step6BookingConfirmationPage.tsx
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, ArrowRight, Tag } from 'lucide-react';
import Seo from '@/components/Seo';
import BackButton from '@/components/BackButton';
import PlanStructureCard from '@/components/PlanStructureCard';
import DeliveryDatesCard from '@/components/DeliveryDatesCard';
import PreferencesCard from '@/components/PreferencesCard';
import MessagesCard from '@/components/form_flow/MessagesCard';
import PlanDisplay from '@/components/PlanDisplay';
import PaymentInitiatorButton from '@/components/form_flow/PaymentInitiatorButton';
import DiscountCodeInput from '@/components/form_flow/DiscountCodeInput';

import { getUpfrontPlan } from '@/api';
import type { UpfrontPlan } from '../../types/UpfrontPlan';
import type { FlowerType } from '../../types/FlowerType';


const Step6BookingConfirmationPage = () => {
  const { planId } = useParams<{ planId: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [discountCode, setDiscountCode] = useState<string | null>(null);

  return (
    <>
      <Seo title="Confirm Your Plan | FutureFlower" />
      <div className="min-h-screen w-full py-8" style={{ backgroundColor: 'var(--color4)' }}>
        <div className="container mx-auto px-4 max-w-4xl">
          <PlanDisplay getPlan={getUpfrontPlan} fallbackNavigationPath="/dashboard">
            {({ plan, flowerTypeMap }: { plan: UpfrontPlan; flowerTypeMap: Map<number, FlowerType> }) => (
              <div className="space-y-8">
                <Card className="text-center w-full bg-white shadow-md border-none text-black">
                  <CardHeader>
                    <div className="flex justify-center items-center mb-4">
                      <CheckCircle className="h-16 w-16 text-green-500" />
                    </div>
                    <CardTitle className="text-3xl">Confirm Your Flower Plan</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Please review the details of your plan below. This is the final step before payment.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <div className="space-y-6">
                  <PlanStructureCard
                    plan={plan}
                    editUrl={`/upfront-flow/upfront-plan/${planId}/structure`}
                  />

                  <DeliveryDatesCard
                    plan={plan}
                    editUrl={`/upfront-flow/upfront-plan/${planId}/structure`}
                  />

                  <PreferencesCard
                    plan={plan}
                    flowerTypeMap={flowerTypeMap}
                    editUrl={`/upfront-flow/upfront-plan/${planId}/preferences`}
                  />

                  <MessagesCard
                    plan={plan}
                    editUrl={`/upfront-flow/upfront-plan/${planId}/add-message`}
                  />

                  <Card className="bg-white shadow-md border-none text-black">
                    <CardHeader>
                      <CardTitle className="flex items-center"><Tag className="mr-2 h-5 w-5" />Final Price</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center text-2xl font-bold">
                        <span>Upfront Payment</span>
                        <span>${Number(plan.total_amount).toFixed(2)}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">This is the total amount you will be charged today to activate your plan.</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white shadow-md border-none text-black">
                    <CardHeader>
                      <CardTitle className="flex items-center"><Tag className="mr-2 h-5 w-5" />Discount Code</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <DiscountCodeInput onCodeValidated={(code) => setDiscountCode(code)} />
                    </CardContent>
                  </Card>

                  <div className="flex justify-between items-center mt-8">
                    <BackButton to={`/upfront-flow/upfront-plan/${planId}/structure`} />
                    <PaymentInitiatorButton
                      itemType="UPFRONT_PLAN_NEW"
                      details={{ upfront_plan_id: planId }}
                      discountCode={discountCode}
                      backPath={`/upfront-flow/upfront-plan/${planId}/confirmation`}
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
            )}
          </PlanDisplay>
        </div>
      </div>
    </>
  );
};

export default Step6BookingConfirmationPage;
