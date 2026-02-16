import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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

const UnifiedPlanTable: React.FC = () => {
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
      return <p className="text-red-500 text-center py-8">{error}</p>;
    }

    if (plans.length === 0) {
      return (
        <div className="text-center py-12 bg-black/5 rounded-3xl mt-4">
          <p className="text-black/60 mb-6 italic">You have no flower plans yet.</p>
          <Button asChild variant="default" className="font-bold">
            <Link to="/order">
              <Plus className="mr-2 h-4 w-4" /> Create Your First Plan
            </Link>
          </Button>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto -mx-4 md:mx-0">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="border-b-black/5 hover:bg-transparent">
              <TableHead className="text-black/40 uppercase text-[10px] font-bold tracking-widest">Type</TableHead>
              <TableHead className="text-black/40 uppercase text-[10px] font-bold tracking-widest">Status</TableHead>
              <TableHead className="text-black/40 uppercase text-[10px] font-bold tracking-widest">Recipient</TableHead>
              <TableHead className="text-right text-black/40 uppercase text-[10px] font-bold tracking-widest">Price</TableHead>
              <TableHead className="text-right text-black/40 uppercase text-[10px] font-bold tracking-widest">Frequency</TableHead>
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
                  className="border-b-black/5 last:border-0 hover:bg-black/[0.02] transition-colors"
                >
                  <TableCell className="py-5">
                     <Badge variant="outline" className="bg-black/5 text-black/60 text-[10px] uppercase font-bold tracking-tighter border-black/10">
                       {plan.displayType}
                     </Badge>
                  </TableCell>
                  <TableCell className="py-5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      plan.status === 'active'
                        ? 'bg-[var(--colorgreen)]/10 text-[var(--colorgreen)]'
                        : 'bg-yellow-500/10 text-yellow-600'
                    }`}>
                      {plan.status === 'active' ? 'Active' : (plan.status.replace('_', ' ') || 'Pending')}
                    </span>
                  </TableCell>
                  <TableCell className="text-black font-bold font-['Playfair_Display',_serif] py-5">
                    {`${plan.recipient_first_name || ''} ${plan.recipient_last_name || ''}`.trim() || 'N/A'}
                  </TableCell>
                  <TableCell className="text-right py-5">
                      <span className="font-bold font-['Playfair_Display',_serif] text-lg">${Number(price).toFixed(2)}</span>
                      {isSubscription && <span className="text-[10px] block text-black/40 uppercase font-bold">per delivery</span>}
                  </TableCell>
                  <TableCell className="text-right text-black/60 text-sm capitalize py-5">
                    {plan.displayType === 'Single Delivery' ? 'N/A' : plan.frequency}
                  </TableCell>
                  <TableCell className="text-right py-5">
                    <Button asChild variant="ghost" size="sm" className="hover:bg-black/5 rounded-full h-10 w-10 p-0">
                      <Link to={viewLink}>
                        <Eye className="h-5 w-5" />
                        <span className="sr-only">View</span>
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <div className="w-full">
      {renderContent()}
    </div>
  );
};

export default UnifiedPlanTable;
