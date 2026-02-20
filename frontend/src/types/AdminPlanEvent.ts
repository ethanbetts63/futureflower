export interface AdminPlanEvent {
  id: number;
  delivery_date: string;
  status: 'scheduled' | 'ordered' | 'delivered' | 'cancelled';
}
