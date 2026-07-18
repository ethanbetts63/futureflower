import AdminGuard from '@/shared_components/AdminGuard';
import AdminEventDetailPage from '@/app/dashboard/admin/events/[eventId]/AdminEventDetailPage';

export default function Page() {
  return (
    <AdminGuard>
      <AdminEventDetailPage />
    </AdminGuard>
  );
}
