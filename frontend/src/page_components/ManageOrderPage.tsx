"use client";

import { useEffect, useState, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { consumeMagicLink, requestMagicLink } from '@/api/auth';
import { useAuth } from '@/context/AuthContext';

export default function ManageOrderPage({ orderId }: { orderId?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { handleLoginSuccess } = useAuth();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) return;
    setBusy(true);
    consumeMagicLink(token)
      .then(async (result) => {
        await handleLoginSuccess();
        const destination = result.order_id || orderId;
        if (destination) router.replace(`/manage-order/${destination}`);
        else setMessage('Your order access is ready. Use the link from a specific order email to open that order.');
      })
      .catch((error) => setMessage(error.message || 'This access link is invalid or has expired.'))
      .finally(() => setBusy(false));
  }, [handleLoginSuccess, orderId, router, searchParams]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    try {
      const result = await requestMagicLink(email);
      setMessage(result.detail);
    } catch (error: any) {
      setMessage(error.message || 'We could not send an access link right now.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--color4)] px-4 py-16">
      <section className="mx-auto max-w-md bg-white p-6 shadow-sm">
        <h1 className="font-playfair-display text-3xl font-bold text-black">Manage an order</h1>
        <p className="mt-3 text-sm leading-relaxed text-black/65">Enter the email used for your order and we will send a private access link.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required placeholder="you@example.com" className="h-11 w-full border border-black/15 px-3 text-sm" />
          <button disabled={busy} className="h-11 w-full bg-black text-sm font-semibold text-white disabled:opacity-60">{busy ? 'Sending...' : 'Email my access link'}</button>
        </form>
        {message && <p className="mt-4 text-sm text-black/65">{message}</p>}
      </section>
    </main>
  );
}
