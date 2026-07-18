import AdminGuard from '@/shared_components/AdminGuard';
import AdminPlanListPage from '@/app/dashboard/admin/plans/AdminPlanListPage';

export default function Page() {
  return (
    <AdminGuard>
      <AdminPlanListPage />
    </AdminGuard>
  );
}
