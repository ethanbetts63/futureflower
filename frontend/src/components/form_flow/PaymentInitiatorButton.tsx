// futureflower/frontend/src/components/PaymentInitiatorButton.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ChevronRight } from 'lucide-react';
import { Button, type ButtonProps } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { createPaymentIntent } from '@/api/payments';
import { createSubscription } from '@/api/subscriptionPlans'; // Import createSubscription
import type { CreatePaymentIntentPayload } from '@/types';
import { cn } from '@/utils/utils';

interface PaymentInitiatorButtonProps extends ButtonProps {
  itemType: 'UPFRONT_PLAN_MODIFY' | 'UPFRONT_PLAN_NEW' | 'SUBSCRIPTION_PLAN_NEW' | 'SINGLE_DELIVERY_PLAN_NEW';
  details: CreatePaymentIntentPayload['details'];
  discountCode?: string | null;
  backPath?: string;
  onPaymentInitiate?: () => void;
  onPaymentSuccess?: (clientSecret: string) => void;
  onPaymentError?: (error: any) => void;
}

const PaymentInitiatorButton: React.FC<PaymentInitiatorButtonProps> = ({
  itemType,
  details,
  discountCode,
  backPath,
  onClick,
  onPaymentInitiate,
  onPaymentSuccess,
  onPaymentError,
  children,
  disabled,
  className,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInitiatePayment = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(e);
      if (e.defaultPrevented) {
        return;
      }
    }

    setIsLoading(true);
    if (onPaymentInitiate) onPaymentInitiate();

    try {
      let clientSecret: string;

      if (itemType === 'SUBSCRIPTION_PLAN_NEW') {
        const payload = { subscription_plan_id: details.subscription_plan_id as string };
        const response = await createSubscription(payload);
        clientSecret = response.clientSecret;
      } else {
        const detailsWithDiscount = discountCode
          ? { ...details, discount_code: discountCode }
          : details;
        const payload = {
          item_type: itemType,
          details: detailsWithDiscount,
        };
        const response = await createPaymentIntent(payload);
        clientSecret = response.clientSecret;
      }

      if (onPaymentSuccess) {
        onPaymentSuccess(clientSecret);
      } else {
        const idToPass = details.upfront_plan_id || details.subscription_plan_id || details.one_time_order_id || details.single_delivery_plan_id;
        const intentType = itemType === 'SUBSCRIPTION_PLAN_NEW' ? 'setup' : 'payment';
        
        // Default navigation behavior, now including itemType, intentType, and backPath
        navigate('/checkout', { state: { clientSecret, planId: idToPass, itemType: itemType, intentType: intentType, backPath: backPath } });
      }

    } catch (err: any) {
      console.error("Failed to initiate payment:", err);
      toast.error("Checkout Error", {
        description: err.message || "Could not initiate the payment process. Please try again.",
      });
      if (onPaymentError) onPaymentError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleInitiatePayment}
      disabled={disabled || isLoading}
      className={cn(
        "bg-[var(--colorgreen)] text-black font-normal px-6 py-3 rounded-xl hover:bg-[#22c55e] hover:shadow-xl transition-all cursor-pointer group shadow-lg flex items-center justify-between gap-4 min-w-[200px] border-none text-base",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        {isLoading ? (
          <Spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : null}
        <span>{children}</span>
      </div>
      <ChevronRight className="h-4 w-4 text-black/40 group-hover:text-black transition-colors" />
    </Button>
  );
};

export default PaymentInitiatorButton;
