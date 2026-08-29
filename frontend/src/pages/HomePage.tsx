import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { VideoCard } from "@/components/video/VideoCard";
import type { Video, PageResponse } from "@/types/video";
import { api } from "@/api.axio";
import { UploadModal } from "@/components/video/UploadModal";
import { CreateChannelModal } from "@/components/channel/CreateChannelModal";
import { useChannelStore } from "@/store/useChannelStore";
import { Plus, Loader2, VideoOff } from "lucide-react";
import {CategoryChips} from "@/components/video/CategoryChips.tsx";

export default function HomePage() {
    const { categoryName } = useParams<{ categoryName?: string }>();
    const navigate = useNavigate();

    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [isCreateChannelOpen, setIsCreateChannelOpen] = useState(false);

    const { myChannel, fetchMyChannel } = useChannelStore();

    // URL parametriga qarab tanlangan kategoriyani aniqlash
    const selectedCategory = categoryName ? decodeURIComponent(categoryName) : "Barchasi";

    const fetchVideos = (category: string) => {
        setLoading(true);
        const catParam = category === "Barchasi" ? "" : `&category=${encodeURIComponent(category)}`;

        api.get<PageResponse<Video>>(`/videos?page=0&size=20${catParam}`)
            .then((res) => {
                if (res.data?.content) {
                    setVideos(res.data.content);
                } else {
                    setVideos([]);
                }
            })
            .catch((err) => {
                console.error("Videolarni yuklashda xatolik:", err);
                setVideos([]);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchVideos(selectedCategory);
    }, [selectedCategory]);

    useEffect(() => {
        fetchMyChannel();
    }, [fetchMyChannel]);

    const handleCategorySelect = (category: string) => {
        if (category === "Barchasi") {
            navigate("/");
        } else {
            navigate(`/category/${encodeURIComponent(category)}`);
        }
    };

    const handleUploadClick = () => {
        if (!myChannel) {
            setIsCreateChannelOpen(true);
        } else {
            setIsUploadOpen(true);
        }
    };

    return (
        <div className="space-y-6">
            {/* Chips va Yuklash tugmasi */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <CategoryChips
                        selectedCategory={selectedCategory}
                        onSelectCategory={handleCategorySelect}
                    />
                </div>
                <button
                    onClick={handleUploadClick}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-lg shadow-blue-600/20 transition shrink-0"
                >
                    <Plus className="w-4 h-4" />
                    <span>Video Joylash</span>
                </button>
            </div>

            {/* Kontent: Loader / Empty State / Grid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 text-zinc-500 gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-red-600" />
                    <span className="text-xs font-medium">Videolar yuklanmoqda...</span>
                </div>
            ) : videos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-zinc-500 gap-3 border border-dashed border-zinc-800/80 rounded-2xl bg-zinc-900/30">
                    <VideoOff className="w-10 h-10 text-zinc-600" />
                    <p className="text-sm font-medium text-zinc-400">
                        "{selectedCategory}" kategoriyasi bo'yicha videolar topilmadi.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
                    {videos.map((video) => (
                        <VideoCard key={video.id} video={video} />
                    ))}
                </div>
            )}

            {/* Modallar */}
            <UploadModal
                isOpen={isUploadOpen}
                onClose={() => setIsUploadOpen(false)}
                onSuccess={() => fetchVideos(selectedCategory)}
            />

            <CreateChannelModal
                isOpen={isCreateChannelOpen}
                onClose={() => setIsCreateChannelOpen(false)}
            />
        </div>
    );
}