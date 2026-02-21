import { authedFetch } from './apiClient';
import type { AdminDashboard } from '../types/AdminDashboard';
import type { AdminEvent } from '../types/AdminEvent';
import type { AdminPartner } from '../types/AdminPartner';
import type { AdminPlan } from '../types/AdminPlan';
import type { AdminPlanDetail } from '../types/AdminPlanDetail';
import type { AdminUser } from '../types/AdminUser';
import type { AdminUserDetail } from '../types/AdminUserDetail';
import type { MarkOrderedPayload } from '../types/MarkOrderedPayload';
import type { MarkDeliveredPayload } from '../types/MarkDeliveredPayload';
import type { AdminCommission } from '../types/AdminCommission';

export interface PayCommissionResult {
  status: string;
  stripe_transfer_id: string;
  payout_id: number;
}

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

export async function getAdminPartners(status?: string): Promise<AdminPartner[]> {
  const url = status ? `/api/partners/admin/list/?status=${status}` : '/api/partners/admin/list/';
  const res = await authedFetch(url);
  if (!res.ok) throw new Error('Failed to fetch partners');
  return res.json();
}

export async function getAdminPartner(id: number): Promise<AdminPartner> {
  const res = await authedFetch(`/api/partners/admin/${id}/`);
  if (!res.ok) throw new Error('Failed to fetch partner');
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

export async function getAdminPlanDetail(planType: string, planId: string | number): Promise<AdminPlanDetail> {
  const res = await authedFetch(`/api/data/admin/plans/${planType}/${planId}/`);
  if (!res.ok) throw new Error('Failed to fetch plan');
  return res.json();
}

export async function getAdminUsers(search?: string): Promise<AdminUser[]> {
  const qs = search ? `?search=${encodeURIComponent(search)}` : '';
  const res = await authedFetch(`/api/data/admin/users/${qs}`);
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export async function getAdminUser(id: number): Promise<AdminUserDetail> {
  const res = await authedFetch(`/api/data/admin/users/${id}/`);
  if (!res.ok) throw new Error('Failed to fetch user');
  return res.json();
}

export async function payCommission(partnerId: number, commissionId: number): Promise<PayCommissionResult> {
  const res = await authedFetch(`/api/partners/admin/${partnerId}/commissions/${commissionId}/pay/`, {
    method: 'POST',
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw Object.assign(new Error(data.detail || 'Failed to pay commission'), { data });
  }
  return res.json();
}

export interface CommissionActionResult {
  status: string;
  stripe_transfer_id?: string;
  payout_id?: number;
}

export async function getAdminCommissions(params: { status?: string; commission_type?: string } = {}): Promise<AdminCommission[]> {
  const qs = new URLSearchParams();
  if (params.status) qs.set('status', params.status);
  if (params.commission_type) qs.set('commission_type', params.commission_type);
  const query = qs.toString();
  const res = await authedFetch(`/api/partners/admin/commissions/${query ? `?${query}` : ''}`);
  if (!res.ok) throw new Error('Failed to fetch commissions');
  return res.json();
}

export async function getAdminCommission(id: number): Promise<AdminCommission> {
  const res = await authedFetch(`/api/partners/admin/commissions/${id}/`);
  if (!res.ok) throw new Error('Failed to fetch commission');
  return res.json();
}

export async function approveCommission(id: number): Promise<CommissionActionResult> {
  const res = await authedFetch(`/api/partners/admin/commissions/${id}/approve/`, { method: 'POST' });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw Object.assign(new Error(data.detail || 'Failed to approve commission'), { data });
  }
  return res.json();
}

export async function denyCommission(id: number): Promise<CommissionActionResult> {
  const res = await authedFetch(`/api/partners/admin/commissions/${id}/deny/`, { method: 'POST' });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw Object.assign(new Error(data.detail || 'Failed to deny commission'), { data });
  }
  return res.json();
}

export async function getAdminPlans(params: { status?: string; plan_type?: string; search?: string } = {}): Promise<AdminPlan[]> {
  const qs = new URLSearchParams();
  if (params.status) qs.set('status', params.status);
  if (params.plan_type) qs.set('plan_type', params.plan_type);
  if (params.search) qs.set('search', params.search);
  const query = qs.toString();
  const res = await authedFetch(`/api/data/admin/plans/${query ? `?${query}` : ''}`);
  if (!res.ok) throw new Error('Failed to fetch plans');
  return res.json();
}
