// futureflower/frontend/src/pages/user_dashboard/upfront_management/EditPreferencesPage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import PreferencesEditor from '@/components/PreferencesEditor';
import { getUpfrontPlan, updateUpfrontPlan } from '@/api';

const EditPreferencesPage: React.FC = () => {
    const { planId } = useParams<{ planId: string }>();

    return (
        <PreferencesEditor
            mode="edit"
            title="Edit Florist's Brief"
            description="Update the vibe and notes for this plan. It helps our florists get it just right."
            saveButtonText="Save Changes"
            onSaveNavigateTo={`/dashboard/plans/${planId}/overview`}
            backPath={`/dashboard/plans/${planId}/overview`}
            showSkipButton={false}
            getPlan={getUpfrontPlan}
            updatePlan={updateUpfrontPlan}
        />
    );
};

export default EditPreferencesPage;