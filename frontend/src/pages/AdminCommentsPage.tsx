// src/pages/admin/AdminCommentsPage.tsx
import React, { useEffect, useState } from "react";
import { useAdminStore } from "@/store/useAdminStore";
import {
    Loader2,
    Trash2,
    Search,
    MessageSquare,
    MessageSquareOff,
    Video,
    Calendar,
} from "lucide-react";

interface AdminComment {
    id: string;
    text?: string;
    content?: string;
    authorName?: string;
    videoTitle?: string;
    videoId?: string;
    createdAt?: string;
    user?: {
        name?: string;
        username?: string;
        avatarUrl?: string;
    };
}

export const AdminCommentsPage: React.FC = () => {
    const { comments, fetchComments, deleteComment, loading } = useAdminStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handleDelete = async (id: string) => {
        if (confirm("Ushbu izohni o'chirishga ishonchingiz komilmi?")) {
            setDeletingId(id);
            await deleteComment(id);
            setDeletingId(null);
        }
    };

    // Qidiruv bo'yicha filtr
    const filteredComments = (comments as AdminComment[]).filter((c) => {
        const text = c.text || c.content || "";
        const author = c.authorName || c.user?.name || c.user?.username || "";
        const video = c.videoTitle || "";
        const query = searchTerm.toLowerCase();

        return (
            text.toLowerCase().includes(query) ||
            author.toLowerCase().includes(query) ||
            video.toLowerCase().includes(query)
        );
    });

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header va Qidiruv Paneli */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2.5 text-zinc-900 dark:text-white">
                        <MessageSquare className="w-6 h-6 text-red-600" />
                        Izohlar Moderatsiyasi
                    </h1>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                        Platformadagi barcha foydalanuvchilar izohlarini boshqarish va nazorat qilish
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative flex-1 md:w-72">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Izoh, muallif yoki videoni aralash qidirish..."
                            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600 transition shadow-sm"
                        />
                    </div>
                    <div className="px-3.5 py-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/60 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 shrink-0 shadow-sm">
                        Jami: <span className="text-red-600 font-bold">{filteredComments.length}</span> ta
                    </div>
                </div>
            </div>

            {/* Asosiy Tarkib */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 space-y-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
                    <Loader2 className="w-8 h-8 animate-spin text-red-600" />
                    <p className="text-xs font-medium text-zinc-500">Izohlar yuklanmoqda...</p>
                </div>
            ) : filteredComments.length === 0 ? (
                /* Empty State - Izoh mavjud bo'lmaganda */
                <div className="flex flex-col items-center justify-center py-20 px-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm text-center">
                    <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-950/50 border border-red-100 dark:border-red-900/40 flex items-center justify-center text-red-600 mb-4 shadow-inner">
                        <MessageSquareOff className="w-7 h-7" />
                    </div>
                    <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-1">
                        {searchTerm ? "Qidiruv bo'yicha izoh topilmadi" : "Hozircha izohlar yo'q"}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm">
                        {searchTerm
                            ? "Kiritilgan kalit so'zga mos keladigan izohlar topilmadi. Qidiruv so'zini o'zgartirib ko'ring."
                            : "Platformada foydalanuvchilar tomonidan hali hech qanday izoh qoldirilmagan."}
                    </p>
                </div>
            ) : (
                /* Jadval */
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm transition">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-zinc-700 dark:text-zinc-300">
                            <thead className="bg-zinc-50 dark:bg-zinc-800/60 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800">
                                <tr>
                                    <th className="py-3.5 px-5">Muallif</th>
                                    <th className="py-3.5 px-5">Izoh Matni</th>
                                    <th className="py-3.5 px-5">Video</th>
                                    <th className="py-3.5 px-5">Sana</th>
                                    <th className="py-3.5 px-5 text-right">Amallar</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                                {filteredComments.map((comment: AdminComment) => {
                                    const authorName = comment.authorName || comment.user?.name || comment.user?.username || "Foydalanuvchi";
                                    const text = comment.text || comment.content || "";
                                    const videoTitle = comment.videoTitle || (comment.videoId ? "Video ID: " + comment.videoId : "Noma'lum video");
                                    const initial = authorName.slice(0, 1).toUpperCase();
                                    const isDeleting = deletingId === comment.id;

                                    return (
                                        <tr
                                            key={comment.id}
                                            className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition group"
                                        >
                                            {/* Muallif */}
                                            <td className="py-4 px-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-red-600/10 dark:bg-red-500/10 border border-red-500/20 flex items-center justify-center font-bold text-xs text-red-600 dark:text-red-400 shrink-0">
                                                        {comment.user?.avatarUrl ? (
                                                            <img
                                                                src={comment.user.avatarUrl}
                                                                alt={authorName}
                                                                className="w-full h-full rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            initial
                                                        )}
                                                    </div>
                                                    <span className="font-semibold text-zinc-900 dark:text-zinc-100 max-w-32.5 truncate">
                                                        {authorName}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Izoh Matni */}
                                            <td className="py-4 px-5 max-w-xs md:max-w-md">
                                                <p className="text-zinc-800 dark:text-zinc-200 leading-relaxed font-normal line-clamp-2">
                                                    {text}
                                                </p>
                                            </td>

                                            {/* Video Nomi */}
                                            <td className="py-4 px-5 max-w-xs">
                                                <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/80 px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700/50 w-fit max-w-full">
                                                    <Video className="w-3.5 h-3.5 text-red-500 shrink-0" />
                                                    <span className="truncate text-[11px] font-medium">
                                                        {videoTitle}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Sana */}
                                            <td className="py-4 px-5 text-zinc-400 whitespace-nowrap text-[11px]">
                                                {comment.createdAt ? (
                                                    <span className="flex items-center gap-1.5">
                                                        <Calendar className="w-3 h-3 text-zinc-400" />
                                                        {new Date(comment.createdAt).toLocaleDateString("uz-UZ", {
                                                            day: "numeric",
                                                            month: "short",
                                                        })}
                                                    </span>
                                                ) : (
                                                    "---"
                                                )}
                                            </td>

                                            {/* Amallar */}
                                            <td className="py-4 px-5 text-right whitespace-nowrap">
                                                <button
                                                    onClick={() => handleDelete(comment.id)}
                                                    disabled={isDeleting}
                                                    className="p-2 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 bg-zinc-100 dark:bg-zinc-800 hover:bg-red-50 dark:hover:bg-red-950/40 border border-zinc-200 dark:border-zinc-700/60 hover:border-red-200 dark:hover:border-red-900/50 rounded-xl transition active:scale-95 disabled:opacity-50"
                                                    title="Izohni o'chirish"
                                                >
                                                    {isDeleting ? (
                                                        <Loader2 className="w-4 h-4 animate-spin text-red-600" />
                                                    ) : (
                                                        <Trash2 className="w-4 h-4" />
                                                    )}
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