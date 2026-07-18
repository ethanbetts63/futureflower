import AdminGuard from '@/shared_components/AdminGuard';
import MarkOrderedPage from '@/app/dashboard/admin/events/[eventId]/mark-ordered/MarkOrderedPage';

export default function Page() {
  return (
    <AdminGuard>
      <MarkOrderedPage />
    </AdminGuard>
  );
}
