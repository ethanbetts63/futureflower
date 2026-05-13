import AdminGuard from '@/components/AdminGuard';
import AdminPayoutListPage from '@/page_components/admin/AdminPayoutListPage';

export default function Page() {
  return (
    <AdminGuard>
      <AdminPayoutListPage />
    </AdminGuard>
  );
}
