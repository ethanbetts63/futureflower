import AdminGuard from '@/shared_components/AdminGuard';
import AdminPayoutDetailPage from '@/app/dashboard/admin/payouts/[commissionId]/AdminPayoutDetailPage';

export default function Page() {
  return (
    <AdminGuard>
      <AdminPayoutDetailPage />
    </AdminGuard>
  );
}
