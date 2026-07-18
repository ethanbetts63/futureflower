import AdminGuard from '@/shared_components/AdminGuard';
import AdminUserDetailPage from '@/app/dashboard/admin/users/[userId]/AdminUserDetailPage';

export default function Page() {
  return (
    <AdminGuard>
      <AdminUserDetailPage />
    </AdminGuard>
  );
}
