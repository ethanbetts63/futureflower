import type { ButtonProps } from '@/components/ui/button';
import type { CreatePaymentIntentPayload } from './CreatePaymentIntentPayload';

export interface PaymentInitiatorButtonProps extends ButtonProps {
  itemType: 'UPFRONT_PLAN_MODIFY' | 'UPFRONT_PLAN_NEW' | 'SUBSCRIPTION_PLAN_NEW' | 'SINGLE_DELIVERY_PLAN_NEW';
  details: CreatePaymentIntentPayload['details'];
  backPath?: string;
  onPaymentInitiate?: () => void;
  onPaymentSuccess?: (clientSecret: string) => void;
  onPaymentError?: (error: any) => void;
}
