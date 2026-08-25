import { Navigate, Outlet, useLocation } from "react-router-dom";
import {useAuthStore} from "@/store/useAuthStore.ts";

// Faqat autentifikatsiyadan o'tgan foydalanuvchilar uchun
export const ProtectedRoute = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const location = useLocation();

    if (!isAuthenticated) {
        // Kirishdan avvalgi turgan sahifasini saqlab qoladi
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
};

// Faqat tizimga kirmagan mehmonlar uchun (Login/Register)
export const PublicRoute = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};