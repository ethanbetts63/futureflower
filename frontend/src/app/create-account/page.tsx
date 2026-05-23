import { Suspense } from 'react';
import Step1CreateAccountPage from '@/page_components/Step1CreateAccountPage';

export default function Page() {
  return (
    <Suspense fallback={null}>
      <Step1CreateAccountPage />
    </Suspense>
  );
}
