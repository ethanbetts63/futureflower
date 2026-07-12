// futureflower/frontend/src/page_components/user_dashboard/order_management/EditStructurePage.tsx
import SingleDeliveryStructureEditor from '@/components/form_flow/SingleDeliveryStructureEditor';

const EditStructurePage = () => {
    return (
        <SingleDeliveryStructureEditor
            mode="edit"
            isPaid={true}
            title="Edit Delivery Details"
            saveButtonText="Save Changes"
            onSaveNavigateTo="/dashboard/orders/{planId}/overview"
            backPath="/dashboard/orders/{planId}/overview"
        />
    );
};

export default EditStructurePage;
