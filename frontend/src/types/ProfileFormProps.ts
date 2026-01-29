import type { UserProfile } from './UserProfile';

export interface ProfileFormProps {
    profile: UserProfile;
    onProfileUpdate: (updatedProfile: UserProfile) => void;
    isEditing: boolean;
}
