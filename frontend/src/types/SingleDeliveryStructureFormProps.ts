// frontend/src/types/SingleDeliveryStructureFormProps.ts
import type { SingleDeliveryStructureData } from './SingleDeliveryStructureData';

export interface SingleDeliveryStructureFormProps {
    formData: SingleDeliveryStructureData;
    onFormChange: (field: keyof SingleDeliveryStructureData, value: string | number) => void;
    setIsDebouncePending?: (isDebouncing: boolean) => void;
    isEdit?: boolean;
}
