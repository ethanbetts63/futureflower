import ProtectedRoute from '@/components/ProtectedRoute';
import PaymentStatusPage from '@/page_components/PaymentStatusPage';

export default function Page() {
  return (
    <ProtectedRoute>
      <PaymentStatusPage />
    </ProtectedRoute>
  );
}
