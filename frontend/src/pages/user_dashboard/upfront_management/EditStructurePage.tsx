// futureflower/frontend/src/pages/user_dashboard/EditStructurePage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import UpfrontStructureEditor from '@/components/form_flow/UpfrontStructureEditor';

const EditStructurePage: React.FC = () => {
    const { planId } = useParams<{ planId: string }>();

    return (
        <UpfrontStructureEditor
            mode="edit"
            saveButtonText="Save Changes"
            onSaveNavigateTo={`/dashboard/plans/${planId}/overview`}
            backPath={`/dashboard/plans/${planId}/overview`}
        />
    );
};

export default EditStructurePage;