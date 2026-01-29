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