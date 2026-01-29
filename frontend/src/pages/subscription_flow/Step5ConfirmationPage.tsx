// foreverflower/frontend/src/pages/subscription_flow/Step5ConfirmationPage.tsx
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Tag } from 'lucide-react';
import Seo from '@/components/Seo';
import BackButton from '@/components/BackButton';
import PreferencesCard from '@/components/PreferencesCard';
import PlanDisplay from '@/components/PlanDisplay';
import SubscriptionStructureCard from '@/components/SubscriptionStructureCard';
import { getSubscriptionPlan, updateSubscriptionPlan } from '@/api';
import type { SubscriptionPlan } from '@/types/SubscriptionPlan';

const Step5ConfirmationPage: React.FC = () => {
  const { planId } = useParams<{ planId: string }>();

  const isSubscriptionPlan = (plan: any): plan is SubscriptionPlan => {
    return 'frequency' in plan && 'price_per_delivery' in plan;
  };

  return (
    <>
      <Seo title="Confirm Your Subscription | ForeverFlower" />
      <div className="min-h-screen w-full py-8" style={{ backgroundColor: 'var(--color4)' }}>
        <div className="container mx-auto px-4 max-w-4xl">
          <PlanDisplay getPlan={getSubscriptionPlan} fallbackNavigationPath="/dashboard">
            {({ plan, colorMap, flowerTypeMap }) => (
              <div className="space-y-8">
                <Card className="text-center w-full bg-white shadow-md border-none text-black">
                  <CardHeader>
                    <div className="flex justify-center items-center mb-4">
                      <CheckCircle className="h-16 w-16 text-green-500" />
                    </div>
                    <CardTitle className="text-3xl">Confirm Your Subscription</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Please review your subscription details below. This is the final step before payment.
                    </CardDescription>
                  </CardHeader>
                </Card>

                {isSubscriptionPlan(plan) && (
                    <div className="space-y-6">
                        <SubscriptionStructureCard
                            plan={plan}
                            editUrl={`/subscribe-flow/subscription-plan/${planId}/structure`}
                        />

                        <PreferencesCard
                            plan={plan}
                            colorMap={colorMap}
                            flowerTypeMap={flowerTypeMap}
                            editUrl={`/subscribe-flow/subscription-plan/${planId}/preferences`}
                            getPlan={getSubscriptionPlan}
                            updatePlan={updateSubscriptionPlan}
                        />

                        <Card className="bg-white shadow-md border-none text-black">
                            <CardHeader>
                            <CardTitle className="flex items-center"><Tag className="mr-2 h-5 w-5" />Recurring Payment</CardTitle>
                            </CardHeader>
                            <CardContent>
                            <div className="flex justify-between items-center text-2xl font-bold">
                                <span>Price Per Delivery</span>
                                <span>${Number(plan.price_per_delivery).toFixed(2)}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">You will be charged this amount for each delivery based on your chosen frequency.</p>
                            </CardContent>
                        </Card>

                        <div className="flex justify-between items-center mt-8">
                            <BackButton to={`/subscribe-flow/subscription-plan/${planId}/structure`} />
                            <Button asChild size="lg">
                            <Link to={`/subscribe-flow/subscription-plan/${planId}/payment`}>
                                Proceed to Payment <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                            </Button>
                        </div>
                    </div>
                )}
              </div>
            )}
          </PlanDisplay>
        </div>
      </div>
    </>
  );
};

export default Step5ConfirmationPage;