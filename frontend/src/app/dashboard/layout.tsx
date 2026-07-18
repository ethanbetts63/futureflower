import type { Metadata } from 'next';
import ProtectedRoute from '@/shared_components/ProtectedRoute';

// Applies to every page under /dashboard. robots.txt already asks crawlers not to
// fetch these, but a disallowed URL can still be indexed from an external link —
// only a robots meta tag actually keeps them out of the index.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
