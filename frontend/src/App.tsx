import {useAuthInit} from "@/hooks/useAuthInit.ts";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {LoginPage} from "@/pages/LoginPage.tsx";
import {RegisterPage} from "@/pages/RegisterPage.tsx";
import {ProtectedRoute, PublicRoute} from "@/routes/GuardRoutes.tsx";
import HomePage from "./pages/HomePage";
import {LoadingSpinner} from "@/components/custom/LoadingSpinner.tsx";

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
                    <Route path="/" element={<HomePage />} />
                    {/* Kelajakda qo'shiladigan sahifalar: /watch, /profile, /upload */}
                </Route>

                {/* Noto'g'ri URL bo'lsa bosh sahifaga yo'naltirish */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}