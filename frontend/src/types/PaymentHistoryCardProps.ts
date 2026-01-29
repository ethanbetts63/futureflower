import type { Plan } from './Plan';
import type { Payment } from './Payment';

export interface PaymentHistoryCardProps {
  plan: Plan & { payments?: Payment[] }; 
}
