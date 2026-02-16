import type { PlanStructureData } from './PlanStructureData';

export interface PlanStructureFormProps {
  formData: PlanStructureData;
  onFormChange: (field: keyof PlanStructureData, value: number | string) => void;
  setIsDebouncePending?: (isPending: boolean) => void;
  title?: string;
  isEdit?: boolean;
}
