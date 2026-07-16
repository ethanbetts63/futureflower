// futureflower/frontend/src/page_components/user_dashboard/order_management/EditStructurePage.tsx
"use client";
import { useCallback } from 'react';
import { useParams } from 'next/navigation';
import SingleDeliveryStructureEditor from '@/components/form_flow/SingleDeliveryStructureEditor';
import { getOrder, updateOrder } from '@/api/orders';
import type { PartialOrder } from '@/types/Order';

const EditStructurePage = () => {
    const params = useParams();
    const planId = params.planId as string;

    const getPlan = useCallback(() => getOrder(planId), [planId]);
    const updatePlan = useCallback((data: PartialOrder) => updateOrder(planId, data), [planId]);

    return (
        <SingleDeliveryStructureEditor
            mode="edit"
            isPaid={true}
            title="Edit Delivery Details"
            saveButtonText="Save Changes"
            onSaveNavigateTo={`/dashboard/orders/${planId}/overview`}
            backPath={`/dashboard/orders/${planId}/overview`}
            getPlan={getPlan}
            updatePlan={updatePlan}
        />
    );
};

export default EditStructurePage;
