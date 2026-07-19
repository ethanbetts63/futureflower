import type { Order } from '@/types/Order';
import type { RecipientData } from '@/types/RecipientData';

// The single source of truth for the recipient field list, shared by every
// recipient editor (the guest flow's GuestRecipientEditor and the dashboard's
// OrderRecipientEditor) so a field added to one is never silently missing
// from the other.
export const EMPTY_RECIPIENT: RecipientData = {
  recipient_first_name: '',
  recipient_last_name: '',
  recipient_street_address: '',
  recipient_suburb: '',
  recipient_city: '',
  recipient_state: '',
  recipient_postcode: '',
  recipient_country: '',
  delivery_notes: '',
};

export const recipientFromPlan = (plan: Order): RecipientData => ({
  recipient_first_name: plan.recipient_first_name || '',
  recipient_last_name: plan.recipient_last_name || '',
  recipient_street_address: plan.recipient_street_address || '',
  recipient_suburb: plan.recipient_suburb || '',
  recipient_city: plan.recipient_city || '',
  recipient_state: plan.recipient_state || '',
  recipient_postcode: plan.recipient_postcode || '',
  recipient_country: plan.recipient_country || '',
  delivery_notes: plan.delivery_notes || '',
});
