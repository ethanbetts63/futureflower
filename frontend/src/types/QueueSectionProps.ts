import type { AdminEvent } from './Admin';

export interface QueueSectionProps {
  title: string;
  events: AdminEvent[];
  section: 'to_order' | 'ordered' | 'delivered';
}
