import type { AdminEvent } from './AdminEvent';

export interface QueueSectionProps {
  title: string;
  events: AdminEvent[];
  section: 'to_order' | 'ordered' | 'delivered';
}
