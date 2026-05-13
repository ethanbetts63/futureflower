import ProtectedRoute from '@/components/ProtectedRoute';
import Step3PreferencesPage from '@/page_components/single_delivery_flow/Step3PreferencesPage';

export default function Page() {
  return (
    <ProtectedRoute>
      <Step3PreferencesPage />
    </ProtectedRoute>
  );
}
