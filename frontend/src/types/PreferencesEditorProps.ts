import type { Plan } from './Plan';
import type { PartialPlan } from './PartialPlan';

export interface PreferencesEditorProps {
    mode: 'create' | 'edit';
    title?: string;
    description?: string;
    saveButtonText: string;
    onSaveNavigateTo: string;
    backPath: string;
    getPlan: (planId: string) => Promise<Plan>;
    updatePlan: (planId: string, data: PartialPlan) => Promise<Plan>;
}
