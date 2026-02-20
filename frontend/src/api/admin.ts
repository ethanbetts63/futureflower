import { authedFetch } from './apiClient';
import type { AdminDashboard, AdminEvent, AdminPartner, MarkOrderedPayload, MarkDeliveredPayload } from '../types/Admin';

export async function getAdminDashboard(): Promise<AdminDashboard> {
  const res = await authedFetch('/api/data/admin/dashboard/');
  if (!res.ok) throw new Error('Failed to fetch admin dashboard');
  return res.json();
}

export async function getAdminEvent(id: number): Promise<AdminEvent> {
  const res = await authedFetch(`/api/data/admin/events/${id}/`);
  if (!res.ok) throw new Error('Failed to fetch admin event');
  return res.json();
}

export async function markEventOrdered(id: number, payload: MarkOrderedPayload): Promise<AdminEvent> {
  const res = await authedFetch(`/api/data/admin/events/${id}/mark-ordered/`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || 'Failed to mark event as ordered');
  }
  return res.json();
}

export async function markEventDelivered(id: number, payload: MarkDeliveredPayload): Promise<AdminEvent> {
  const res = await authedFetch(`/api/data/admin/events/${id}/mark-delivered/`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || 'Failed to mark event as delivered');
  }
  return res.json();
}

export async function getPendingPartners(): Promise<AdminPartner[]> {
  const res = await authedFetch('/api/partners/admin/pending/');
  if (!res.ok) throw new Error('Failed to fetch pending partners');
  return res.json();
}

export async function approvePartner(id: number): Promise<AdminPartner> {
  const res = await authedFetch(`/api/partners/admin/${id}/approve/`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to approve partner');
  return res.json();
}

export async function denyPartner(id: number): Promise<AdminPartner> {
  const res = await authedFetch(`/api/partners/admin/${id}/deny/`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to deny partner');
  return res.json();
}
