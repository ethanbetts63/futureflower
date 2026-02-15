import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { showErrorToast } from '@/utils/utils';
import { Button } from '@/components/ui/button';
import { Eye, Plus } from 'lucide-react';
import { getUpfrontPlans } from '@/api/upfrontPlans';
import { getSubscriptionPlans } from '@/api/subscriptionPlans';
import { getSingleDeliveryTypeUpfrontPlans } from '@/api/singleDeliveryPlans';
import { type UpfrontPlan } from '../types/UpfrontPlan';
import { type SubscriptionPlan } from '../types/SubscriptionPlan';
import { Badge } from '@/components/ui/badge';

type UnifiedPlan = (UpfrontPlan | SubscriptionPlan) & { 
    displayType: 'Upfront' | 'Subscription' | 'Single Delivery';
};

const UnifiedPlanTable: React.FC<{ showTitle?: boolean }> = ({ showTitle = true }) => {
  const [plans, setPlans] = useState<UnifiedPlan[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllPlans = async () => {
      try {
        setIsLoading(true);
        const [upfront, subscriptions, single] = await Promise.all([
          getUpfrontPlans(true), // Exclude single delivery
          getSubscriptionPlans(),
          getSingleDeliveryTypeUpfrontPlans(),
        ]);

        const unifiedUpfront = upfront.map(p => ({ ...p, displayType: 'Upfront' as const }));
        const unifiedSubs = subscriptions.map(p => ({ ...p, displayType: 'Subscription' as const }));
        const unifiedSingle = single.map(p => ({ ...p, displayType: 'Single Delivery' as const }));

        const allPlans = [...unifiedUpfront, ...unifiedSubs, ...unifiedSingle];
        
        // Sort by creation date if available, or just group them
        setPlans(allPlans);
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
        showErrorToast(err.message || 'Could not load your plans.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllPlans();
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-40">
          <Spinner />
        </div>
      );
    }

    if (error) {
      return <p className="text-red-500 text-center">{error}</p>;
    }

    if (plans.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-black mb-4">You have no flower plans yet.</p>
          <Button asChild variant="outline">
            <Link to="/order">
              <Plus className="mr-2 h-4 w-4" /> Create Your First Plan
            </Link>
          </Button>
        </div>
      );
    }

    return (
      <Table className="border-separate border-spacing-y-3">
        <TableHeader>
          <TableRow className="border-none hover:bg-transparent">
            <TableHead className="text-black text-base">Type</TableHead>
            <TableHead className="text-black text-base">Status</TableHead>
            <TableHead className="text-black text-base">Recipient</TableHead>
            <TableHead className="text-right text-black text-base">Budget/Price</TableHead>
            <TableHead className="text-right text-black text-base">Frequency</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {plans.map((plan) => {
            const isSubscription = plan.displayType === 'Subscription';
            const price = isSubscription 
              ? (plan as SubscriptionPlan).total_amount 
              : (plan as UpfrontPlan).budget;
            
            const viewLink = isSubscription
              ? `/dashboard/subscription-plans/${plan.id}/overview`
              : `/dashboard/upfront-plans/${plan.id}/overview`;

            return (
              <TableRow
                key={`${plan.displayType}-${plan.id}`}
                className="bg-[hsl(347,100%,97%)] border-none hover:bg-[hsl(347,100%,97%)]"
              >
                <TableCell className="rounded-l-lg text-base">
                   <Badge variant="outline" className="bg-white">{plan.displayType}</Badge>
                </TableCell>
                <TableCell className="text-base">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    plan.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {plan.status === 'active' ? 'Active' : (plan.status.replace('_', ' ') || 'Pending')}
                  </span>
                </TableCell>
                <TableCell className="text-black text-base">
                  {`${plan.recipient_first_name || ''} ${plan.recipient_last_name || ''}`.trim() || 'N/A'}
                </TableCell>
                <TableCell className="text-right text-black text-base">
                    ${Number(price).toFixed(2)}
                    {isSubscription && <span className="text-[10px] block text-muted-foreground">per delivery</span>}
                </TableCell>
                <TableCell className="text-right text-black text-base capitalize">{plan.frequency}</TableCell>
                <TableCell className="rounded-r-lg text-right text-base">
                  <Button asChild variant="default" size="sm">
                    <Link to={viewLink}>
                      <Eye className="mr-2 h-4 w-4" /> View
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  };

  return (
    <Card className="bg-white shadow-md border-none text-black">
      {showTitle && (
        <CardHeader>
          <CardTitle className="text-3xl">Your Flower Plans</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default UnifiedPlanTable;
