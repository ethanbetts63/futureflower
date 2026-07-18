import type { Order, PartialOrder } from './Order';

export interface OrderRecipientEditorProps {
    mode: 'create' | 'edit';
    title: string;
    saveButtonText: string;
    onSaveNavigateTo: string;
    backPath: string;
    // Bound by the caller: the guest flow resolves the order from its checkout
    // cookie, the dashboard from the planId in its own URL.
    getPlan: () => Promise<Order>;
    updatePlan: (data: PartialOrder) => Promise<Order>;
}
