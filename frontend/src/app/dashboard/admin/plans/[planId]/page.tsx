import AdminGuard from '@/shared_components/AdminGuard';
import AdminPlanDetailPage from '@/app/dashboard/admin/plans/[planId]/AdminPlanDetailPage';

export default function Page() {
  return (
    <AdminGuard>
      <AdminPlanDetailPage />
    </AdminGuard>
  );
}
