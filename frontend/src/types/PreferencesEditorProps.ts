import type { Order, PartialOrder } from './Order';

export interface PreferencesEditorProps {
    mode: 'create' | 'edit';
    title?: string;
    description?: string;
    saveButtonText: string;
    onSaveNavigateTo: string;
    backPath: string;
    getPlan: () => Promise<Order>;
    updatePlan: (data: PartialOrder) => Promise<Order>;
}
