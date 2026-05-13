import ProtectedRoute from '@/components/ProtectedRoute';
import CheckoutPage from '@/page_components/CheckoutPage';

export default function Page() {
  return (
    <ProtectedRoute>
      <CheckoutPage />
    </ProtectedRoute>
  );
}
