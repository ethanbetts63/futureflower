import type { Order } from './Order';

export interface OrderTotalSummaryProps {
  plan: Order;
  /** Labels the total per-delivery rather than one-off. The confirmation step
   *  passes the pending checkbox state, since the order is only converted to a
   *  subscription at payment time. */
  isSubscription: boolean;
}
