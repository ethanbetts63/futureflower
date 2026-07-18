import AdminGuard from '@/shared_components/AdminGuard';
import AdminPartnerDetailPage from '@/app/dashboard/admin/partners/[partnerId]/AdminPartnerDetailPage';

export default function Page() {
  return (
    <AdminGuard>
      <AdminPartnerDetailPage />
    </AdminGuard>
  );
}
