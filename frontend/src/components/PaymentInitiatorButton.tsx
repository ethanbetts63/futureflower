// foreverflower/frontend/src/components/PaymentInitiatorButton.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button, type ButtonProps } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { createPaymentIntent } from '@/api/payments';
import { createSubscription } from '@/api/subscriptionPlans'; // Import createSubscription
import type { CreatePaymentIntentPayload } from '@/types';

interface PaymentInitiatorButtonProps extends ButtonProps {
  itemType: 'UPFRONT_PLAN_MODIFY' | 'UPFRONT_PLAN_NEW' | 'SUBSCRIPTION_PLAN_NEW' | 'ONE_TIME_DELIVERY_NEW';
  details: CreatePaymentIntentPayload['details'];
  onPaymentInitiate?: () => void;
  onPaymentSuccess?: (clientSecret: string) => void;
  onPaymentError?: (error: any) => void;
}

const PaymentInitiatorButton: React.FC<PaymentInitiatorButtonProps> = ({
  itemType,
  details,
  onClick,
  onPaymentInitiate,
  onPaymentSuccess,
  onPaymentError,
  children,
  disabled,
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
        const payload = {
          item_type: itemType,
          details: details,
        };
        const response = await createPaymentIntent(payload);
        clientSecret = response.clientSecret;
      }

      if (onPaymentSuccess) {
        onPaymentSuccess(clientSecret);
      } else {
        const idToPass = details.upfront_plan_id || details.subscription_plan_id || details.one_time_order_id;
        const intentType = itemType === 'SUBSCRIPTION_PLAN_NEW' ? 'setup' : 'payment';
        
        // Default navigation behavior, now including itemType and intentType
        navigate('/checkout', { state: { clientSecret, planId: idToPass, itemType: itemType, intentType: intentType } });
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
      {...props}
    >
      {isLoading ? (
        <>
          <Spinner className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        children
      )}
    </Button>
  );
};

export default PaymentInitiatorButton;
