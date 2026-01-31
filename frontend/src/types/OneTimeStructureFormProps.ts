import type { SingleDeliveryStructureData } from './SingleDeliveryStructureData';

export interface SingleDeliveryStructureFormProps {
  formData: SingleDeliveryStructureData;
  onFormChange: (field: keyof SingleDeliveryStructureData, value: number | string | null) => void;
  title?: string;
}
