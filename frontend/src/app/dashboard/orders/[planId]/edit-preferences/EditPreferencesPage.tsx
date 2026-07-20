"use client";
import { useCallback } from 'react';
import { useParams } from 'next/navigation';
import OrderPreferencesEditor from '@/shared_components/form_flow/OrderPreferencesEditor';
import { getOrder, updateOrder } from '@/api/orders';
import type { PartialOrder } from '@/types/Order';

const EditPreferencesPage = () => {
    const params = useParams();
    const planId = params.planId as string;

    const getPlan = useCallback(() => getOrder(planId), [planId]);
    const updatePlan = useCallback((data: PartialOrder) => updateOrder(planId, data), [planId]);

    return (
        <OrderPreferencesEditor
            mode="edit"
            saveButtonText="Save Changes"
            onSaveNavigateTo={`/dashboard/orders/${planId}/overview`}
            backPath={`/dashboard/orders/${planId}/overview`}
            getPlan={getPlan}
            updatePlan={updatePlan}
        />
    );
};

export default EditPreferencesPage;
