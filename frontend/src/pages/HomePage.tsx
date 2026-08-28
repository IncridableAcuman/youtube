import { useState, useEffect } from "react";
import { CategoryChips } from "@/components/video/CategoryChips";
import { VideoCard } from "@/components/video/VideoCard";
import type { Video, PageResponse } from "@/types/video";
import { api } from "@/api.axio";
import { UploadModal } from "@/components/video/UploadModal";
import { Plus } from "lucide-react";

export default function HomePage() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [isUploadOpen, setIsUploadOpen] = useState(false);

    const fetchVideos = () => {
        api
            .get<PageResponse<Video>>("/videos?page=0&size=12")
            .then((res) => {
                if (res.data && res.data.content) {
                    setVideos(res.data.content);
                }
            })
            .catch((err) => {
                console.error("Backenddan ma'lumot olishda xatolik:", err);
            });
    };

    useEffect(() => {
        fetchVideos();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <CategoryChips />
                <button
                    onClick={() => setIsUploadOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-lg shadow-blue-600/20 transition shrink-0"
                >
                    <Plus className="w-4 h-4" />
                    <span>Video Joylash</span>
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
                {videos.map((video) => (
                    <VideoCard key={video.id} video={video} />
                ))}
            </div>

            <UploadModal
                isOpen={isUploadOpen}
                onClose={() => setIsUploadOpen(false)}
                onSuccess={fetchVideos}
            />
        </div>
    );
}