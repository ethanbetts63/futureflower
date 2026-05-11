"use client";

import { StrictMode, useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import App from "@/App";
import { AuthProvider } from "@/context/AuthContext";
import ScrollToTop from "@/components/ScrollToTop";

export default function LegacyAppShell() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <ScrollToTop />
          <App />
        </AuthProvider>
      </BrowserRouter>
    </StrictMode>
  );
}
