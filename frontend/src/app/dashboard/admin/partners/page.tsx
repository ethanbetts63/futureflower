import AdminGuard from '@/components/AdminGuard';
import AdminPartnerListPage from '@/page_components/admin/AdminPartnerListPage';

export default function Page() {
  return (
    <AdminGuard>
      <AdminPartnerListPage />
    </AdminGuard>
  );
}
