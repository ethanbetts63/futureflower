// futureflower/frontend/src/pages/user_dashboard/subscription_management/EditStructurePage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import SubscriptionStructureEditor from '@/components/form_flow/SubscriptionStructureEditor';

const EditStructurePage: React.FC = () => {
    const { planId } = useParams<{ planId: string }>();

    return (
        <SubscriptionStructureEditor
            mode="edit"
            title="Edit Your Subscription"
            description="Update the budget, frequency, or message for your flower subscription."
            saveButtonText="Save Changes"
            onSaveNavigateTo={`/dashboard/subscription-plans/${planId}/overview`}
            backPath={`/dashboard/subscription-plans/${planId}/overview`}
        />
    );
};

export default EditStructurePage;
