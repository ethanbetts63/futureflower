// frontend/src/pages/single_delivery_flow/Step4StructurePage.tsx
"use client";
import { useParams } from 'next/navigation';
import SingleDeliveryStructureEditor from '@/components/form_flow/SingleDeliveryStructureEditor';

// No longer a step in the ordering flow — the homepage collects budget, delivery
// date, and card message. This page remains as the edit target for those fields
// from the confirmation summary.
const Step4StructurePage = () => {
    const params = useParams();
    const planId = params.planId as string | undefined;

    return (
        <SingleDeliveryStructureEditor
            mode="create"
            saveButtonText="Next: Confirm Your Order"
            onSaveNavigateTo={`/single-delivery-flow/plan/${planId}/confirmation`}
            backPath={`/single-delivery-flow/plan/${planId}/confirmation`}
        />
    );
};

export default Step4StructurePage;
