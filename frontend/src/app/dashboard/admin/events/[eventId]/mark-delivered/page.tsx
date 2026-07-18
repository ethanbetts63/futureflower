import AdminGuard from '@/shared_components/AdminGuard';
import MarkDeliveredPage from '@/app/dashboard/admin/events/[eventId]/mark-delivered/MarkDeliveredPage';

export default function Page() {
  return (
    <AdminGuard>
      <MarkDeliveredPage />
    </AdminGuard>
  );
}
