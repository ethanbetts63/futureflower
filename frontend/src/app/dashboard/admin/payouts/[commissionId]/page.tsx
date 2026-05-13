import AdminGuard from '@/components/AdminGuard';
import AdminPayoutDetailPage from '@/page_components/admin/AdminPayoutDetailPage';

export default function Page() {
  return (
    <AdminGuard>
      <AdminPayoutDetailPage />
    </AdminGuard>
  );
}
