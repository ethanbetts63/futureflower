import type { Metadata } from 'next';
import ProtectedRoute from '@/shared_components/ProtectedRoute';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
