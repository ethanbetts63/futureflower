import ProtectedRoute from '@/components/ProtectedRoute';
import Step5ConfirmationPage from '@/page_components/subscription_flow/Step5ConfirmationPage';

export default function Page() {
  return (
    <ProtectedRoute>
      <Step5ConfirmationPage />
    </ProtectedRoute>
  );
}
