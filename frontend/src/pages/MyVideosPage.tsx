import { useEffect, useState } from "react";
import { useVideoStore } from "@/store/useVideoStore";
import { VideoModal } from "@/components/video/VideoModal";
import type { Video } from "@/types/video";
import { Plus, Edit2, Trash2, Eye, ThumbsUp, Film, Loader2 } from "lucide-react";

export default function MyVideosPage() {
    const { myVideos, fetchMyVideos, deleteVideo, loading } = useVideoStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

    useEffect(() => {
        fetchMyVideos();
    }, []);

    const handleEdit = (video: Video) => {
        setSelectedVideo(video);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setSelectedVideo(null);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Haqiqatan ham ushbu videoni o'chirmoqchimisiz?")) {
            await deleteVideo(id);
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto px-4 py-2 text-zinc-100">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-800">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                        <Film className="w-6 h-6 text-red-600" />
                        Kanal Videolari
                    </h1>
                    <p className="text-xs text-zinc-400 mt-1">
                        Siz yuklagan va boshqarayotgan barcha videolar ro'yxati
                    </p>
                </div>

                <button
                    onClick={handleCreate}
                    className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-red-600/20 active:scale-95 transition"
                >
                    <Plus className="w-4 h-4" />
                    Yangi Video Yuklash
                </button>
            </div>

            {/* Content State */}
            {loading && myVideos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-zinc-500 gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-red-600" />
                    <span className="text-sm">Videolar yuklanmoqda...</span>
                </div>
            ) : myVideos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/40 text-center">
                    <div className="w-12 h-12 rounded-full bg-zinc-800/80 flex items-center justify-center text-zinc-400 mb-3">
                        <Film className="w-6 h-6" />
                    </div>
                    <p className="text-base font-medium text-zinc-300">Sizda hali videolar mavjud emas</p>
                    <p className="text-xs text-zinc-500 mt-1 max-w-xs">
                        Birinchi videongizni yuklab kanalingizni rivojlantirishni boshlang.
                    </p>
                    <button
                        onClick={handleCreate}
                        className="mt-4 flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 py-2 rounded-lg text-xs font-medium transition"
                    >
                        <Plus className="w-4 h-4 text-red-500" />
                        Video qo'shish
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {myVideos.map((video) => (
                        <div
                            key={video.id}
                            className="group bg-zinc-900/90 border border-zinc-800/80 hover:border-zinc-700/80 rounded-2xl overflow-hidden flex flex-col justify-between transition duration-200 shadow-md hover:shadow-xl"
                        >
                            <div className="space-y-3">
                                {/* Video Thumbnail */}
                                <div className="aspect-video bg-zinc-950 relative overflow-hidden">
                                    <img
                                        src={`https://img.youtube.com/vi/${video.youtubeKey}/mqdefault.jpg`}
                                        alt={video.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                    />
                                    {video.duration && (
                                        <span className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm text-zinc-200 text-[11px] font-medium px-2 py-0.5 rounded-md">
                                            {video.duration}
                                        </span>
                                    )}
                                </div>

                                {/* Video Title */}
                                <div className="px-4">
                                    <h3 className="font-semibold text-sm text-zinc-100 line-clamp-2 leading-snug group-hover:text-red-400 transition">
                                        {video.title}
                                    </h3>
                                </div>
                            </div>

                            {/* Video Card Footer (Stats & Actions) */}
                            <div className="p-4 pt-3 mt-3 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-400">
                                <div className="flex items-center gap-3">
                                    <span className="flex items-center gap-1 hover:text-zinc-200 transition">
                                        <Eye className="w-3.5 h-3.5 text-zinc-500" />
                                        {video.views || 0}
                                    </span>
                                    <span className="flex items-center gap-1 hover:text-zinc-200 transition">
                                        <ThumbsUp className="w-3.5 h-3.5 text-zinc-500" />
                                        {video.likes || 0}
                                    </span>
                                </div>

                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => handleEdit(video)}
                                        className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-blue-400 transition"
                                        title="Tahrirlash"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(video.id)}
                                        className="p-1.5 hover:bg-red-500/10 rounded-lg text-zinc-400 hover:text-red-500 transition"
                                        title="O'chirish"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <VideoModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                videoToEdit={selectedVideo}
            />
        </div>
    );
}