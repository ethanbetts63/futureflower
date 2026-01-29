import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

import type { CheckoutFormProps } from '../types/forms';

const CheckoutForm: React.FC<CheckoutFormProps> = ({ planId, source }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsProcessing(true);
    setErrorMessage(null);

    if (!stripe || !elements) {
      setIsProcessing(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-status`,
      },
      redirect: "if_required",
    });

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setErrorMessage(error.message || 'An unexpected error occurred.');
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
      setIsProcessing(false);
      return;
    }
    
    if (paymentIntent && paymentIntent.status === 'succeeded') {
        const redirectUrl = new URL(`${window.location.origin}/payment-status`);
        redirectUrl.searchParams.set('payment_intent_client_secret', paymentIntent.client_secret as string);
        redirectUrl.searchParams.set('plan_id', planId);
        if (source) {
            redirectUrl.searchParams.set('source', source);
        }
        window.location.href = redirectUrl.toString();
    } else {
        setIsProcessing(false);
    }
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" />
      
      <Button disabled={isProcessing || !stripe || !elements} className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white">
        {isProcessing ? (
          <>
            <Spinner className="mr-2 h-4 w-4" />
            Processing...
          </>
        ) : (
          "Pay now"
        )}
      </Button>

      {/* Show any error or success messages */}
      {errorMessage && <div id="payment-message" className="text-red-500 mt-2">{errorMessage}</div>}
    </form>
  );
};

export default CheckoutForm;
