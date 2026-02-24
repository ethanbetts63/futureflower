import type { SubscriptionStructureData } from './SubscriptionStructureData';

export interface SubscriptionStructureFormProps {
    formData: SubscriptionStructureData;
    onFormChange: (field: keyof SubscriptionStructureData, value: string | number) => void;
    setIsDebouncePending?: (isDebouncing: boolean) => void; // Optional for compatibility
    isEdit?: boolean;
    isActivePlan?: boolean;
}
