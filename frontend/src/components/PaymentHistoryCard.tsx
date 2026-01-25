// src/components/PaymentHistoryCard.tsx
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { FlowerPlan } from '@/api';

// This Payment interface is a placeholder until the API is updated.
// We expect a payment history to be available on the plan.
interface Payment {
  id: number;
  amount: string;
  status: 'succeeded' | 'pending' | 'failed';
  created_at: string;
}

interface PaymentHistoryCardProps {
  plan: FlowerPlan;
}

const PaymentHistoryCard = ({ plan }: PaymentHistoryCardProps) => {
  // We're using a mock payment here because the API currently does not
  // serialize payment history with the plan. This is a placeholder.
  const mockPayments: Payment[] = [
    {
      id: 1,
      amount: plan.total_amount.toString(),
      status: 'succeeded',
      created_at: plan.created_at,
    }
  ];

  const payments = mockPayments;

  return (
    <Card className="w-full bg-white shadow-md border-none text-black">
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
        <CardDescription>A record of all payments for this plan.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-b-gray-200">
              <TableHead className="text-black">Date</TableHead>
              <TableHead className="text-black text-right">Amount</TableHead>
              <TableHead className="text-black text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.length > 0 ? (
              payments.map((payment: Payment) => (
                <TableRow key={payment.id} className="border-none">
                  <TableCell className="font-medium">{new Date(payment.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">${parseFloat(payment.amount).toFixed(2)}</TableCell>
                  <TableCell className="text-center">
                     <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                        payment.status === 'succeeded'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                      {payment.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-gray-500 py-4">
                  No payment history found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PaymentHistoryCard;
