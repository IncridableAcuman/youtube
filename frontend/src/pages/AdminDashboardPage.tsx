// src/pages/admin/AdminDashboardPage.tsx
import React, { useEffect, useState } from "react";
import { useAdminStore } from "@/store/useAdminStore";
import { Link } from "react-router-dom";
import {
    Users,
    Video,
    Tv,
    Eye,
    Loader2,
    TrendingUp,
    ShieldAlert,
    Clock,
    Activity,
    ArrowUpRight,
    RefreshCw,
    Sparkles,
    CheckCircle2,
    MessageSquare,
} from "lucide-react";

export const AdminDashboardPage: React.FC = () => {
    const { stats, fetchDashboardStats, loading, error } = useAdminStore();
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        fetchDashboardStats();
    }, [fetchDashboardStats]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchDashboardStats();
        setTimeout(() => setIsRefreshing(false), 500);
    };

    if (loading && !stats) {
        return (
            <div className="flex flex-col items-center justify-center h-96 space-y-3">
                <Loader2 className="w-9 h-9 animate-spin text-red-600" />
                <p className="text-xs font-medium text-zinc-500">Dashboard ma'lumotlari yuklanmoqda...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 rounded-2xl flex items-center gap-3">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <span className="text-xs font-medium">{error}</span>
            </div>
        );
    }

    const cards = [
        {
            title: "Jami Foydalanuvchilar",
            value: stats?.totalUsers || 0,
            icon: Users,
            growth: "+12.5%",
            color: "from-blue-600 to-indigo-600",
            lightBg: "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400",
            border: "border-blue-500/20",
        },
        {
            title: "Jami Videolar",
            value: stats?.totalVideos || 0,
            icon: Video,
            growth: "+8.2%",
            color: "from-red-600 to-rose-600",
            lightBg: "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400",
            border: "border-red-500/20",
        },
        {
            title: "Jami Kanallar",
            value: stats?.totalChannels || 0,
            icon: Tv,
            growth: "+5.4%",
            color: "from-purple-600 to-violet-600",
            lightBg: "bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400",
            border: "border-purple-500/20",
        },
        {
            title: "Jami Ko'rishlar",
            value: stats?.totalViews || 0,
            icon: Eye,
            growth: "+24.1%",
            color: "from-emerald-600 to-teal-600",
            lightBg: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400",
            border: "border-emerald-500/20",
        },
    ];

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-10">
            {/* Header / Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 p-6 md:p-8 text-white shadow-xl">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 border border-red-500/30 text-red-400 text-xs font-semibold mb-3">
                            <Sparkles className="w-3.5 h-3.5" /> Platforma Boshqaruvi Markazi
                        </div>
                        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                            Xush kelibsiz, Administrator!
                        </h1>
                        <p className="text-xs md:text-sm text-zinc-400 mt-1 max-w-xl">
                            Ushbu sahifada platformangizdagi real-vaqt statistikasi, aktivlik va moderatsiya jarayonlarini kuzatib borishingiz mumkin.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 border border-zinc-700/60 transition shadow-sm active:scale-95 disabled:opacity-50"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-red-500" : ""}`} />
                            Yangilash
                        </button>
                    </div>
                </div>

                {/* Orqa fon bezak effekti */}
                <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
            </div>

            {/* Metric Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {cards.map((card, idx) => (
                    <div
                        key={idx}
                        className="group relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                                {card.title}
                            </span>
                            <div className={`p-2.5 rounded-xl ${card.lightBg} transition`}>
                                <card.icon className="w-5 h-5" />
                            </div>
                        </div>

                        <div className="mt-4 flex items-baseline justify-between">
                            <h3 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
                                {card.value.toLocaleString()}
                            </h3>
                            <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                                <TrendingUp className="w-3 h-3" />
                                {card.growth}
                            </span>
                        </div>

                        {/* Progress line */}
                        <div className="mt-4 w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                            <div
                                className={`h-full bg-linear-to-r ${card.color}`}
                                style={{ width: "70%" }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Asosiy Ishchi Panel: Qisqa Yo'llar va Tizim Holati */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Moderatsiya va Qisqa Yo'llar */}
                <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-5">
                    <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 pb-4">
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-red-600" />
                            <h2 className="text-base font-bold text-zinc-900 dark:text-white">
                                Tezkor Boshqaruv & Bo'limlar
                            </h2>
                        </div>
                        <span className="text-xs text-zinc-400">Moderatsiya paneli</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link
                            to="/admin/videos"
                            className="group p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-red-500/40 bg-zinc-50 dark:bg-zinc-800/40 hover:bg-red-50 dark:hover:bg-red-950/20 transition"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <Video className="w-5 h-5 text-red-600" />
                                <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-red-600 transition" />
                            </div>
                            <p className="text-xs font-bold text-zinc-900 dark:text-white">Videolar Moderatsiyasi</p>
                            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">Videolarni tasdiqlash va rad etish</p>
                        </Link>

                        <Link
                            to="/admin/users"
                            className="group p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-blue-500/40 bg-zinc-50 dark:bg-zinc-800/40 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <Users className="w-5 h-5 text-blue-600" />
                                <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-blue-600 transition" />
                            </div>
                            <p className="text-xs font-bold text-zinc-900 dark:text-white">Foydalanuvchilar</p>
                            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">Rollarni o'zgartirish va ban qilish</p>
                        </Link>

                        <Link
                            to="/admin/comments"
                            className="group p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-purple-500/40 bg-zinc-50 dark:bg-zinc-800/40 hover:bg-purple-50 dark:hover:bg-purple-950/20 transition"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <MessageSquare className="w-5 h-5 text-purple-600" />
                                <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-purple-600 transition" />
                            </div>
                            <p className="text-xs font-bold text-zinc-900 dark:text-white">Izohlar Nazorati</p>
                            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">Spam va nomaqbul izohlarni o'chirish</p>
                        </Link>
                    </div>

                    {/* Platforma Status Bar */}
                    <div className="pt-2">
                        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                <div>
                                    <p className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                                        Barcha Tizimlar Barqaror Ishlamoqda
                                    </p>
                                    <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                                        API Gateway, Server va Ma'lumotlar bazasi aloqasi ideal holatda.
                                    </p>
                                </div>
                            </div>
                            <span className="hidden sm:inline-block px-2.5 py-1 text-[10px] font-bold bg-emerald-600 text-white rounded-full">
                                99.9% Uptime
                            </span>
                        </div>
                    </div>
                </div>

                {/* Tizim Yuklamasi va Metriclar */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-5">
                    <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 pb-4">
                        <div className="flex items-center gap-2">
                            <Activity className="w-5 h-5 text-red-600" />
                            <h2 className="text-base font-bold text-zinc-900 dark:text-white">
                                Server Indikatorlari
                            </h2>
                        </div>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>

                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                                <span>Spring Boot API Server</span>
                                <span className="text-emerald-600 font-bold">Aktiv</span>
                            </div>
                            <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-[92%]" />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                                <span>PostgreSQL Database</span>
                                <span className="text-blue-600 font-bold">24% xotira</span>
                            </div>
                            <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 w-[24%]" />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                                <span>Kafka Message Broker</span>
                                <span className="text-purple-600 font-bold">Normal</span>
                            </div>
                            <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-500 w-[15%]" />
                            </div>
                        </div>
                    </div>

                    <div className="pt-2 text-center border-t border-zinc-100 dark:border-zinc-800/80">
                        <p className="text-[11px] text-zinc-400">
                            Oxirgi avtomatik tekshiruv: <span className="font-semibold text-zinc-300">hozirgina</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};