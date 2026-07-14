import ManagedOrderDetailPage from '@/page_components/ManagedOrderDetailPage';
import ManageOrderPage from '@/page_components/ManageOrderPage';

export default async function Page({ params, searchParams }: { params: Promise<{ orderId: string }>; searchParams: Promise<{ token?: string }> }) {
  const { orderId } = await params;
  const { token } = await searchParams;
  return token ? <ManageOrderPage orderId={orderId} /> : <ManagedOrderDetailPage orderId={orderId} />;
}
