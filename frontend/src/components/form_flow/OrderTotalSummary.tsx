import { DollarSign } from 'lucide-react';
import SummarySection from '@/components/SummarySection';
import type { OrderTotalSummaryProps } from '@/types/OrderTotalSummaryProps';

// The single price breakdown for the ordering flow. The figures are all
// server-computed: the client must never re-derive a total, or it can show a
// number the customer is not actually charged.
const OrderTotalSummary = ({ plan, isSubscription }: OrderTotalSummaryProps) => {
  const flowerBudget = Number(plan.budget);
  const deliveryFee = Number(plan.delivery_fee);
  const discountAmount = Number(plan.discount_amount);
  const taxAmount = Number(plan.tax_amount);
  const totalPlanAmount = Number(plan.total_amount);

  return (
    <SummarySection label="Order Total">
      <div className="space-y-3 bg-black/5 rounded-2xl p-4 mt-1">
        <div className="flex items-center justify-between text-sm">
          <span className="text-black/60">Bouquet budget</span>
          <span className="font-semibold">${flowerBudget.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-black/60">Delivery</span>
          {deliveryFee > 0 ? (
            <span className="font-semibold">${deliveryFee.toFixed(2)}</span>
          ) : (
            <span className="font-semibold text-green-600">Included</span>
          )}
        </div>
        {discountAmount > 0 && (
          <div className="flex items-center justify-between text-sm text-green-600">
            <span>{plan.discount_code_display ? `Discount (${plan.discount_code_display})` : 'Discount'}</span>
            <span className="font-semibold">-${discountAmount.toFixed(2)}</span>
          </div>
        )}
        {taxAmount > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-black/60">Tax</span>
            <span className="font-semibold">${taxAmount.toFixed(2)}</span>
          </div>
        )}
        <div className="pt-3 border-t border-black/10 flex items-center justify-between">
          <span className="font-bold text-black flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-black/40" />
            {isSubscription ? 'Amount Per Delivery' : 'Total Amount Due'}
          </span>
          <span className="text-xl font-bold text-black">${totalPlanAmount.toFixed(2)}</span>
        </div>
        {isSubscription && (
          <p className="text-[10px] text-black/40 text-center uppercase tracking-widest mt-2">
            Recurring payment at the frequency selected.
          </p>
        )}
      </div>
    </SummarySection>
  );
};

export default OrderTotalSummary;
