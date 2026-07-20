import { redirect } from 'next/navigation';
import RecipientPage from '@/app/order/recipient/RecipientPage';
import { getGuestOrderServerSide } from '@/lib/guestCheckoutServer';

export default async function Page() {
  const order = await getGuestOrderServerSide();
  // No draft to edit — start again from the homepage form.
  if (!order) redirect('/');

  return <RecipientPage initialOrder={order} />;
}
