import AdminGuard from '@/components/AdminGuard';
import MarkOrderedPage from '@/page_components/admin/MarkOrderedPage';

export default function Page() {
  return (
    <AdminGuard>
      <MarkOrderedPage />
    </AdminGuard>
  );
}
