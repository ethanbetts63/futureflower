// frontend/src/page_components/order_flow/StructurePage.tsx
"use client";
import SingleDeliveryStructureEditor from '@/components/form_flow/SingleDeliveryStructureEditor';
import { getGuestOrder, updateGuestOrder } from '@/api/guestCheckout';

// Not a numbered step: the homepage collects budget, delivery date, and card
// message. This is the edit target for those fields from the confirmation
// summary. mode stays "create" so the unpaid order keeps the create lead time.
const StructurePage = () => {
    return (
        <SingleDeliveryStructureEditor
            mode="create"
            saveButtonText="Next: Confirm Your Order"
            onSaveNavigateTo="/order/confirmation"
            backPath="/order/confirmation"
            getPlan={getGuestOrder}
            updatePlan={updateGuestOrder}
        />
    );
};

export default StructurePage;
