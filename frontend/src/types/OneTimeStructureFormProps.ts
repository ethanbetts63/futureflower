import type { OneTimeStructureData } from './OneTimeStructureData';

export interface OneTimeStructureFormProps {
  formData: OneTimeStructureData;
  onFormChange: (field: keyof OneTimeStructureData, value: number | string | null) => void;
  title?: string;
}
