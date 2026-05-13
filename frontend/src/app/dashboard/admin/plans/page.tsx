import AdminGuard from '@/components/AdminGuard';
import AdminPlanListPage from '@/page_components/admin/AdminPlanListPage';

export default function Page() {
  return (
    <AdminGuard>
      <AdminPlanListPage />
    </AdminGuard>
  );
}
