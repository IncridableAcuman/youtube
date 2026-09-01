import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProfile } from "@/types/auth";

interface AuthState {
    accessToken: string | null;
    userId: string | null;
    user: UserProfile | null;
    isAuthenticated: boolean;
    setAuth: (accessToken: string, userId: string, user?: UserProfile) => void;
    setUser: (user: UserProfile) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            accessToken: null,
            userId: null,
            user: null,
            isAuthenticated: false,
            setAuth: (accessToken, userId, user = undefined) => {
                localStorage.setItem("accessToken", accessToken);
                set({ accessToken, userId, user: user || null, isAuthenticated: true });
            },
            setUser: (user) => set({ user }),
            clearAuth: () => {
                localStorage.removeItem("accessToken");
                set({ accessToken: null, userId: null, user: null, isAuthenticated: false });
            },
        }),
        {
            name: "auth-storage",
        }
    )
);