// futureflower/frontend/src/pages/user_dashboard/upfront_management/EditPreferencesPage.tsx
"use client";
import { useParams } from 'next/navigation';
import PreferencesEditor from '@/components/form_flow/PreferencesEditor';
import { getUpfrontPlan, updateUpfrontPlan } from '@/api';

const EditPreferencesPage = () => {
    const params = useParams();
    const planId = params.planId as string | undefined;

    return (
        <PreferencesEditor
            mode="edit"
            saveButtonText="Save Changes"
            onSaveNavigateTo={`/dashboard/upfront-plans/${planId}/overview`}
            backPath={`/dashboard/upfront-plans/${planId}/overview`}
            getPlan={getUpfrontPlan}
            updatePlan={updateUpfrontPlan}
        />
    );
};

export default EditPreferencesPage;