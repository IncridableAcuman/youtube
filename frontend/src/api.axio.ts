import axios from "axios";
import {useAuthStore} from "@/store/useAuthStore.ts";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
    withCredentials: true, // Refresh token Cookie bilan borishi uchun shart
});

// Request Interceptor: Access Tokendi Headerga biriktirish
api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response Interceptor: 401 bo'lganda Tokenni avto-yangilash
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const { data } = await axios.get("http://localhost:8080/auth/refresh", {
                    withCredentials: true,
                });
                useAuthStore.getState().setAuth(data.accessToken, data.id);
                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                useAuthStore.getState().clearAuth();
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);