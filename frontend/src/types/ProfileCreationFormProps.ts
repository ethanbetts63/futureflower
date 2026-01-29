import type { ProfileCreationData } from './ProfileCreationData';

export interface ProfileCreationFormProps {
    initialData: Partial<ProfileCreationData>;
    onSubmit: (data: ProfileCreationData) => void;
}
