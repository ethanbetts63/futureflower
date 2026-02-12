// futureflower/frontend/src/pages/flow/Step3PreferenceSelectionPage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import PreferencesEditor from '@/components/PreferencesEditor';
import { getUpfrontPlan, updateUpfrontPlan } from '@/api';

const Step3PreferenceSelectionPage: React.FC = () => {
    const { planId } = useParams<{ planId: string }>();

    return (
        <PreferencesEditor
            mode="create"
            title="Add Your Preferences (Optional)"
            description="Let us know what they love and what they don't. This helps our florists create bouquets they'll adore."
            saveButtonText="Save & Continue"
            onSaveNavigateTo={`/upfront-flow/upfront-plan/${planId}/add-message`}
            backPath={`/upfront-flow/upfront-plan/${planId}/structure`}
            showSkipButton={true}
            getPlan={getUpfrontPlan}
            updatePlan={updateUpfrontPlan}
        />
    );
};

export default Step3PreferenceSelectionPage;