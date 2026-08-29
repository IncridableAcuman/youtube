import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";

export const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Refresh token Cookie bilan borishi uchun
});

// Parallel so'rovlarda bir nechta refresh so'rovini oldini olish navbati
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else if (token) {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Request Interceptor: Token mavjud va yaroqli bo'lsagina Headerga biriktirish
api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;

    if (token && token !== "undefined" && token !== "null" && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    } else if (config.headers) {
        delete config.headers.Authorization;
    }

    return config;
});

// Response Interceptor: 401 bo'lganda Tokenni xavfsiz yangilash
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Faqat 401 (Unauthorized) bo'lganda va allaqachon retry qilinmagan bo'lsa
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Dinamik API_BASE_URL orqali refresh so'rovi
                const { data } = await axios.get(`${API_BASE_URL}/auth/refresh`, {
                    withCredentials: true,
                });

                const newAccessToken = data.accessToken;

                // Store va Storage ni yangilash
                useAuthStore.getState().setAuth(newAccessToken, data.id);
                localStorage.setItem("accessToken", newAccessToken);

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                processQueue(null, newAccessToken);
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                useAuthStore.getState().clearAuth();
                localStorage.removeItem("accessToken");
                window.location.href = "/login";
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);