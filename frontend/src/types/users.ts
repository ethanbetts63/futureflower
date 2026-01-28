// foreverflower/frontend/src/types/users.ts

/**
 * Defines the structure for a user's profile.
 */
export interface UserProfile {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    is_staff?: boolean;
    is_superuser?: boolean;
}

// ProfileCreationData is an external type and its definition needs to be verified.
// If it's eventually found in a separate file, it should be moved here.
// For now, it's assumed to be imported from "@/forms/ProfileCreationForm".
// export interface ProfileCreationData { ... }
