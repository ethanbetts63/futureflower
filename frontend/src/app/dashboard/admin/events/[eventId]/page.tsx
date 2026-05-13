import AdminGuard from '@/components/AdminGuard';
import AdminEventDetailPage from '@/page_components/admin/AdminEventDetailPage';

export default function Page() {
  return (
    <AdminGuard>
      <AdminEventDetailPage />
    </AdminGuard>
  );
}
