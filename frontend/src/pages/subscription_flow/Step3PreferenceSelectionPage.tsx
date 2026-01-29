import React from 'react';
import { useParams } from 'react-router-dom';
import PreferencesEditor from '@/components/PreferencesEditor';

const Step3PreferenceSelectionPage: React.FC = () => {
    const { planId } = useParams<{ planId: string }>();

    return (
        <PreferencesEditor
            mode="create"
            title="Add Your Preferences (Optional)"
            description="Let us know what they love and what they don't. This helps our florists create bouquets they'll adore."
            saveButtonText="Save & Continue"
            onSaveNavigateTo={`/subscribe-flow/subscription-plan/${planId}/structure`}
            backPath={`/subscribe-flow/subscription-plan/${planId}/recipient`}
            showSkipButton={true}
        />
    );
};

export default Step3PreferenceSelectionPage;
