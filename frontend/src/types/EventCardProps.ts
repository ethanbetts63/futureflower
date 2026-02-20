import type { AdminEvent } from './AdminEvent';

export interface EventCardProps {
  event: AdminEvent;
  section: 'to_order' | 'ordered' | 'delivered';
}
