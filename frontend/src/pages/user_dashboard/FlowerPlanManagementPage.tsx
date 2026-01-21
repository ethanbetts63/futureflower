import React, { useState, useEffect } from 'react';
import { authedFetch } from '@/apiClient';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { showErrorToast } from '@/utils/utils';
import EditButton from '@/components/EditButton';

// Based on events/models/flower_plan.py and api.ts
interface FlowerPlan {
  id: number;
  is_active: boolean;
  recipient_first_name: string | null;
  recipient_last_name: string | null;
  budget: string; // Comes as a string from DecimalField
  deliveries_per_year: number;
  years: number;
}

const FlowerPlanManagementPage: React.FC = () => {
  const [plans, setPlans] = useState<FlowerPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await authedFetch('/api/events/flower-plans/');
        if (!response.ok) {
          throw new Error('Failed to fetch flower plans.');
        }
        const data: FlowerPlan[] = await response.json();
        setPlans(data);
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
        showErrorToast(err.message || 'Could not load your flower plans.');
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
      return <p className="text-center text-black">You have no flower plans yet.</p>;
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
                  plan.is_active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-[var(--destructive)] text-white'
                }`}>
                  {plan.is_active ? 'Active' : 'Inactive'}
                </span>
              </TableCell>
              <TableCell className="text-black text-base">
                {`${plan.recipient_first_name || ''} ${plan.recipient_last_name || ''}`.trim() || 'N/A'}
              </TableCell>
              <TableCell className="text-right text-black text-base">${parseFloat(plan.budget).toFixed(2)}</TableCell>
              <TableCell className="text-right text-black text-base">{plan.deliveries_per_year}</TableCell>
              <TableCell className="text-right text-black text-base">{plan.years}</TableCell>
              <TableCell className="rounded-r-lg text-right text-base">
                <EditButton />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="min-h-screen w-full py-8" style={{ backgroundColor: 'var(--color4)' }}>
      <div className="container mx-auto px-4 max-w-4xl">
        <Card className="bg-white shadow-md border-none text-black">
          <CardHeader>
            <CardTitle className="text-3xl">Flower Plan Management</CardTitle>
          </CardHeader>
          <CardContent>
            {renderContent()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FlowerPlanManagementPage;
