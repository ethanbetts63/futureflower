import type { Plan } from './Plan';
import type { PartialPlan } from './PartialPlan';

export interface RecipientEditorProps {
    mode: 'create' | 'edit';
    title: string;
    saveButtonText: string;
    onSaveNavigateTo: string; // A string pattern like '/dashboard/plans/{planId}/overview'
    onCancelNavigateTo: string; // A string pattern like '/dashboard' or '/dashboard/plans/{planId}/overview'
    getPlan: (planId: string) => Promise<Plan>;
    updatePlan: (planId: string, data: PartialPlan) => Promise<Plan>;
}
