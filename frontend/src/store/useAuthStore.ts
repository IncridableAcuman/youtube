import { create } from "zustand";

export interface UserProfile {
    id: string;
    fullName?: string;
    username?: string;
    email?: string;
    avatar?: string;
}

interface AuthState {
    accessToken: string | null;
    userId: string | null;
    user: UserProfile | null;
    isAuthenticated: boolean;
    setAuth: (accessToken: string, userId: string, user?: UserProfile) => void;
    setUser: (user: UserProfile) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    accessToken: null,
    userId: null,
    user: null,
    isAuthenticated: false,
    setAuth: (accessToken, userId, user = undefined) =>
        set({ accessToken, userId, user: user || null, isAuthenticated: true }),
    setUser: (user) => set({ user }),
    clearAuth: () =>
        set({ accessToken: null, userId: null, user: null, isAuthenticated: false }),
}));