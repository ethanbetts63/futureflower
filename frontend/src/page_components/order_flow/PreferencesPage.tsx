// frontend/src/page_components/order_flow/PreferencesPage.tsx
"use client";
import PreferencesEditor from '@/components/form_flow/PreferencesEditor';
import { getGuestOrder, updateGuestOrder } from '@/api/guestCheckout';

// Not a numbered step: the homepage collects the brief up front. This is the
// edit target for flower preferences, reached from the confirmation summary.
const PreferencesPage = () => {
    return (
        <PreferencesEditor
            mode="create"
            saveButtonText="Next: Confirm Your Order"
            onSaveNavigateTo="/order/confirmation"
            backPath="/order/confirmation"
            getPlan={getGuestOrder}
            updatePlan={updateGuestOrder}
        />
    );
};

export default PreferencesPage;
