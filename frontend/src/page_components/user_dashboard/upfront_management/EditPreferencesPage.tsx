// futureflower/frontend/src/pages/user_dashboard/upfront_management/EditPreferencesPage.tsx
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
            onSaveNavigateTo={`/dashboard/upfront-plans/${planId}/overview`}
            backPath={`/dashboard/upfront-plans/${planId}/overview`}
            getPlan={getOrder}
            updatePlan={updateOrder}
        />
    );
};

export default EditPreferencesPage;