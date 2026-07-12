// futureflower/frontend/src/components/PaymentInitiatorButton.tsx
"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { startCheckout } from '@/api/orders';
import type { PaymentInitiatorButtonProps } from '@/types/PaymentInitiatorButtonProps';
import { cn } from '@/utils/utils';

const PaymentInitiatorButton = ({
  orderId,
  backPath,
  onClick,
  onPaymentInitiate,
  onPaymentSuccess,
  onPaymentError,
  children,
  disabled,
  className,
  ...props
}: PaymentInitiatorButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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
      const { clientSecret } = await startCheckout(orderId);

      if (onPaymentSuccess) {
        onPaymentSuccess(clientSecret);
      } else {
        // Default navigation behavior, store state in sessionStorage for Next.js
        sessionStorage.setItem('checkoutState', JSON.stringify({
          clientSecret,
          planId: String(orderId),
          backPath: backPath,
        }));
        router.push('/checkout');
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
