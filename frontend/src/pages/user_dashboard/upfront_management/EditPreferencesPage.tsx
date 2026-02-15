// futureflower/frontend/src/pages/user_dashboard/upfront_management/EditPreferencesPage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import PreferencesEditor from '@/components/form_flow/PreferencesEditor';
import { getUpfrontPlan, updateUpfrontPlan } from '@/api';

const EditPreferencesPage: React.FC = () => {
    const { planId } = useParams<{ planId: string }>();

    return (
        <PreferencesEditor
            mode="edit"
            saveButtonText="Save Changes"
            onSaveNavigateTo={`/dashboard/plans/${planId}/overview`}
            backPath={`/dashboard/plans/${planId}/overview`}
            getPlan={getUpfrontPlan}
            updatePlan={updateUpfrontPlan}
        />
    );
};

export default EditPreferencesPage;