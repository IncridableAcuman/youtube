import React, { useEffect } from 'react';
import { Users, Video, Eye, ThumbsUp } from 'lucide-react';
import {useAdminStore} from "@/store/useAdminStore.ts";

export const AdminDashboardPage: React.FC = () => {
    const { stats, loadingStats, fetchStats } = useAdminStore();

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    if (loadingStats) return <div className="p-6 text-white">Yuklanmoqda...</div>;

    const statCards = [
        { title: 'Foydalanuvchilar', value: stats?.totalUsers, icon: Users, color: 'bg-blue-600' },
        { title: 'Videolar', value: stats?.totalVideos, icon: Video, color: 'bg-red-600' },
        { title: 'Ko‘rishlar', value: stats?.totalViews, icon: Eye, color: 'bg-green-600' },
        { title: 'Likelar', value: stats?.totalLikes, icon: ThumbsUp, color: 'bg-purple-600' },
    ];

    return (
        <div className="p-6 space-y-6 text-white">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((card, idx) => {
                    const Icon = card.icon;
                    return (
                        <div key={idx} className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl flex items-center justify-between">
                            <div>
                                <p className="text-sm text-zinc-400">{card.title}</p>
                                <h3 className="text-2xl font-bold mt-1">{card.value?.toLocaleString() || 0}</h3>
                            </div>
                            <div className={`p-3 rounded-lg ${card.color}`}>
                                <Icon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};