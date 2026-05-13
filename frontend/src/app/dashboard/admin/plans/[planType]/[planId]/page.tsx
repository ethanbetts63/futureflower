import AdminGuard from '@/components/AdminGuard';
import AdminPlanDetailPage from '@/page_components/admin/AdminPlanDetailPage';

export default function Page() {
  return (
    <AdminGuard>
      <AdminPlanDetailPage />
    </AdminGuard>
  );
}
