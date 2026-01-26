// src/pages/user_dashboard/PlanOverviewPage.tsx
import { useState, useEffect, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { getFlowerPlan, getColors, getFlowerTypes } from '@/api';
import type { FlowerPlan, Color, FlowerType } from '@/api';
import Seo from '@/components/Seo';
import { toast } from 'sonner';
import BackButton from '@/components/BackButton';
import PlanStructureCard from '@/components/PlanStructureCard';
import PreferencesCard from '@/components/PreferencesCard';
import MessagesCard from '@/components/MessagesCard';
import RecipientCard from '@/components/RecipientCard';
import PaymentHistoryCard from '@/components/PaymentHistoryCard';

const PlanOverviewPage = () => {
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
      navigate('/dashboard/flower-plans');
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
          <Link to="/dashboard/flower-plans">Go to My Plans</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <>
      <Seo title="Plan Overview | ForeverFlower" />
      <div className="min-h-screen w-full py-8" style={{ backgroundColor: 'var(--color4)' }}>
        <div className="container mx-auto px-4 max-w-4xl">
        <div className="space-y-8">
          <Card className="w-full bg-white shadow-md border-none text-black">
            <CardHeader>
              <CardTitle className="text-3xl">Plan Overview</CardTitle>
              <CardDescription className="text-muted-foreground">
                Review and manage the details of your flower plan.
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="space-y-6">
            <PaymentHistoryCard plan={plan} />

            <RecipientCard
              plan={plan}
              editUrl={`/dashboard/plans/${planId}/edit-recipient?source=management`}
            />

            <PlanStructureCard
              plan={plan}
              editUrl={`/dashboard/plans/${planId}/edit-structure?source=management`}
            />

            <PreferencesCard
              plan={plan}
              colorMap={colorMap}
              flowerTypeMap={flowerTypeMap}
              editUrl={`/book-flow/flower-plan/${planId}/preferences?source=management`}
            />

            <MessagesCard
              plan={plan}
              editUrl={`/book-flow/flower-plan/${planId}/add-message?source=management`}
            />

            
            {/* Action Buttons */}
            <div className="flex justify-between items-center mt-8">
                <BackButton to="/dashboard/flower-plans" />
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default PlanOverviewPage;
