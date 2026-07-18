import { Suspense } from 'react';
import PaymentStatusPage from '@/app/payment-status/PaymentStatusPage';

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--color4)]" />}>
      <PaymentStatusPage />
    </Suspense>
  );
}
