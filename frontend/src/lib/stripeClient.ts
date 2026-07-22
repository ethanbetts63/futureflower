import { loadStripe } from '@stripe/stripe-js';

/**
 * The browser-side Stripe instance, shared by every page that mounts Elements.
 *
 * NEXT_PUBLIC_* values are inlined into the bundle at build time, not read at
 * runtime, so a missing key is a build/deploy misconfiguration that no amount
 * of runtime handling can recover from. It has to be present in the
 * environment that runs `next build` — on Vercel that means the project's
 * environment variables, not a local .env, which is gitignored and never
 * reaches the build.
 *
 * Hence the throw rather than a `?? ''` fallback. loadStripe('') still returns
 * a Stripe object, but one that never mounts Elements: the payment box renders
 * as empty space and the page looks merely slow instead of broken. Failing
 * here surfaces the real cause at build time.
 *
 * Note this cannot catch a key that is present but points at the wrong Stripe
 * mode — a live key against a test-mode client secret fails inside Elements,
 * and shows up in the browser console rather than here.
 */
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error(
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set. It is inlined at build ' +
      'time, so it must exist in the environment running `next build`.',
  );
}

export const stripePromise = loadStripe(publishableKey);
