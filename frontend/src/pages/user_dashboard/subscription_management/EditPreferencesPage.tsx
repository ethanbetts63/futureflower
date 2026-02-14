// futureflower/frontend/src/pages/user_dashboard/subscription_management/EditPreferencesPage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import PreferencesEditor from '@/components/PreferencesEditor';
import { getSubscriptionPlan, updateSubscriptionPlan } from '@/api';

const EditPreferencesPage: React.FC = () => {
    const { planId } = useParams<{ planId: string }>();

    return (
        <PreferencesEditor
            mode="edit"
            title="Edit Florist's Brief"
            description="Update the vibe and notes for this subscription. It helps our florists get it just right."
            saveButtonText="Save Changes"
            onSaveNavigateTo={`/dashboard/subscription-plans/${planId}/overview`}
            backPath={`/dashboard/subscription-plans/${planId}/overview`}
            showSkipButton={false}
            getPlan={getSubscriptionPlan}
            updatePlan={updateSubscriptionPlan}
        />
    );
};

export default EditPreferencesPage;
