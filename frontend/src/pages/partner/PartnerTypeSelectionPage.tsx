import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift, Truck } from 'lucide-react';
import Seo from '@/components/Seo';

const PartnerTypeSelectionPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Seo title="Become a Partner | FutureFlower" />
      <div className="min-h-screen w-full py-8" style={{ backgroundColor: 'var(--color4)' }}>
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-black">Become a Partner</h1>
            <p className="text-muted-foreground mt-2">
              Choose the partnership type that best suits you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card
              className="bg-white text-black border-2 border-transparent hover:border-primary cursor-pointer transition-all shadow-md"
              onClick={() => navigate('/partner/register/referral')}
            >
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Gift className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="text-xl">Referral Partner</CardTitle>
                <CardDescription>
                  Share your love of flowers and earn commissions.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <ul className="space-y-2">
                  <li>Get a unique discount code to share with your audience</li>
                  <li>Earn a commission on every order made with your code</li>
                  <li>Track your earnings and referrals from your dashboard</li>
                  <li>Perfect for bloggers, influencers, and flower enthusiasts</li>
                </ul>
                <div className="pt-4">
                  <Button className="w-full" size="lg">
                    Get Started
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card
              className="bg-white text-black border-2 border-transparent hover:border-primary cursor-pointer transition-all shadow-md"
              onClick={() => navigate('/partner/register/delivery')}
            >
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Truck className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="text-xl">Delivery Partner</CardTitle>
                <CardDescription>
                  Fulfil flower deliveries in your area.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <ul className="space-y-2">
                  <li>Receive delivery requests for orders in your service area</li>
                  <li>Earn the full delivery budget for each fulfilled order</li>
                  <li>Set your own service areas and manage your availability</li>
                  <li>Perfect for florists and local delivery services</li>
                </ul>
                <div className="pt-4">
                  <Button className="w-full" size="lg">
                    Get Started
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default PartnerTypeSelectionPage;
