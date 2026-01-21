// src/pages/flow/BookingConfirmationPage.tsx
import { useState, useEffect, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2, Palette, Sprout, Ban, ArrowRight, Tag, Milestone, Repeat, DollarSign, ArrowLeft, Pencil } from 'lucide-react';
import { getFlowerPlan, getColors, getFlowerTypes } from '@/api';
import type { FlowerPlan, Color, FlowerType } from '@/api';
import Seo from '@/components/Seo';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import EditButton from '@/components/EditButton';

// Helper component for displaying a single color swatch
const ColorSwatchDisplay: React.FC<{ hex: string; name: string }> = ({ hex, name }) => (
    <div className="flex items-center gap-2">
        <div title={name} className="h-6 w-6 rounded-full border" style={{ backgroundColor: hex }} />
        <span>{name}</span>
    </div>
);

// Helper component for displaying a list of colors
const ColorPreferenceList: React.FC<{ title: string; colorIds: string[]; colorMap: Map<number, Color>; icon: React.ElementType; }> = ({ title, colorIds, colorMap, icon: Icon }) => {
    const colors = useMemo(() => 
        colorIds.map(id => colorMap.get(Number(id))).filter((c): c is Color => !!c),
    [colorIds, colorMap]);

    return (
        <div>
            <h4 className="font-semibold mb-2 flex items-center"><Icon className="mr-2 h-4 w-4" /> {title}</h4>
            {colors.length > 0 ? (
                <div className="flex flex-wrap gap-4">
                    {colors.map(color => <ColorSwatchDisplay key={color.id} hex={color.hex_code} name={color.name} />)}
                </div>
            ) : (
                <p className="text-sm text-muted-foreground">None specified.</p>
            )}
        </div>
    );
};


// Helper component for displaying a list of flower types by name
const FlowerTypePreferenceList: React.FC<{ title: string; typeIds: string[]; typeMap: Map<number, FlowerType>; icon: React.ElementType; variant: 'default' | 'destructive' }> = ({ title, typeIds, typeMap, icon: Icon, variant }) => {
    const types = useMemo(() =>
        typeIds.map(id => typeMap.get(Number(id))).filter((ft): ft is FlowerType => !!ft),
    [typeIds, typeMap]);

    return (
        <div>
            <h4 className="font-semibold mb-2 flex items-center"><Icon className="mr-2 h-4 w-4" /> {title}</h4>
            {types.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {types.map(type => <Badge key={type.id} variant={variant}>{type.name}</Badge>)}
                </div>
            ) : (
                <p className="text-sm text-muted-foreground">None specified.</p>
            )}
        </div>
    );
};


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
              <CardHeader className="flex justify-between items-center">
                <CardTitle>Plan Structure</CardTitle>
                <EditButton to={`/book-flow/create-flower-plan?planId=${planId}`} />
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div className="flex flex-col items-center">
                      <Milestone className="h-8 w-8 mb-2 text-green-500" />
                      <p className="font-bold text-2xl">{plan.years}</p>
                      <p className="text-black">{plan.years > 1 ? 'Years' : 'Year'}</p>
                  </div>
                  <div className="flex flex-col items-center">
                      <Repeat className="h-8 w-8 mb-2 text-green-500" />
                      <p className="font-bold text-2xl">{plan.deliveries_per_year}</p>
                      <p className="text-black">Deliveries per Year</p>
                  </div>
                  <div className="flex flex-col items-center">
                      <DollarSign className="h-8 w-8 mb-2 text-green-500" />
                      <p className="font-bold text-2xl">${Number(plan.budget).toFixed(2)}</p>
                      <p className="text-black">Budget per Bouquet</p>
                  </div>
              </CardContent>
            </Card>

            {/* Preferences Section */}
            <Card className="bg-white shadow-md border-none text-black">
              <CardHeader className="flex justify-between items-center">
                <CardTitle>Your Preferences</CardTitle>
                <EditButton to={`/book-flow/flower-plan/${planId}/preferences`} />
              </CardHeader>
              <CardContent className="space-y-6">
                <ColorPreferenceList title="Preferred Colors" colorIds={plan.preferred_colors} colorMap={colorMap} icon={Palette} />
                <FlowerTypePreferenceList title="Preferred Flower Types" typeIds={plan.preferred_flower_types} typeMap={flowerTypeMap} icon={Sprout} variant="default" />
                <div className="border-t"></div>
                <ColorPreferenceList title="Rejected Colors" colorIds={plan.rejected_colors} colorMap={colorMap} icon={Ban} />
                <FlowerTypePreferenceList title="Rejected Flower Types" typeIds={plan.rejected_flower_types} typeMap={flowerTypeMap} icon={Ban} variant="destructive" />
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

            {/* Action Buttons */}
            <div className="flex justify-between items-center mt-8">
                <Button variant="ghost" onClick={() => navigate(-1)}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button asChild size="lg">
                    <Link to={`/activation-success?plan_id=${planId}`}>
                        Complete Activation <ArrowRight className="ml-2 h-5 w-5" />
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