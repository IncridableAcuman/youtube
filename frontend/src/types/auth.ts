export interface AuthResponse {
    accessToken: string;
    id: string;
}

export interface UserProfile {
    id: string;
    fullName?: string;
    username?: string;
    email?: string;
    avatar?: string;
    role: string;
}