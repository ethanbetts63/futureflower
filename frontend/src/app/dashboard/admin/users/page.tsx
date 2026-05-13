import AdminGuard from '@/components/AdminGuard';
import AdminUserListPage from '@/page_components/admin/AdminUserListPage';

export default function Page() {
  return (
    <AdminGuard>
      <AdminUserListPage />
    </AdminGuard>
  );
}
