import AdminGuard from '@/shared_components/AdminGuard';
import AdminPayoutListPage from '@/app/dashboard/admin/payouts/AdminPayoutListPage';

export default function Page() {
  return (
    <AdminGuard>
      <AdminPayoutListPage />
    </AdminGuard>
  );
}
