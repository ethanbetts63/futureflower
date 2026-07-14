"use client";

import { AuthProvider } from '@/context/AuthContext';
import ScrollToTop from '@/components/ScrollToTop';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ScrollToTop />
      {children}
    </AuthProvider>
  );
}
