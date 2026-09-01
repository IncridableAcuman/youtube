// src/pages/admin/AdminChannelsPage.tsx
import React, { useEffect, useState } from "react";
import { useAdminStore } from "@/store/useAdminStore";
import {
    Loader2,
    Ban,
    CheckCircle,
    Search,
    Tv,
    CctvOff,
    Users,
} from "lucide-react";

export interface AdminChannel {
    id: string;
    name: string;
    handle?: string;
    description?: string;
    avatarUrl?: string;
    bannerUrl?: string;
    subscribersCount: number;
    status?: "ACTIVE" | "BANNED" | string;
    createdAt?: string;
}

export const AdminChannelsPage: React.FC = () => {
    const { channels, fetchChannels, toggleChannelStatus, loading } = useAdminStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    useEffect(() => {
        fetchChannels();
    }, [fetchChannels]);

    const handleToggleStatus = async (id: string) => {
        setUpdatingId(id);
        try {
            await toggleChannelStatus(id);
        } finally {
            setUpdatingId(null);
        }
    };

    // Qidiruv filtri
    const filteredChannels = (channels as AdminChannel[]).filter((ch) => {
        const query = searchTerm.toLowerCase();
        const nameMatches = ch.name.toLowerCase().includes(query);
        const handleMatches = ch.handle ? ch.handle.toLowerCase().includes(query) : false;
        return nameMatches || handleMatches;
    });

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header va Qidiruv Paneli */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2.5 text-zinc-900 dark:text-white">
                        <Tv className="w-6 h-6 text-red-600" />
                        Kanallar Moderatsiyasi
                    </h1>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                        Platformadagi barcha kanallarni boshqarish, holatini tekshirish va bloklash
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative flex-1 md:w-72">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Kanal nomi yoki taxallusi bo'yicha..."
                            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600 transition shadow-sm"
                        />
                    </div>
                    <div className="px-3.5 py-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/60 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 shrink-0 shadow-sm">
                        Jami: <span className="text-red-600 font-bold">{filteredChannels.length}</span> ta
                    </div>
                </div>
            </div>

            {/* Asosiy Tarkib */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 space-y-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
                    <Loader2 className="w-8 h-8 animate-spin text-red-600" />
                    <p className="text-xs font-medium text-zinc-500">Kanallar yuklanmoqda...</p>
                </div>
            ) : filteredChannels.length === 0 ? (
                /* Empty State */
                <div className="flex flex-col items-center justify-center py-20 px-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm text-center">
                    <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-950/50 border border-red-100 dark:border-red-900/40 flex items-center justify-center text-red-600 mb-4 shadow-inner">
                        <CctvOff className="w-7 h-7" />
                    </div>
                    <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-1">
                        {searchTerm ? "Qidiruv bo'yicha kanal topilmadi" : "Hozircha kanallar mavjud emas"}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm">
                        {searchTerm
                            ? "Kiritilgan so'z bo'yicha hech qanday kanal topilmadi. Qidiruv so'zini tekshiring."
                            : "Platformada foydalanuvchilar tomonidan hali kanallar yaratilmagan."}
                    </p>
                </div>
            ) : (
                /* Jadval */
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm transition">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-zinc-700 dark:text-zinc-300">
                            <thead className="bg-zinc-50 dark:bg-zinc-800/60 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800">
                                <tr>
                                    <th className="py-3.5 px-5">Kanal Nomi</th>
                                    <th className="py-3.5 px-5">Taxallus (Handle)</th>
                                    <th className="py-3.5 px-5">Obunachilar</th>
                                    <th className="py-3.5 px-5">Holat</th>
                                    <th className="py-3.5 px-5 text-right">Amallar</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                                {filteredChannels.map((channel: AdminChannel) => {
                                    const isBanned = channel.status === "BANNED";
                                    const isUpdating = updatingId === channel.id;
                                    const initial = channel.name.slice(0, 2).toUpperCase();

                                    return (
                                        <tr
                                            key={channel.id}
                                            className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition group"
                                        >
                                            {/* Kanal Nomi va Avatari */}
                                            <td className="py-4 px-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-red-600/10 dark:bg-red-500/10 border border-red-500/20 flex items-center justify-center font-bold text-xs text-red-600 dark:text-red-400 shrink-0 overflow-hidden">
                                                        {channel.avatarUrl ? (
                                                            <img
                                                                src={channel.avatarUrl}
                                                                alt={channel.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            initial
                                                        )}
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">
                                                            {channel.name}
                                                        </span>
                                                        {channel.description && (
                                                            <span className="text-[11px] text-zinc-400 line-clamp-1 max-w-xs">
                                                                {channel.description}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Taxallus */}
                                            <td className="py-4 px-5">
                                                <span className="text-zinc-600 dark:text-zinc-400 font-mono text-[11px] bg-zinc-100 dark:bg-zinc-800/60 px-2.5 py-1 rounded-md border border-zinc-200 dark:border-zinc-700/50">
                                                    {channel.handle || `@${channel.name.toLowerCase().replace(/\s+/g, "")}`}
                                                </span>
                                            </td>

                                            {/* Obunachilar Son */}
                                            <td className="py-4 px-5">
                                                <div className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300 font-medium">
                                                    <Users className="w-3.5 h-3.5 text-zinc-400" />
                                                    {channel.subscribersCount.toLocaleString()}
                                                </div>
                                            </td>

                                            {/* Holat Badge */}
                                            <td className="py-4 px-5">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                                        isBanned
                                                            ? "bg-red-500/10 text-red-500 border-red-500/20"
                                                            : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                                    }`}
                                                >
                                                    {isBanned ? "BLOKLANGAN" : "AKTIV"}
                                                </span>
                                            </td>

                                            {/* Amallar */}
                                            <td className="py-4 px-5 text-right whitespace-nowrap">
                                                <button
                                                    onClick={() => handleToggleStatus(channel.id)}
                                                    disabled={isUpdating}
                                                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition inline-flex items-center gap-1.5 shadow-sm active:scale-95 disabled:opacity-50 ${
                                                        isBanned
                                                            ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                                            : "bg-red-500/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/20"
                                                    }`}
                                                >
                                                    {isUpdating ? (
                                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                    ) : isBanned ? (
                                                        <CheckCircle className="w-3.5 h-3.5" />
                                                    ) : (
                                                        <Ban className="w-3.5 h-3.5" />
                                                    )}
                                                    {isBanned ? "Aktivlashtirish" : "Bloklash"}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};