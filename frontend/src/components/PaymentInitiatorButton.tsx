// foreverflower/frontend/src/components/PaymentInitiatorButton.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button, type ButtonProps } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { createPaymentIntent } from '@/api/payments'; // Assuming this is the correct path

interface PaymentInitiatorButtonProps extends ButtonProps {
  itemType: 'UPFRONT_PLAN_MODIFY' | 'UPFRONT_PLAN_NEW' | 'SUBSCRIPTION_PLAN_NEW';
  details: object;
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
      const payload = {
        item_type: itemType,
        details: details,
      };
      
      const { clientSecret } = await createPaymentIntent(payload);

      if (onPaymentSuccess) {
        onPaymentSuccess(clientSecret);
      } else {
        // Default navigation behavior
        navigate('/checkout', { state: { clientSecret } });
      }

    } catch (err: any) {
      console.error("Failed to create payment intent:", err);
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
