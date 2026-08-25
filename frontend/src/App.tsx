import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuthInit } from "@/hooks/useAuthInit";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { ProtectedRoute, PublicRoute } from "@/routes/GuardRoutes";
import { MainLayout } from "@/components/layout/MainLayout";
import HomePage from "@/pages/HomePage";
import { LoadingSpinner } from "@/components/custom/LoadingSpinner";

export default function App() {
    const { loading } = useAuthInit();

    // Auth holati tekshirib bo'linguncha kutish
    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <BrowserRouter>
            <Routes>
                {/* Ochiq yo'llar (Login qilganlarga yopiq) */}
                <Route element={<PublicRoute />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                </Route>

                {/* Himoyalangan yo'llar (Faqat Login qilganlarga ochiq) */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<MainLayout />}>
                        <Route path="/" element={<HomePage />} />
                        {/* Kelajakda qo'shiladigan sahifalar: /watch/:id, /profile, /upload */}
                    </Route>
                </Route>

                {/* Noto'g'ri URL bo'lsa bosh sahifaga yo'naltirish */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}