// futureflower/frontend/src/pages/flow/Step5StructurePage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import UpfrontStructureEditor from '@/components/UpfrontStructureEditor';

const Step5StructurePage: React.FC = () => {
    const { planId } = useParams<{ planId: string }>();

    return (
        <UpfrontStructureEditor
            mode="create"
            title="Define the Plan's Structure"
            description="Set the budget, frequency, and duration of your flower plan. The total cost will be calculated for you."
            saveButtonText="Next: Confirmation"
            onSaveNavigateTo={`/upfront-flow/upfront-plan/${planId}/confirmation`}
            backPath={`/upfront-flow/upfront-plan/${planId}/add-message`}
        />
    );
};

export default Step5StructurePage;
