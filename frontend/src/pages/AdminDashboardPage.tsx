import { useEffect } from "react";
import { useAdminStore } from "@/store/useAdminStore";

export default function AdminDashboardPage() {
    const { stats, loadingStats, fetchStats } = useAdminStore();

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    if (loadingStats) {
        return (
            <div className="flex justify-center items-center h-64 text-zinc-500 font-medium">
                Statistika yuklanmoqda...
            </div>
        );
    }

    const kpiCards = [
        { title: "Foydalanuvchilar", value: stats?.totalUsers ?? 0, icon: "👥", color: "from-blue-600 to-indigo-600" },
        { title: "Yuklangan Videolar", value: stats?.totalVideos ?? 0, icon: "🎬", color: "from-red-600 to-rose-600" },
        { title: "Jami Ko'rishlar", value: stats?.totalViews ?? 0, icon: "👁️", color: "from-emerald-600 to-teal-600" },
        { title: "Jami Likelar", value: stats?.totalLikes ?? 0, icon: "❤️", color: "from-amber-500 to-orange-600" },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Tizim Boshqaruv Paneli</h1>
                <p className="text-xs text-zinc-500 mt-1">Platformadagi umumiy ko'rsatkichlar va dinamika</p>
            </div>

            {/* KPI Cardlar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {kpiCards.map((card, idx) => (
                    <div key={idx} className="relative overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-3xl">{card.icon}</span>
                            <div className={`w-2 h-8 rounded-full bg-gradient-to-b ${card.color}`} />
                        </div>
                        <p className="text-xs font-semibold text-zinc-500 mt-4">{card.title}</p>
                        <h3 className="text-2xl font-black mt-1">{(card.value || 0).toLocaleString()}</h3>
                    </div>
                ))}
            </div>

            {/* Ro'yxatdan o'tishlar va Videolar statistikasi */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Foydalanuvchilar o'sishi */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl">
                    <h3 className="text-sm font-bold mb-6">Foydalanuvchilar Ro'yxatdan O'tish Dinamikasi</h3>
                    <div className="h-44 flex items-end gap-2 pt-4 px-2 border-b border-zinc-200 dark:border-zinc-800">
                        {stats?.userRegistrations?.length ? (
                            stats.userRegistrations.map((item, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                                    <div className="absolute -top-6 hidden group-hover:block bg-zinc-800 text-white text-[10px] px-2 py-0.5 rounded shadow">
                                        {item.count}
                                    </div>
                                    <div
                                        className="w-full bg-indigo-600/80 hover:bg-indigo-600 rounded-t transition-all"
                                        style={{ height: `${Math.min(100, (item.count / 20) * 100)}%` }}
                                    />
                                    <span className="text-[10px] text-zinc-400 truncate w-full text-center">{item.date}</span>
                                </div>
                            ))
                        ) : (
                            <div className="w-full text-center text-xs text-zinc-400 py-12">Ma'lumot mavjud emas</div>
                        )}
                    </div>
                </div>

                {/* Video yuklashlar */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl">
                    <h3 className="text-sm font-bold mb-6">Videolar Yuklanish Dinamikasi</h3>
                    <div className="h-44 flex items-end gap-2 pt-4 px-2 border-b border-zinc-200 dark:border-zinc-800">
                        {stats?.videoUploads?.length ? (
                            stats.videoUploads.map((item, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                                    <div className="absolute -top-6 hidden group-hover:block bg-zinc-800 text-white text-[10px] px-2 py-0.5 rounded shadow">
                                        {item.count}
                                    </div>
                                    <div
                                        className="w-full bg-red-600/80 hover:bg-red-600 rounded-t transition-all"
                                        style={{ height: `${Math.min(100, (item.count / 20) * 100)}%` }}
                                    />
                                    <span className="text-[10px] text-zinc-400 truncate w-full text-center">{item.date}</span>
                                </div>
                            ))
                        ) : (
                            <div className="w-full text-center text-xs text-zinc-400 py-12">Ma'lumot mavjud emas</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}