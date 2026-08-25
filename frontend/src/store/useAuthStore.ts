import { create } from "zustand";

interface AuthState {
    accessToken: string | null;
    userId: string | null;
    isAuthenticated: boolean;
    setAuth: (accessToken: string, userId: string) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    accessToken: null,
    userId: null,
    isAuthenticated: false,
    setAuth: (accessToken, userId) =>
        set({ accessToken, userId, isAuthenticated: true }),
    clearAuth: () =>
        set({ accessToken: null, userId: null, isAuthenticated: false }),
}));