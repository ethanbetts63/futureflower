// futureflower/frontend/src/pages/user_dashboard/upfront_management/EditStructurePage.tsx
import React from 'react';
import SingleDeliveryStructureEditor from '@/components/form_flow/SingleDeliveryStructureEditor';

const EditStructurePage: React.FC = () => {
    return (
        <SingleDeliveryStructureEditor
            mode="edit"
            isPaid={true}
            title="Edit Delivery Details"
            saveButtonText="Save Changes"
            onSaveNavigateTo="/dashboard/upfront-plans/{planId}/overview"
            backPath="/dashboard/upfront-plans/{planId}/overview"
        />
    );
};

export default EditStructurePage;
