import { cookies } from 'next/headers';
import { parseOrder } from '@/api/parseOrder';
import type { Order } from '@/types/Order';

// Mirrors CHECKOUT_COOKIE in events/views/guest_checkout_view.py. The cookie is
// httponly, so this is the only place the draft order can be resolved before
// the browser has run any JS.
const CHECKOUT_COOKIE = 'guest_checkout_token';

/**
 * Loads the guest's draft order on the server, for the ordering flow's initial
 * render.
 *
 * The browser-side equivalent is getGuestOrder() in api/guestCheckout.ts, which
 * relies on the browser attaching the checkout cookie automatically. Server-side
 * there is no automatic cookie jar, so the cookie is read off the incoming
 * request and forwarded by hand — and the request goes straight to Django rather
 * than through the /api rewrite in next.config.ts, which only exists for the
 * browser's benefit.
 *
 * Returns null when there is no usable session: no cookie yet (a visitor who has
 * not started an order) or an expired/unknown one (Django answers 410). Both are
 * ordinary states rather than failures, so callers redirect instead of erroring.
 * A malformed order body still throws, via parseOrder — that means the API
 * contract has broken, and should be loud.
 */
export async function getGuestOrderServerSide(): Promise<Order | null> {
  const token = (await cookies()).get(CHECKOUT_COOKIE)?.value;
  if (!token) return null;

  const apiUrl = process.env.DJANGO_API_URL ?? 'http://127.0.0.1:8000';

  let response: Response;
  try {
    response = await fetch(`${apiUrl}/api/events/guest-checkout/order/`, {
      headers: { Cookie: `${CHECKOUT_COOKIE}=${token}` },
      // The draft changes on every step; a cached copy would render stale
      // recipient details or totals.
      cache: 'no-store',
    });
  } catch {
    // Django unreachable. Treat as "no session" so the flow sends the customer
    // back to the start rather than rendering an error page mid-checkout.
    return null;
  }

  if (!response.ok) return null;
  return parseOrder(await response.json());
}
