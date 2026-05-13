import AdminGuard from '@/components/AdminGuard';
import MarkDeliveredPage from '@/page_components/admin/MarkDeliveredPage';

export default function Page() {
  return (
    <AdminGuard>
      <MarkDeliveredPage />
    </AdminGuard>
  );
}
