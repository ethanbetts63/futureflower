import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, RefreshCw, CreditCard } from 'lucide-react';
import Seo from '@/components/Seo';

const ProductSelectionPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Seo title="Select a Plan | FutureFlower" description="Choose from our Single Delivery, Subscription, or Prepaid Flower Plans." />
      <div className="min-h-screen w-full py-8" style={{ backgroundColor: 'var(--color4)' }}>
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-black font-['Playfair_Display',_serif]">Choose Your Plan</h1>
            <p className="mt-2 text-black">
              Select the option that best fits your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Single Delivery Card */}
            <Card
              className="bg-white text-black border-2 border-transparent hover:border-[var(--colorgreen)] cursor-pointer transition-all shadow-md flex flex-col h-full"
              onClick={() => navigate('/event-gate/single-delivery')}
            >
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Calendar className="h-12 w-12 text-[var(--colorgreen)]" />
                </div>
                <CardTitle className="text-xl font-['Playfair_Display',_serif]">One-time Bouquet</CardTitle>
                <CardDescription className="text-gray-600">
                  Send flowers for a specific date. Perfect for an upcoming birthday or anniversary.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-black flex-1 flex flex-col">
                <ul className="space-y-2">
                  <li className="flex items-start"><span className="mr-2 text-green-600">✔</span>Ideal for anniversaries & birthdays</li>
                  <li className="flex items-start"><span className="mr-2 text-green-600">✔</span>No subscription required</li>
                  <li className="flex items-start"><span className="mr-2 text-green-600">✔</span>100% refundable up to 7 days before</li>
                </ul>
                <div className="pt-4 mt-auto">
                  <Button className="w-full bg-[var(--colorgreen)] text-black hover:opacity-90 hover:bg-[var(--colorgreen)]" size="lg">
                    Select Single Delivery
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Subscription Card */}
            <Card
              className="bg-white text-black border-2 border-transparent hover:border-[var(--colorgreen)] cursor-pointer transition-all shadow-md flex flex-col h-full"
              onClick={() => navigate('/event-gate/subscription')}
            >
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <RefreshCw className="h-12 w-12 text-[var(--colorgreen)]" />
                </div>
                <CardTitle className="text-xl font-['Playfair_Display',_serif]">Recurring Subscription</CardTitle>
                <CardDescription className="text-gray-600">
                  Fresh flowers delivered weekly or monthly. Flexible schedules, cancel anytime.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-black flex-1 flex flex-col">
                <ul className="space-y-2">
                  <li className="flex items-start"><span className="mr-2 text-green-600">✔</span>Set dates, budget, done</li>
                  <li className="flex items-start"><span className="mr-2 text-green-600">✔</span>Milestones first, flexibility second</li>
                  <li className="flex items-start"><span className="mr-2 text-green-600">✔</span>Customize messages & preferences</li>
                </ul>
                <div className="pt-4 mt-auto">
                  <Button className="w-full bg-[var(--colorgreen)] text-black hover:opacity-90 hover:bg-[var(--colorgreen)]" size="lg">
                    Select Subscription
                  </Button>
                </div>
              </CardContent>
            </Card>

             {/* Prepaid Plan Card */}
             <Card
              className="bg-white text-black border-2 border-transparent hover:border-[var(--colorgreen)] cursor-pointer transition-all shadow-md flex flex-col h-full"
              onClick={() => navigate('/event-gate')}
            >
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <CreditCard className="h-12 w-12 text-[var(--colorgreen)]" />
                </div>
                <CardTitle className="text-xl font-['Playfair_Display',_serif]">Prepaid Gift Plan</CardTitle>
                <CardDescription className="text-gray-600">
                  Pay once for a year of deliveries. The perfect gift that keeps on giving. No recurring charges.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-black flex-1 flex flex-col">
                <ul className="space-y-2">
                  <li className="flex items-start"><span className="mr-2 text-green-600">✔</span>Future-proofed & paid upfront</li>
                  <li className="flex items-start"><span className="mr-2 text-green-600">✔</span>The gift people remember</li>
                  <li className="flex items-start"><span className="mr-2 text-green-600">✔</span>No renewals, no reminders</li>
                </ul>
                <div className="pt-4 mt-auto">
                  <Button className="w-full bg-[var(--colorgreen)] text-black hover:opacity-90 hover:bg-[var(--colorgreen)]" size="lg">
                    Select Prepaid Plan
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

export default ProductSelectionPage;
