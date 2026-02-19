import type { AdminEvent } from './Admin';

export interface EventCardProps {
  event: AdminEvent;
  section: 'to_order' | 'ordered' | 'delivered';
}
