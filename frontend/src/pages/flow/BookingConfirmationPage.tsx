// src/pages/flow/BookingConfirmationPage.tsx
import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2, Palette, Sprout, Ban, ArrowRight, Tag, Milestone, Repeat, DollarSign } from 'lucide-react';
import { getFlowerPlan } from '@/api';
import type { FlowerPlan } from '@/api';
import Seo from '@/components/Seo';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

// Helper component for displaying preference lists
const PreferenceList: React.FC<{ title: string; items: string[]; icon: React.ElementType; variant: 'default' | 'destructive' }> = ({ title, items, icon: Icon, variant }) => (
    <div>
        <h4 className="font-semibold mb-2 flex items-center"><Icon className="mr-2 h-4 w-4" /> {title}</h4>
        {items && items.length > 0 ? (
            <div className="flex flex-wrap gap-2">
                {items.map(item => <Badge key={item} variant={variant}>{item}</Badge>)}
            </div>
        ) : (
            <p className="text-sm text-muted-foreground">None specified.</p>
        )}
    </div>
);


const BookingConfirmationPage = () => {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  
  const [plan, setPlan] = useState<FlowerPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!planId) {
      toast.error('No Plan ID found in URL.');
      navigate('/dashboard');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const planData = await getFlowerPlan(planId);
        setPlan(planData);
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
      <div className="container mx-auto px-4 py-8 text-center">
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
            {/* Plan Details Section */}
            <Card className="bg-white shadow-md border-none text-black">
              <CardHeader><CardTitle>Plan Structure</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div className="flex flex-col items-center">
                      <Milestone className="h-8 w-8 mb-2 text-primary" />
                      <p className="font-bold text-2xl">{plan.years}</p>
                      <p className="text-muted-foreground">{plan.years > 1 ? 'Years' : 'Year'}</p>
                  </div>
                  <div className="flex flex-col items-center">
                      <Repeat className="h-8 w-8 mb-2 text-primary" />
                      <p className="font-bold text-2xl">{plan.deliveries_per_year}</p>
                      <p className="text-muted-foreground">Deliveries per Year</p>
                  </div>
                  <div className="flex flex-col items-center">
                      <DollarSign className="h-8 w-8 mb-2 text-primary" />
                      <p className="font-bold text-2xl">${Number(plan.budget).toFixed(2)}</p>
                      <p className="text-muted-foreground">Budget per Bouquet</p>
                  </div>
              </CardContent>
            </Card>

            {/* Preferences Section */}
            <Card className="bg-white shadow-md border-none text-black">
              <CardHeader><CardTitle>Your Preferences</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <PreferenceList title="Preferred Colors" items={plan.preferred_colors} icon={Palette} variant="default" />
                <PreferenceList title="Preferred Flower Types" items={plan.preferred_flower_types} icon={Sprout} variant="default" />
                <div className="border-t"></div>
                <PreferenceList title="Rejected Colors" items={plan.rejected_colors} icon={Ban} variant="destructive" />
                <PreferenceList title="Rejected Flower Types" items={plan.rejected_flower_types} icon={Ban} variant="destructive" />
              </CardContent>
            </Card>

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

            {/* Action Button */}
            <div className="text-center">
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