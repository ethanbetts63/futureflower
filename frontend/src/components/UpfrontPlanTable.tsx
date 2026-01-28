import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { authedFetch } from '@/apiClient';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'; // Card is not used inside renderContent, but in the original component, so we keep it if the component might be wrapped in a card. For now, we will not wrap it in a card.
import { Spinner } from '@/components/ui/spinner';
import { showErrorToast } from '@/utils/utils';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

import { type UpfrontPlan } from '@/types';

interface UpfrontPlanTableProps {
  showTitle?: boolean; // Optional prop to show/hide the title within the component
  initialPlans?: UpfrontPlan[]; // Optional prop to provide initial plans, if not fetching internally
}

const UpfrontPlanTable: React.FC<UpfrontPlanTableProps> = ({ showTitle = true, initialPlans }) => {
  const [plans, setPlans] = useState<UpfrontPlan[]>(initialPlans || []);
  const [isLoading, setIsLoading] = useState<boolean>(!initialPlans); // If initialPlans are provided, no loading needed initially
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialPlans) { // Only fetch if initialPlans are not provided
      const fetchPlans = async () => {
        try {
          const response = await authedFetch('/api/events/upfront-plans/');
          if (!response.ok) {
            throw new Error('Failed to fetch upfront plans.');
          }
          const data: UpfrontPlan[] = await response.json();
          setPlans(data);
        } catch (err: any) {
          setError(err.message || 'An unexpected error occurred.');
          showErrorToast(err.message || 'Could not load your upfront plans.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchPlans();
    }
  }, [initialPlans]);

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
      return <p className="text-center text-black">You have no upfront plans yet.</p>;
    }

    return (
      <Table className="border-separate border-spacing-y-3">
        <TableHeader>
          <TableRow className="border-none hover:bg-transparent">
            <TableHead className="text-black text-base">Status</TableHead>
            <TableHead className="text-black text-base">Recipient</TableHead>
            <TableHead className="text-right text-black text-base">Budget</TableHead>
            <TableHead className="text-right text-black text-base">Deliveries/Year</TableHead>
            <TableHead className="text-right text-black text-base">Years</TableHead>
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
                    : 'bg-[var(--destructive)] text-white'
                }`}>
                  {plan.status === 'active' ? 'Active' : 'Pending Payment'}
                </span>
              </TableCell>
              <TableCell className="text-black text-base">
                {`${plan.recipient_first_name || ''} ${plan.recipient_last_name || ''}`.trim() || 'N/A'}
              </TableCell>
              <TableCell className="text-right text-black text-base">${parseFloat(plan.budget).toFixed(2)}</TableCell>
              <TableCell className="text-right text-black text-base">{plan.deliveries_per_year}</TableCell>
              <TableCell className="text-right text-black text-base">{plan.years}</TableCell>
              <TableCell className="rounded-r-lg text-right text-base">
                <Button asChild variant="default" size="sm">
                  <Link to={`/dashboard/plans/${plan.id}/overview`}>
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
    <Card className="bg-white shadow-md border-none text-black">
      {showTitle && (
        <CardHeader>
          <CardTitle className="text-3xl">Upfront Plans</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default UpfrontPlanTable;
