import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute, PublicRoute, AdminRoute } from "@/routes/GuardRoutes";
import { MainLayout } from "@/components/layout/MainLayout";
import HomePage from "@/pages/HomePage";
import WatchPage from "@/pages/WatchPage";
import MyVideosPage from "@/pages/MyVideosPage";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import ChannelPage from "@/pages/ChannelPage";
import SearchPage from "@/pages/SearchPage";
import {AdminDashboardPage} from "@/pages/AdminDashboardPage.tsx";

// Admin Sahifalari

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Ochiq (Autentifikatsiyadan o'tmaganlar uchun) yo'llar */}
                <Route element={<PublicRoute />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                </Route>

                {/* Himoyalangan oddiy foydalanuvchi yo'llari */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<MainLayout />}>
                        {/* Asosiy va Kategoriya sahifalari */}
                        <Route path="/" element={<HomePage />} />
                        <Route path="/category/:categoryName" element={<HomePage />} />

                        {/* Video ko'rish va Qidiruv */}
                        <Route path="/watch/:id" element={<WatchPage />} />
                        <Route path="/search" element={<SearchPage />} />
                        <Route path="/my-videos" element={<MyVideosPage />} />

                        {/* Kanal yo'nalishlari */}
                        <Route path="/channel/:channelId" element={<ChannelPage />} />
                        <Route path="/channels/:channelId" element={<ChannelPage />} />

                        {/* Sidebar bo'limlari */}
                        <Route path="/explore" element={<HomePage />} />
                        <Route path="/subscriptions" element={<HomePage />} />
                        <Route path="/history" element={<MyVideosPage />} />
                        <Route path="/watch-later" element={<MyVideosPage />} />
                        <Route path="/liked-videos" element={<MyVideosPage />} />
                    </Route>
                </Route>

                {/* Faqat ADMIN uchun himoyalangan yo'llar */}
                <Route element={<AdminRoute />}>
                    <Route element={<MainLayout />}>
                        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                        <Route path="/admin/users" element={<AdminUsersPage />} />
                    </Route>
                </Route>

                {/* Noma'lum yo'llarni bosh sahifaga yo'naltirish */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}