// futureflower/frontend/src/pages/user_dashboard/subscription_management/EditPreferencesPage.tsx
"use client";
import { useParams } from 'next/navigation';
import PreferencesEditor from '@/components/form_flow/PreferencesEditor';
import { getOrder, updateOrder } from '@/api/orders';

const EditPreferencesPage = () => {
    const params = useParams();
    const planId = params.planId as string | undefined;

    return (
        <PreferencesEditor
            mode="edit"
            saveButtonText="Save Changes"
            onSaveNavigateTo={`/dashboard/subscription-plans/${planId}/overview`}
            backPath={`/dashboard/subscription-plans/${planId}/overview`}
            getPlan={getOrder}
            updatePlan={updateOrder}
        />
    );
};

export default EditPreferencesPage;
