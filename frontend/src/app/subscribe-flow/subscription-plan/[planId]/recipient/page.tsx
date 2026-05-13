import ProtectedRoute from '@/components/ProtectedRoute';
import Step2RecipientPage from '@/page_components/subscription_flow/Step2RecipientPage';

export default function Page() {
  return (
    <ProtectedRoute>
      <Step2RecipientPage />
    </ProtectedRoute>
  );
}
