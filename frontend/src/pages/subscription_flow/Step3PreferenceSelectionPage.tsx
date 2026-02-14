import React from 'react';
import { useParams } from 'react-router-dom';
import PreferencesEditor from '@/components/PreferencesEditor';
import { getSubscriptionPlan, updateSubscriptionPlan } from '@/api';

const Step3PreferenceSelectionPage: React.FC = () => {
    const { planId } = useParams<{ planId: string }>();

    return (
        <PreferencesEditor
            mode="create"
            title="The Florist's Brief"
            description="Set the vibe and give your florist the inside scoop. This step is optional but it makes a difference."
            saveButtonText="Save & Continue"
            onSaveNavigateTo={`/subscribe-flow/subscription-plan/${planId}/structure`}
            backPath={`/subscribe-flow/subscription-plan/${planId}/recipient`}
            showSkipButton={true}
            getPlan={getSubscriptionPlan}
            updatePlan={updateSubscriptionPlan}
        />
    );
};

export default Step3PreferenceSelectionPage;
