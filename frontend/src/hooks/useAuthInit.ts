import { useEffect, useState } from "react";
import {useAuthStore} from "@/store/useAuthStore.ts";
import {api} from "@/api.axio.ts";


export const useAuthInit = () => {
    const [loading, setLoading] = useState(true);
    const setAuth = useAuthStore((state) => state.setAuth);
    const clearAuth = useAuthStore((state) => state.clearAuth);

    useEffect(() => {
        const initAuth = async () => {
            try {
                // Dastur ilk bor yuklanganda cookie orqali token tiklanadi
                const { data } = await api.get("/auth/refresh");
                setAuth(data.accessToken, data.id);
            } catch (error) {
                clearAuth();
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, [setAuth, clearAuth]);

    return { loading };
};