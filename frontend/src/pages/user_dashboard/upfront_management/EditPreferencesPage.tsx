// foreverflower/frontend/src/pages/user_dashboard/EditPreferencesPage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import PreferencesEditor from '@/components/PreferencesEditor';

import { getSubscriptionPlan, updateSubscriptionPlan } from '@/api/subscriptionPlans';

const EditPreferencesPage: React.FC = () => {
    const { planId } = useParams<{ planId: string }>();

    return (
        <PreferencesEditor
            mode="edit"
            title="Edit Your Preferences"
            description="Update the preferences for this plan. This helps our florists create bouquets they'll adore."
            saveButtonText="Save Changes"
            onSaveNavigateTo={`/dashboard/plans/${planId}/overview`}
            backPath={`/dashboard/plans/${planId}/overview`}
            showSkipButton={false}
            getPlan={getSubscriptionPlan}
            updatePlan={updateSubscriptionPlan}
        />
    );
};

export default EditPreferencesPage;