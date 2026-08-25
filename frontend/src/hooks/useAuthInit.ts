import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import {api} from "@/api.axio.ts";

export const useAuthInit = () => {
    const [loading, setLoading] = useState(true);
    const setAuth = useAuthStore((state) => state.setAuth);
    const setUser = useAuthStore((state) => state.setUser);
    const clearAuth = useAuthStore((state) => state.clearAuth);

    useEffect(() => {
        const initAuth = async () => {
            try {
                // 1. Refresh token orqali yangi access token olish
                const { data: refreshData } = await api.get("/auth/refresh");
                setAuth(refreshData.accessToken, refreshData.id);

                // 2. Token olgandan so'ng foydalanuvchi profil ma'lumotlarini yuklash
                const { data: userData } = await api.get("/users/me");
                setUser(userData);
            } catch (error) {
                clearAuth();
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, [setAuth, setUser, clearAuth]);

    return { loading };
};