// foreverflower/frontend/src/pages/flow/Step2RecipientPage.tsx
import React from 'react';
import RecipientEditor from '@/components/RecipientEditor';

const Step2RecipientPage: React.FC = () => {
    return (
        <RecipientEditor
            mode="create"
            title="Who is receiving the flowers?"
            saveButtonText="Next: Plan Preferences"
            onSaveNavigateTo="/book-flow/flower-plan/{planId}/preferences"
            onCancelNavigateTo="/dashboard"
        />
    );
};

export default Step2RecipientPage;
