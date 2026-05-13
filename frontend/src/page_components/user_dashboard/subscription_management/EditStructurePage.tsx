// futureflower/frontend/src/pages/user_dashboard/subscription_management/EditStructurePage.tsx
"use client";
import { useParams } from 'next/navigation';
import SubscriptionStructureEditor from '@/components/form_flow/SubscriptionStructureEditor';

const EditStructurePage = () => {
    const params = useParams();
    const planId = params.planId as string | undefined;

    return (
        <SubscriptionStructureEditor
            mode="edit"
            saveButtonText="Save Changes"
            onSaveNavigateTo={`/dashboard/subscription-plans/${planId}/overview`}
            backPath={`/dashboard/subscription-plans/${planId}/overview`}
        />
    );
};

export default EditStructurePage;
