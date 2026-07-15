"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from "@/forms/LoginForm";
import { useAuth } from '@/context/AuthContext';

const LoginPage = () => {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading || !user) return;
    if (user.is_staff || user.is_superuser) {
      router.replace('/dashboard/admin');
    } else if (user.is_partner) {
      router.replace('/dashboard/partner');
    } else {
      router.replace('/order-support');
    }
  }, [isLoading, router, user]);

  if (isLoading || user) {
    return <div className="min-h-screen bg-[var(--color4)]" />;
  }

  return (
    <div className="bg-[var(--color4)] flex flex-grow min-h-full flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-md">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
