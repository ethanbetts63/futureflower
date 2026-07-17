import type { Metadata } from 'next';

// Applies to every step of the ordering flow. These pages are per-customer and
// carry no id, so there is nothing here worth indexing.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function OrderLayout({ children }: { children: React.ReactNode }) {
  return children;
}
