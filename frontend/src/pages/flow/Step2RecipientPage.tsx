// foreverflower/frontend/src/pages/flow/Step2RecipientPage.tsx
import React from 'react';
import RecipientEngine from '@/components/RecipientEngine';

const Step2RecipientPage: React.FC = () => {
    return (
        <RecipientEngine
            mode="create"
            title="Who is receiving the flowers?"
            saveButtonText="Next: Plan Preferences"
            onSaveNavigateTo="/book-flow/flower-plan/{planId}/preferences"
            onCancelNavigateTo="/dashboard"
        />
    );
};

export default Step2RecipientPage;
