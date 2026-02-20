import type { AdminEvent } from './AdminEvent';

export interface AdminDashboard {
  to_order: AdminEvent[];
  ordered: AdminEvent[];
  delivered: AdminEvent[];
}
