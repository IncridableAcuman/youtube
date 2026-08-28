import { useEffect, useState } from "react";
import { useVideoStore } from "@/store/useVideoStore";
import { VideoModal } from "@/components/video/VideoModal";
import type { Video } from "@/types/video";
import { Plus, Edit2, Trash2, Eye, ThumbsUp } from "lucide-react";

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
        <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex items-center justify-between border-b pb-4">
                <div>
                    <h1 className="text-2xl font-bold">Kanal Videolari</h1>
                    <p className="text-sm text-gray-500">Siz yuklagan barcha videolar ro'yxati</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                >
                    <Plus className="w-4 h-4" />
                    Yangi Video
                </button>
            </div>

            {loading && myVideos.length === 0 ? (
                <div className="text-center py-8">Yuklanmoqda...</div>
            ) : myVideos.length === 0 ? (
                <div className="text-center py-12 text-gray-500">Sizda hali videolar mavjud emas.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {myVideos.map((video) => (
                        <div
                            key={video.id}
                            className="border dark:border-gray-800 rounded-xl p-4 flex flex-col justify-between bg-white dark:bg-gray-900 shadow-sm"
                        >
                            <div className="space-y-2">
                                <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
                                    <img
                                        src={`https://img.youtube.com/vi/${video.youtubeKey}/mqdefault.jpg`}
                                        alt={video.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded">
                    {video.duration}
                  </span>
                                </div>
                                <h3 className="font-semibold line-clamp-2 text-sm">{video.title}</h3>
                            </div>

                            <div className="pt-4 flex items-center justify-between border-t dark:border-gray-800 mt-4 text-xs text-gray-500">
                                <div className="flex gap-3">
                                    <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {video.views}</span>
                                    <span className="flex items-center gap-1"><ThumbsUp className="w-3.5 h-3.5" /> {video.likes}</span>
                                </div>

                                <div className="flex gap-1">
                                    <button
                                        onClick={() => handleEdit(video)}
                                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-blue-600"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(video.id)}
                                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-red-600"
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