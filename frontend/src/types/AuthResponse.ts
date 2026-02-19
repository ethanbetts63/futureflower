export interface AuthResponse {
    user: {
        id: number;
        email: string;
        first_name: string;
        last_name: string;
    };
}
