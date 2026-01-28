// src/components/PaymentHistoryCard.tsx
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { UpfrontPlan } from '@/api'; // Assuming FlowerPlan now includes payments

// Updated Payment interface to match PaymentSerializer
interface Payment {
  id: number;
  amount: string;
  status: 'succeeded' | 'pending' | 'failed';
  created_at: string;
  stripe_payment_intent_id: string; // Add this field
}

interface PaymentHistoryCardProps {
  plan: UpfrontPlan & { payments?: Payment[] }; // FlowerPlan type extended to include optional payments
}

const PaymentHistoryCard = ({ plan }: PaymentHistoryCardProps) => {
  // Use actual payments from the plan if available, otherwise an empty array
  const payments = plan.payments || [];

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
            {payments && payments.length > 0 ? ( // Check if payments exist and has length
              payments.map((payment: Payment) => (
                <TableRow key={payment.id} className="border-none">
                  <TableCell className="font-medium">{new Date(payment.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">${parseFloat(payment.amount).toFixed(2)}</TableCell>
                  <TableCell className="text-center">
                     <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                        payment.status === 'succeeded'
                          ? 'bg-green-100 text-green-800'
                          : payment.status === 'failed'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800' // Default to pending
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
