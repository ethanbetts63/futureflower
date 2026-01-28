// foreverflower/frontend/src/pages/flow/Step5StructurePage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import StructureEditor from '@/components/StructureEditor';

const Step5StructurePage: React.FC = () => {
    const { planId } = useParams<{ planId: string }>();

    return (
        <StructureEditor
            mode="create"
            title="Define the Plan's Structure"
            description="Set the budget, frequency, and duration of your flower plan. The total cost will be calculated for you."
            saveButtonText="Next: Select Preferences"
            onSaveNavigateTo={`/book-flow/flower-plan/${planId}/preferences`}
            backPath={`/book-flow/flower-plan/${planId}/recipient`}
        />
    );
};

export default Step5StructurePage;
