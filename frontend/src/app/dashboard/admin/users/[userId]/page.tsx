import AdminGuard from '@/components/AdminGuard';
import AdminUserDetailPage from '@/page_components/admin/AdminUserDetailPage';

export default function Page() {
  return (
    <AdminGuard>
      <AdminUserDetailPage />
    </AdminGuard>
  );
}
