// futureflower/frontend/src/pages/subscription_flow/Step4StructurePage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import SubscriptionStructureEditor from '@/components/SubscriptionStructureEditor';

const Step4StructurePage: React.FC = () => {
    const { planId } = useParams<{ planId: string }>();

    return (
        <SubscriptionStructureEditor
            mode="create"
            title="Define Your Subscription"
            description="Set the budget, frequency, and start date for your flower subscription. You can also add an optional message for all deliveries."
            saveButtonText="Next: Confirm Your Plan"
            onSaveNavigateTo={`/subscribe-flow/subscription-plan/${planId}/confirmation`}
            backPath={`/subscribe-flow/subscription-plan/${planId}/preferences`}
        />
    );
};

export default Step4StructurePage;
