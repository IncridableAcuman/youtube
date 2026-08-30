import { useEffect } from "react";
import { useVideoStore } from "@/store/useVideoStore";

export default function AdminVideosPage() {
    const { videos, loading, fetchVideos, deleteVideo } = useVideoStore();

    useEffect(() => {
        fetchVideos(0, 10);
    }, [fetchVideos]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Videolar Boshqaruvi</h1>
                <p className="text-xs text-zinc-500 mt-1">Platformadagi barcha videolar monitoringi va moderatsiyasi</p>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
                {loading ? (
                    <div className="p-12 text-center text-zinc-500 text-sm">Videolar yuklanmoqda...</div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-zinc-50 dark:bg-zinc-800/50 text-[11px] uppercase font-bold text-zinc-400 border-b dark:border-zinc-800">
                            <th className="p-4">Video</th>
                            <th className="p-4">Ko'rishlar</th>
                            <th className="p-4">Likelar</th>
                            <th className="p-4 text-right">Amallar</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-sm">
                        {videos.length ? (
                            videos.map((video) => (
                                <tr key={video.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                                    <td className="p-4 flex items-center gap-3">
                                        <img
                                            src={video.thumbnailUrl || "/placeholder-thumb.jpg"}
                                            alt={video.title}
                                            className="w-20 h-12 object-cover rounded-lg bg-zinc-200 dark:bg-zinc-800"
                                        />
                                        <div>
                                            <p className="font-semibold text-sm line-clamp-1">{video.title}</p>
                                            <p className="text-xs text-zinc-400">ID: {video.id}</p>
                                        </div>
                                    </td>
                                    <td className="p-4 text-zinc-500">{video.views?.toLocaleString() || 0}</td>
                                    <td className="p-4 text-zinc-500">{video.likes?.toLocaleString() || 0}</td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => {
                                                if (confirm("Ushbu videoni platformadan o'chirmoqchimisiz?")) {
                                                    deleteVideo(video.id);
                                                }
                                            }}
                                            className="px-3 py-1.5 bg-red-600/10 hover:bg-red-600 hover:text-white text-red-600 rounded-lg text-xs font-semibold transition"
                                        >
                                            O'chirish
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-zinc-400 text-sm">
                                    Videolar topilmadi
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}