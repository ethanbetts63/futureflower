// src/pages/flow/BookingConfirmationPage.tsx
import { useState, useEffect, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2, ArrowRight, Tag } from 'lucide-react';
import { getFlowerPlan, getColors, getFlowerTypes } from '@/api';
import type { FlowerPlan, Color, FlowerType } from '@/api';
import Seo from '@/components/Seo';
import { toast } from 'sonner';
import BackButton from '@/components/BackButton';
import PlanStructureCard from '@/components/PlanStructureCard';
import PreferencesCard from '@/components/PreferencesCard';
import MessagesCard from '@/components/MessagesCard';

const BookingConfirmationPage = () => {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  
  const [plan, setPlan] = useState<FlowerPlan | null>(null);
  const [colors, setColors] = useState<Color[]>([]);
  const [flowerTypes, setFlowerTypes] = useState<FlowerType[]>([]);
  const [loading, setLoading] = useState(true);

  const colorMap = useMemo(() => new Map(colors.map(c => [c.id, c])), [colors]);
  const flowerTypeMap = useMemo(() => new Map(flowerTypes.map(ft => [ft.id, ft])), [flowerTypes]);

  useEffect(() => {
    if (!planId) {
      toast.error('No Plan ID found in URL.');
      navigate('/dashboard');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [planData, colorsData, flowerTypesData] = await Promise.all([
            getFlowerPlan(planId),
            getColors(),
            getFlowerTypes(),
        ]);
        setPlan(planData);
        setColors(colorsData);
        setFlowerTypes(flowerTypesData);
      } catch (err: any) {
        toast.error('Failed to load plan details.', { description: err.message });
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [planId, navigate]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Loading your plan summary...</p>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-black">
        <h1 className="text-2xl font-bold mb-2">Could Not Load Plan</h1>
        <p>There was an error loading your plan details. Please try again from your dashboard.</p>
        <Button asChild className="mt-4">
          <Link to="/dashboard">Go to Dashboard</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <>
      <Seo title="Confirm Your Plan | ForeverFlower" />
      <div className="min-h-screen w-full py-8" style={{ backgroundColor: 'var(--color4)' }}>
        <div className="container mx-auto px-4 max-w-4xl">
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
              editUrl={`/book-flow/flower-plan?planId=${planId}`}
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

            {/* Pricing Summary */}
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

            {/* Action Buttons */}
            <div className="flex justify-between items-center mt-8">
                <BackButton />
                <Button asChild size="lg">
                    <Link to={`/book-flow/flower-plan/${planId}/payment`}>
                        Proceed to Payment <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default BookingConfirmationPage;