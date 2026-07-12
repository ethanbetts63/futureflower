import type { Order, PartialOrder } from './Order';

export interface PreferencesEditorProps {
    mode: 'create' | 'edit';
    title?: string;
    description?: string;
    saveButtonText: string;
    onSaveNavigateTo: string;
    backPath: string;
    getPlan: (planId: string) => Promise<Order>;
    updatePlan: (planId: string, data: PartialOrder) => Promise<Order>;
}
