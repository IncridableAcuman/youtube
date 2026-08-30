import React, { useEffect } from "react";
import { useAdminStore } from "@/store/useAdminStore";
import { Users, Video, Tv, Eye, Loader2 } from "lucide-react";

export const AdminDashboardPage: React.FC = () => {
    const { stats, fetchDashboardStats, loading, error } = useAdminStore();

    useEffect(() => {
        fetchDashboardStats();
    }, [fetchDashboardStats]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-red-600" />
            </div>
        );
    }

    if (error) {
        return <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">{error}</div>;
    }

    const cards = [
        { title: "Jami Foydalanuvchilar", value: stats?.totalUsers || 0, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
        { title: "Jami Videolar", value: stats?.totalVideos || 0, icon: Video, color: "text-red-500", bg: "bg-red-500/10" },
        { title: "Jami Kanallar", value: stats?.totalChannels || 0, icon: Tv, color: "text-purple-500", bg: "bg-purple-500/10" },
        { title: "Jami Ko'rishlar", value: stats?.totalViews || 0, icon: Eye, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight">Boshqaruv Paneli (Dashboard)</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {cards.map((card, idx) => (
                    <div key={idx} className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${card.bg} ${card.color}`}>
                            <card.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-zinc-400">{card.title}</p>
                            <h3 className="text-xl font-bold text-white mt-1">{card.value.toLocaleString()}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};