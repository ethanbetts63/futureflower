// src/components/PaymentHistoryCard.tsx
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
  let nextDeliveryDateStr: string | null = null;
  if (isSubscriptionPlan(plan)) {
    if (plan.next_payment_date) {
      nextPaymentDateStr = new Date(`${plan.next_payment_date}T00:00:00`).toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
      });
    }
    if (plan.next_delivery_date) {
        nextDeliveryDateStr = new Date(`${plan.next_delivery_date}T00:00:00`).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    }
  }

  return (
    <div className="w-full text-black">
      {nextPaymentDateStr && (
        <div className="mb-6 border-b border-black/5 pb-4">
          <h3 className="text-sm font-bold tracking-widest uppercase text-black/40 mb-1">Next Payment Due</h3>
          <p className="font-bold font-['Playfair_Display',_serif] text-lg">{nextPaymentDateStr}</p>
        </div>
      )}
      {nextDeliveryDateStr && (
        <div className="mb-6 border-b border-black/5 pb-4">
          <h3 className="text-sm font-bold tracking-widest uppercase text-black/40 mb-1">Next Delivery Date</h3>
          <p className="font-bold font-['Playfair_Display',_serif] text-lg">{nextDeliveryDateStr}</p>
        </div>
      )}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b-black/5 hover:bg-transparent">
              <TableHead className="text-black/40 uppercase text-[10px] font-bold tracking-widest">Date</TableHead>
              <TableHead className="text-black/40 uppercase text-[10px] font-bold tracking-widest text-right">Amount</TableHead>
              <TableHead className="text-black/40 uppercase text-[10px] font-bold tracking-widest text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments && payments.length > 0 ? (
              payments.map((payment: Payment) => (
                <TableRow key={payment.id} className="border-b-black/5 last:border-0 hover:bg-black/[0.02] transition-colors">
                  <TableCell className="font-medium py-4">{new Date(payment.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right py-4 font-bold font-['Playfair_Display',_serif]">${parseFloat(payment.amount).toFixed(2)}</TableCell>
                  <TableCell className="text-center py-4">
                     <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        payment.status === 'succeeded'
                          ? 'bg-[var(--colorgreen)]/10 text-[var(--colorgreen)]'
                          : payment.status === 'failed'
                          ? 'bg-red-500/10 text-red-600'
                          : 'bg-yellow-500/10 text-yellow-600'
                      }`}>
                      {payment.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-black/40 py-8 italic text-sm">
                  No payment history found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PaymentHistoryCard;

