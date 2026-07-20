import { redirect } from 'next/navigation';
import DetailsPage from '@/app/order/details/DetailsPage';
import { getGuestOrderServerSide } from '@/lib/guestCheckoutServer';

export default async function Page() {
  const order = await getGuestOrderServerSide();
  // No draft to review — start again from the homepage form.
  if (!order) redirect('/');

  return <DetailsPage initialOrder={order} />;
}
