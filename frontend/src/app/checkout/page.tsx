import { redirect } from 'next/navigation';
import CheckoutPage from '@/app/checkout/CheckoutPage';
import { getGuestOrderServerSide } from '@/lib/guestCheckoutServer';

export default async function Page() {
  const order = await getGuestOrderServerSide();
  // Nothing to pay for — start again from the homepage form.
  if (!order) redirect('/');

  return <CheckoutPage initialOrder={order} />;
}
