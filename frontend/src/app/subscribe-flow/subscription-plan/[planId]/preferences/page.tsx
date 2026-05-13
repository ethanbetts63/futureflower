import ProtectedRoute from '@/components/ProtectedRoute';
import Step3PreferenceSelectionPage from '@/page_components/subscription_flow/Step3PreferenceSelectionPage';

export default function Page() {
  return (
    <ProtectedRoute>
      <Step3PreferenceSelectionPage />
    </ProtectedRoute>
  );
}
