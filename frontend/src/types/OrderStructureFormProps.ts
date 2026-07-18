// frontend/src/types/OrderStructureFormProps.ts
import type { OrderStructureData } from './OrderStructureData';

export interface OrderStructureFormProps {
    formData: OrderStructureData;
    onFormChange: (field: keyof OrderStructureData, value: string | number) => void;
    setIsDebouncePending?: (isDebouncing: boolean) => void;
    isEdit?: boolean;
    isPaid?: boolean;
}
