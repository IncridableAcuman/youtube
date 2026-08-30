import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute, PublicRoute, AdminRoute } from "@/routes/GuardRoutes";
import { MainLayout } from "@/components/layout/MainLayout";
import { AdminLayout } from "@/components/layout/AdminLayout";

import HomePage from "@/pages/HomePage";
import WatchPage from "@/pages/WatchPage";
import MyVideosPage from "@/pages/MyVideosPage";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import ChannelPage from "@/pages/ChannelPage";
import SearchPage from "@/pages/SearchPage";

// Admin Sahifalari
import AdminDashboardPage from "@/pages/AdminDashboardPage"; // YANGI
import AdminUsersPage from "@/pages/AdminUsersPage";
import AdminVideosPage from "@/pages/AdminVideosPage";       // YANGI
import AdminChannelsPage from "@/pages/AdminChannelsPage";   // YANGI

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Ochiq yo'llar */}
                <Route element={<PublicRoute />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                </Route>

                {/* Himoyalangan oddiy foydalanuvchi yo'llari */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<MainLayout />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/category/:categoryName" element={<HomePage />} />
                        <Route path="/watch/:id" element={<WatchPage />} />
                        <Route path="/search" element={<SearchPage />} />
                        <Route path="/my-videos" element={<MyVideosPage />} />
                        <Route path="/channel/:channelId" element={<ChannelPage />} />
                        <Route path="/channels/:channelId" element={<ChannelPage />} />
                        <Route path="/explore" element={<HomePage />} />
                        <Route path="/subscriptions" element={<HomePage />} />
                        <Route path="/history" element={<MyVideosPage />} />
                        <Route path="/watch-later" element={<MyVideosPage />} />
                        <Route path="/liked-videos" element={<MyVideosPage />} />
                    </Route>
                </Route>

                {/* Admin Yo'llari */}
                <Route element={<AdminRoute />}>
                    <Route element={<AdminLayout />}>
                        {/* /admin ga kirganda to'g'ridan-to'g'ri dashboard'ga yo'naltirish */}
                        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

                        {/* Admin sahifalari */}
                        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                        <Route path="/admin/users" element={<AdminUsersPage />} />
                        <Route path="/admin/videos" element={<AdminVideosPage />} />
                        <Route path="/admin/channels" element={<AdminChannelsPage />} />
                    </Route>
                </Route>

                {/* Noma'lum yo'llarni bosh sahifaga yo'naltirish */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}