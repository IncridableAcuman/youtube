import React, { useEffect } from "react";
import { useAdminStore } from "@/store/useAdminStore";
import { Loader2, Check, X, Trash2 } from "lucide-react";

export const AdminVideosPage: React.FC = () => {
    const { videos, fetchVideos, updateVideoStatus, deleteVideo, loading } = useAdminStore();

    useEffect(() => {
        fetchVideos();
    }, [fetchVideos]);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight">Videolar Moderatsiyasi</h1>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-red-600" />
                </div>
            ) : (
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-sm text-zinc-300">
                        <thead className="bg-zinc-950 text-xs text-zinc-400 uppercase border-b border-zinc-800">
                        <tr>
                            <th className="p-4">Sarlavha</th>
                            <th className="p-4">Kanal</th>
                            <th className="p-4">Ko'rishlar</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Amallar</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                        {videos.map((video) => (
                            <tr key={video.id} className="hover:bg-zinc-800/40 transition">
                                <td className="p-4 font-semibold text-white truncate max-w-xs">{video.title}</td>
                                <td className="p-4 text-zinc-400">{video.channelName || "Noma'lum"}</td>
                                <td className="p-4 text-zinc-400">
                                    {(video.viewsCount ?? video.views ?? 0).toLocaleString()}
                                </td>
                                <td className="p-4">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                            video.status === "APPROVED" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" :
                                                video.status === "PENDING" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                                                    "bg-red-500/10 text-red-500 border border-red-500/20"
                                        }`}>
                                            {video.status || "PENDING"}
                                        </span>
                                </td>
                                <td className="p-4 text-right space-x-2">
                                    <button
                                        onClick={() => updateVideoStatus(video.id, "APPROVED")}
                                        className="p-1.5 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white rounded-lg transition"
                                        title="Tasdiqlash"
                                    >
                                        <Check className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => updateVideoStatus(video.id, "REJECTED")}
                                        className="p-1.5 bg-amber-600/20 text-amber-400 hover:bg-amber-600 hover:text-white rounded-lg transition"
                                        title="Rad etish"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => deleteVideo(video.id)}
                                        className="p-1.5 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white rounded-lg transition"
                                        title="O'chirish"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};