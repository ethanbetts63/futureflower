// frontend/src/pages/single_delivery_flow/Step3PreferencesPage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import PreferencesEditor from '@/components/PreferencesEditor';
import { getUpfrontPlanAsSingleDelivery, updateUpfrontPlanAsSingleDelivery } from '@/api/singleDeliveryPlans';

const Step3PreferencesPage: React.FC = () => {
    const { planId } = useParams<{ planId: string }>();

    return (
        <PreferencesEditor
            mode="create"
            title="Set Preferences"
            description="Choose colors and flower types to make the bouquet perfect. This step is optional."
            saveButtonText="Next: Details"
            onSaveNavigateTo={`/single-delivery-flow/plan/${planId}/structure`}
            backPath={`/single-delivery-flow/plan/${planId}/recipient`}
            showSkipButton={true}
            getPlan={getUpfrontPlanAsSingleDelivery}
            updatePlan={updateUpfrontPlanAsSingleDelivery}
        />
    );
};

export default Step3PreferencesPage;
