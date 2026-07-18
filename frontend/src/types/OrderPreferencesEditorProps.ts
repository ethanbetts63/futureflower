import type { Order, PartialOrder } from './Order';

export interface OrderPreferencesEditorProps {
    mode: 'create' | 'edit';
    title?: string;
    saveButtonText: string;
    onSaveNavigateTo: string;
    backPath: string;
    getPlan: () => Promise<Order>;
    updatePlan: (data: PartialOrder) => Promise<Order>;
}
