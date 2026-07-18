import AdminGuard from '@/shared_components/AdminGuard';
import AdminDashboardPage from '@/app/dashboard/admin/AdminDashboardPage';

export default function Page() {
  return (
    <AdminGuard>
      <AdminDashboardPage />
    </AdminGuard>
  );
}
