// frontend/src/app/dashboard/orders/[planId]/edit-structure/EditStructurePage.tsx
"use client";
import { useCallback } from 'react';
import { useParams } from 'next/navigation';
import OrderStructureEditor from '@/shared_components/form_flow/OrderStructureEditor';
import { getOrder, updateOrder } from '@/api/orders';
import type { PartialOrder } from '@/types/Order';

const EditStructurePage = () => {
    const params = useParams();
    const planId = params.planId as string;

    const getPlan = useCallback(() => getOrder(planId), [planId]);
    const updatePlan = useCallback((data: PartialOrder) => updateOrder(planId, data), [planId]);

    return (
        <OrderStructureEditor
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
