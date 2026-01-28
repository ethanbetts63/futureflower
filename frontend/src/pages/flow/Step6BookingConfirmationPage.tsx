// foreverflower/frontend/src/pages/flow/Step6BookingConfirmationPage.tsx
import { Link, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Tag } from 'lucide-react';
import Seo from '@/components/Seo';
import BackButton from '@/components/BackButton';
import PlanStructureCard from '@/components/PlanStructureCard';
import DeliveryDatesCard from '@/components/DeliveryDatesCard';
import PreferencesCard from '@/components/PreferencesCard';
import MessagesCard from '@/components/MessagesCard';
import PlanDisplay from '@/components/PlanDisplay';

const Step6BookingConfirmationPage = () => {
  const { planId } = useParams<{ planId: string }>();

  return (
    <>
      <Seo title="Confirm Your Plan | ForeverFlower" />
      <div className="min-h-screen w-full py-8" style={{ backgroundColor: 'var(--color4)' }}>
        <div className="container mx-auto px-4 max-w-4xl">
          <PlanDisplay fallbackNavigationPath="/dashboard">
            {({ plan, colorMap, flowerTypeMap }) => (
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
                    editUrl={`/book-flow/flower-plan/${planId}/structure`}
                  />

                  <DeliveryDatesCard
                    plan={plan}
                    editUrl={`/book-flow/flower-plan/${planId}/structure`}
                  />

                  <PreferencesCard
                    plan={plan}
                    colorMap={colorMap}
                    flowerTypeMap={flowerTypeMap}
                    editUrl={`/book-flow/flower-plan/${planId}/preferences`}
                  />

                  <MessagesCard
                    plan={plan}
                    editUrl={`/book-flow/flower-plan/${planId}/add-message`}
                  />

                  <Card className="bg-white shadow-md border-none text-black">
                    <CardHeader>
                      <CardTitle className="flex items-center"><Tag className="mr-2 h-5 w-5" />Final Price</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center text-2xl font-bold">
                        <span>One-Time Upfront Payment</span>
                        <span>${Number(plan.total_amount).toFixed(2)}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">This is the total amount you will be charged today to activate your plan.</p>
                    </CardContent>
                  </Card>

                  <div className="flex justify-between items-center mt-8">
                    <BackButton to={`/book-flow/flower-plan/${planId}/add-message`} />
                    <Button asChild size="lg">
                      <Link to={`/book-flow/flower-plan/${planId}/payment`}>
                        Proceed to Payment <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
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
