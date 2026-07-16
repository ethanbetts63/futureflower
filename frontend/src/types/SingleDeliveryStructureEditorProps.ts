// frontend/src/types/SingleDeliveryStructureEditorProps.ts
import type { Order, PartialOrder } from './Order';

export interface SingleDeliveryStructureEditorProps {
    mode: 'create' | 'edit';
    isPaid?: boolean;
    title?: string;
    description?: string;
    saveButtonText: string;
    onSaveNavigateTo: string;
    backPath: string;
    getPlan: () => Promise<Order>;
    updatePlan: (data: PartialOrder) => Promise<Order>;
}
