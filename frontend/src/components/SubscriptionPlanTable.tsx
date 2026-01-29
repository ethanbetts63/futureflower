// foreverflower/frontend/src/components/SubscriptionPlanTable.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { showErrorToast } from '@/utils/utils';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { getSubscriptionPlans } from '@/api'; // We will need to create this API function
import { type SubscriptionPlan } from '@/types';
import type { SubscriptionPlanTableProps } from '@/types/component_props';

const SubscriptionPlanTable: React.FC<SubscriptionPlanTableProps> = ({ showTitle = true }) => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        // This function will need to be created in the API client
        const data: SubscriptionPlan[] = await getSubscriptionPlans(); 
        setPlans(data);
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
        showErrorToast(err.message || 'Could not load your subscription plans.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlans();
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
      return <p className="text-center text-black">You have no subscription plans yet.</p>;
    }
    
    const frequencyMap: { [key: string]: string } = {
        'monthly': 'Monthly',
        'quarterly': 'Quarterly',
        'bi-annually': 'Bi-Annually',
        'annually': 'Annually',
    };

    return (
      <Table className="border-separate border-spacing-y-3">
        <TableHeader>
          <TableRow className="border-none hover:bg-transparent">
            <TableHead className="text-black text-base">Status</TableHead>
            <TableHead className="text-black text-base">Recipient</TableHead>
            <TableHead className="text-right text-black text-base">Price/Delivery</TableHead>
            <TableHead className="text-right text-black text-base">Frequency</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {plans.map((plan) => (
            <TableRow
              key={plan.id}
              className="bg-[hsl(347,100%,97%)] border-none hover:bg-[hsl(347,100%,97%)]"
            >
              <TableCell className="rounded-l-lg text-base">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  plan.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {plan.status.replace('_', ' ')}
                </span>
              </TableCell>
              <TableCell className="text-black text-base">
                {`${plan.recipient_first_name || ''} ${plan.recipient_last_name || ''}`.trim() || 'N/A'}
              </TableCell>
              <TableCell className="text-right text-black text-base">${plan.price_per_delivery.toFixed(2)}</TableCell>
              <TableCell className="text-right text-black text-base">{plan.frequency ? frequencyMap[plan.frequency] : 'N/A'}</TableCell>
              <TableCell className="rounded-r-lg text-right text-base">
                <Button asChild variant="default" size="sm">
                  <Link to={`/dashboard/subscription-plans/${plan.id}/overview`}>
                    <Eye className="mr-2 h-4 w-4" /> View
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <Card className="bg-white shadow-md border-none text-black mt-8">
      {showTitle && (
        <CardHeader>
          <CardTitle className="text-3xl">Subscription Plans</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default SubscriptionPlanTable;
