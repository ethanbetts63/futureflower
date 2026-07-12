import type { Order, PartialOrder } from './Order';

export interface RecipientEditorProps {
    mode: 'create' | 'edit';
    title: string;
    saveButtonText: string;
    onSaveNavigateTo: string; // A string pattern like '/dashboard/plans/{planId}/overview'
    onCancelNavigateTo: string; // A string pattern like '/dashboard' or '/dashboard/plans/{planId}/overview'
    getPlan: (planId: string) => Promise<Order>;
    updatePlan: (planId: string, data: PartialOrder) => Promise<Order>;
}
