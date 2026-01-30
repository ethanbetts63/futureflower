// src/components/PaymentHistoryCard.tsx
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { PaymentHistoryCardProps } from '../types/PaymentHistoryCardProps';
import type { Payment } from '../types/Payment';
import type { SubscriptionPlan } from '../types/SubscriptionPlan';

const PaymentHistoryCard = ({ plan }: PaymentHistoryCardProps) => {
  const payments = plan.payments || [];

  const isSubscriptionPlan = (p: any): p is SubscriptionPlan => {
    return 'frequency' in p && p.frequency !== null;
  };

  let nextPaymentDateStr: string | null = null;
  if (isSubscriptionPlan(plan) && plan.next_payment_date) {
    // Backend returns date as YYYY-MM-DD. Appending T00:00:00 ensures it's parsed as local time midnight
    // and avoids timezone-related "off by one day" errors.
    nextPaymentDateStr = new Date(`${plan.next_payment_date}T00:00:00`).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
  }

  return (
    <Card className="w-full bg-white shadow-md border-none text-black">
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
        <CardDescription>A record of all payments for this plan.</CardDescription>
      </CardHeader>
      <CardContent>
        {nextPaymentDateStr && (
          <div className="mb-6 border-b border-gray-200 pb-4">
            <h3 className="text-lg font-semibold text-black">Next Payment Due</h3>
            <p className="text-gray-600">{nextPaymentDateStr}</p>
          </div>
        )}
        <Table>
          <TableHeader>
            <TableRow className="border-b-gray-200">
              <TableHead className="text-black">Date</TableHead>
              <TableHead className="text-black text-right">Amount</TableHead>
              <TableHead className="text-black text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments && payments.length > 0 ? (
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

