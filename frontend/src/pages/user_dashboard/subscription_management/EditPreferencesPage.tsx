// futureflower/frontend/src/pages/user_dashboard/subscription_management/EditPreferencesPage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import PreferencesEditor from '@/components/form_flow/PreferencesEditor';
import { getSubscriptionPlan, updateSubscriptionPlan } from '@/api';

const EditPreferencesPage: React.FC = () => {
    const { planId } = useParams<{ planId: string }>();

    return (
        <PreferencesEditor
            mode="edit"
            saveButtonText="Save Changes"
            onSaveNavigateTo={`/dashboard/subscription-plans/${planId}/overview`}
            backPath={`/dashboard/subscription-plans/${planId}/overview`}
            getPlan={getSubscriptionPlan}
            updatePlan={updateSubscriptionPlan}
        />
    );
};

export default EditPreferencesPage;
