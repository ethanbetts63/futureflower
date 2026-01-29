import type { UserProfile } from './users';

export interface ProfileCreationData {
    first_name: string;
    last_name: string;
    email: string;
    password?: string;
    confirmPassword?: string;
}

export interface ProfileCreationFormProps {
    initialData: Partial<ProfileCreationData>;
    onSubmit: (data: ProfileCreationData) => void;
}

export interface RecipientData {
  recipient_first_name: string;
  recipient_last_name: string;
  recipient_street_address: string;
  recipient_suburb: string;
  recipient_city: string;
  recipient_state: string;
  recipient_postcode: string;
  recipient_country: string;
}

export interface RecipientFormProps {
  formData: RecipientData;
  onFormChange: (field: keyof RecipientData, value: string) => void;
  title?: string;
}

export interface ProfileFormProps {
    profile: UserProfile;
    onProfileUpdate: (updatedProfile: UserProfile) => void;
    isEditing: boolean;
}

export interface PlanStructureData {
  budget: number;
  deliveries_per_year: number;
  years: number;
  start_date: string;
}

export interface PlanStructureFormProps {
  formData: PlanStructureData;
  onFormChange: (field: keyof PlanStructureData, value: number | string) => void;
  setIsDebouncePending?: (isPending: boolean) => void;
  title?: string;
}

export interface EventCreationData {
    name: string;
    event_date: string;
    notes?: string;
    weeks_in_advance: number;
}

export interface EventCreationFormProps {
    initialData: Partial<EventCreationData>;
    onSubmit: (data: EventCreationData) => void;
}

export interface CheckoutFormProps {
  planId: string;
  source?: string;
}

export type CalculatePlanPayload = {
  budget: number;
  deliveries_per_year: number;
  years: number;
};

export interface SubscriptionStructureFormProps {
    formData: SubscriptionStructureData;
    onFormChange: (field: keyof SubscriptionStructureData, value: string | number) => void;
    setIsDebouncePending?: (isDebouncing: boolean) => void; // Optional for compatibility
}