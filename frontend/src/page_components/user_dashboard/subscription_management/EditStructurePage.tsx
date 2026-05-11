// futureflower/frontend/src/pages/user_dashboard/subscription_management/EditStructurePage.tsx
import { useParams } from 'react-router-dom';
import SubscriptionStructureEditor from '@/components/form_flow/SubscriptionStructureEditor';

const EditStructurePage = () => {
    const { planId } = useParams<{ planId: string }>();

    return (
        <SubscriptionStructureEditor
            mode="edit"
            saveButtonText="Save Changes"
            onSaveNavigateTo={`/dashboard/subscription-plans/${planId}/overview`}
            backPath={`/dashboard/subscription-plans/${planId}/overview`}
        />
    );
};

export default EditStructurePage;
