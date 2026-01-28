// foreverflower/frontend/src/types/auth.ts

/**
 * Defines the structure of the authentication response from the API.
 */
export interface AuthResponse {
    refresh: string;
    access: string;
    user: {
        id: number;
        email: string;
        first_name: string;
        last_name: string;
    };
}