import React from 'react';
import RecipientEditor from '@/components/RecipientEditor';
import { getSubscriptionPlan, updateSubscriptionPlan } from '@/api';

const Step2RecipientPage: React.FC = () => {
    return (
        <RecipientEditor
            mode="create"
            title="Who will be receiving the flowers?"
            saveButtonText="Next: Plan Preferences"
            onSaveNavigateTo="/subscribe-flow/subscription-plan/{planId}/preferences"
            onCancelNavigateTo="/dashboard"
            getPlan={getSubscriptionPlan}
            updatePlan={updateSubscriptionPlan}
        />
    );
};

export default Step2RecipientPage;
