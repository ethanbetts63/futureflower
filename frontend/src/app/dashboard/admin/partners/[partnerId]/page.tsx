import AdminGuard from '@/components/AdminGuard';
import AdminPartnerDetailPage from '@/page_components/admin/AdminPartnerDetailPage';

export default function Page() {
  return (
    <AdminGuard>
      <AdminPartnerDetailPage />
    </AdminGuard>
  );
}
