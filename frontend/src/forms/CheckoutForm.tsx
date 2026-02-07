import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

import type { CheckoutFormProps } from '../types/CheckoutFormProps';

const CheckoutForm: React.FC<CheckoutFormProps> = ({ planId, source, intentType, itemType }) => {
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

    const returnUrl = `${window.location.origin}/payment-status`;

    if (intentType === 'setup') {
        const { error, setupIntent } = await stripe.confirmSetup({
            elements,
            confirmParams: { return_url: returnUrl },
            redirect: "if_required",
        });

        if (error) {
            setErrorMessage(error.message || 'An unexpected error occurred.');
            setIsProcessing(false);
            return;
        }

        if (setupIntent && setupIntent.status === 'succeeded') {
            const redirectUrl = new URL(returnUrl);
            redirectUrl.searchParams.set('setup_intent_client_secret', setupIntent.client_secret as string);
            redirectUrl.searchParams.set('plan_id', planId);
            if (source) redirectUrl.searchParams.set('source', source);
            redirectUrl.searchParams.set('itemType', itemType); // ADDED
            window.location.href = redirectUrl.toString();
        } else {
            setIsProcessing(false);
        }

    } else { // 'payment' intent
        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: { return_url: returnUrl },
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
            const redirectUrl = new URL(returnUrl);
            redirectUrl.searchParams.set('payment_intent_client_secret', paymentIntent.client_secret as string);
            redirectUrl.searchParams.set('plan_id', planId);
            if (source) redirectUrl.searchParams.set('source', source);
            redirectUrl.searchParams.set('itemType', itemType); // ADDED
            window.location.href = redirectUrl.toString();
        } else {
            setIsProcessing(false);
        }
    }
  };

  const buttonText = intentType === 'setup' ? 'Save card' : 'Pay now';

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
          buttonText
        )}
      </Button>

      {/* Show any error or success messages */}
      {errorMessage && <div id="payment-message" className="text-red-500 mt-2">{errorMessage}</div>}
    </form>
  );
};

export default CheckoutForm;
