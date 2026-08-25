export interface AuthResponse {
    accessToken: string;
    id: string;
}

export interface User {
    id: string;
    fullName?: string;
    username?: string;
    email?: string;
}