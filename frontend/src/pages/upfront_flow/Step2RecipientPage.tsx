// foreverflower/frontend/src/pages/flow/Step2RecipientPage.tsx
import React from 'react';
import RecipientEditor from '@/components/RecipientEditor';
import { getUpfrontPlan, updateUpfrontPlan } from '@/api';

const Step2RecipientPage: React.FC = () => {
    return (
        <RecipientEditor
            mode="create"
            title="Who is receiving the flowers?"
            saveButtonText="Next: Plan Preferences"
            onSaveNavigateTo="/book-flow/upfront-plan/{planId}/preferences"
            onCancelNavigateTo="/dashboard"
            getPlan={getUpfrontPlan}
            updatePlan={updateUpfrontPlan}
        />
    );
};

export default Step2RecipientPage;
