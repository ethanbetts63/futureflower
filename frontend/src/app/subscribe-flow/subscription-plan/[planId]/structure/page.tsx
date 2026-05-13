import ProtectedRoute from '@/components/ProtectedRoute';
import Step4StructurePage from '@/page_components/subscription_flow/Step4StructurePage';

export default function Page() {
  return (
    <ProtectedRoute>
      <Step4StructurePage />
    </ProtectedRoute>
  );
}
