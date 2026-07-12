// futureflower/frontend/src/page_components/user_dashboard/order_management/EditPreferencesPage.tsx
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
            onSaveNavigateTo={`/dashboard/orders/${planId}/overview`}
            backPath={`/dashboard/orders/${planId}/overview`}
            getPlan={getOrder}
            updatePlan={updateOrder}
        />
    );
};

export default EditPreferencesPage;
