import React from 'react';
import RecipientEditor from '@/components/RecipientEditor';

const Step2RecipientPage: React.FC = () => {
    return (
        <RecipientEditor
            mode="create"
            title="Who is this subscription for?"
            saveButtonText="Next: Plan Preferences"
            onSaveNavigateTo="/subscribe-flow/subscription-plan/{planId}/preferences"
            onCancelNavigateTo="/dashboard"
        />
    );
};

export default Step2RecipientPage;
