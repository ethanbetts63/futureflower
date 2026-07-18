// frontend/src/types/OrderStructureEditorProps.ts
import type { Order, PartialOrder } from './Order';

export interface OrderStructureEditorProps {
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
