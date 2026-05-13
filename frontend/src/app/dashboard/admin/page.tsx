import AdminGuard from '@/components/AdminGuard';
import AdminDashboardPage from '@/page_components/admin/AdminDashboardPage';

export default function Page() {
  return (
    <AdminGuard>
      <AdminDashboardPage />
    </AdminGuard>
  );
}
