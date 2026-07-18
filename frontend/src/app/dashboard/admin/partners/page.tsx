import AdminGuard from '@/shared_components/AdminGuard';
import AdminPartnerListPage from '@/app/dashboard/admin/partners/AdminPartnerListPage';

export default function Page() {
  return (
    <AdminGuard>
      <AdminPartnerListPage />
    </AdminGuard>
  );
}
