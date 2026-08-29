import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute, PublicRoute } from "@/routes/GuardRoutes";
import { MainLayout } from "@/components/layout/MainLayout";
import HomePage from "@/pages/HomePage";
import WatchPage from "@/pages/WatchPage";
import MyVideosPage from "@/pages/MyVideosPage";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import ChannelPage from "@/pages/ChannelPage";
import SearchPage from "@/pages/SearchPage";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Ochiq (Autentifikatsiyadan o'tmaganlar uchun) yo'llar */}
                <Route element={<PublicRoute />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                </Route>

                {/* Himoyalangan yo'llar */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<MainLayout />}>
                        {/* Asosiy va Kategoriya sahifalari */}
                        <Route path="/" element={<HomePage />} />
                        <Route path="/category/:categoryName" element={<HomePage />} />

                        {/* Video ko'rish va Qidiruv */}
                        <Route path="/watch/:id" element={<WatchPage />} />
                        <Route path="/search" element={<SearchPage />} />
                        <Route path="/my-videos" element={<MyVideosPage />} />

                        {/* Kanal yo'nalishlari (Moslik uchun 2 xil havola ham bitta komponentga ulandi) */}
                        <Route path="/channel/:channelId" element={<ChannelPage />} />
                        <Route path="/channels/:channelId" element={<ChannelPage />} />

                        {/* Sidebar bo'limlari (Vaqtinchalik mos sahifalarga yo'naltirilgan) */}
                        <Route path="/explore" element={<HomePage />} />
                        <Route path="/subscriptions" element={<HomePage />} />
                        <Route path="/history" element={<MyVideosPage />} />
                        <Route path="/watch-later" element={<MyVideosPage />} />
                        <Route path="/liked-videos" element={<MyVideosPage />} />
                    </Route>
                </Route>

                {/* Noma'lum yo'llarni bosh sahifaga yo'naltirish */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}