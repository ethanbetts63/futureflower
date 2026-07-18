// frontend/src/app/dashboard/orders/[planId]/edit-recipient/EditRecipientPage.tsx
"use client";
import { useCallback } from 'react';
import { useParams } from 'next/navigation';
import OrderRecipientEditor from '@/shared_components/form_flow/OrderRecipientEditor';
import { getOrder, updateOrder } from '@/api/orders';
import type { PartialOrder } from '@/types/Order';

const EditRecipientPage = () => {
    const params = useParams();
    const planId = params.planId as string;

    // useCallback is load-bearing: the editor keys its fetch effect on these, so
    // a fresh closure each render would refetch forever.
    const getPlan = useCallback(() => getOrder(planId), [planId]);
    const updatePlan = useCallback((data: PartialOrder) => updateOrder(planId, data), [planId]);

    return (
        <OrderRecipientEditor
            mode="edit"
            title="Edit Recipient Details"
            saveButtonText="Save Changes"
            onSaveNavigateTo={`/dashboard/orders/${planId}/overview`}
            backPath={`/dashboard/orders/${planId}/overview`}
            getPlan={getPlan}
            updatePlan={updatePlan}
        />
    );
};

export default EditRecipientPage;
