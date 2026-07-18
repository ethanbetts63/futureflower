import AdminGuard from '@/shared_components/AdminGuard';
import AdminUserListPage from '@/app/dashboard/admin/users/AdminUserListPage';

export default function Page() {
  return (
    <AdminGuard>
      <AdminUserListPage />
    </AdminGuard>
  );
}
