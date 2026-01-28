// foreverflower/frontend/src/pages/user_dashboard/EditStructurePage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import StructureEditor from '@/components/StructureEditor';

const EditStructurePage: React.FC = () => {
    const { planId } = useParams<{ planId: string }>();

    return (
        <StructureEditor
            mode="edit"
            title="Edit Plan Structure"
            description="Adjust the budget, frequency, or duration of your plan. Any changes in cost will be calculated before you save."
            saveButtonText="Save Changes"
            onSaveNavigateTo={`/dashboard/plans/${planId}/overview`}
            backPath={`/dashboard/plans/${planId}/overview`}
        />
    );
};

export default EditStructurePage;