// futureflower/frontend/src/types/users.ts

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
