import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "@/api.axio";
import { VideoCard } from "@/components/video/VideoCard";
import type { Video } from "@/types/video";
import { Loader2, SearchX } from "lucide-react";

export default function SearchPage() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") || "";

    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!query.trim()) return;

        setLoading(true);
        api.get(`/videos/search?query=${encodeURIComponent(query)}&page=0&size=20`)
            .then((res) => {
                // Spring Data Page obyektidan content olinadi
                setVideos(res.data.content || []);
            })
            .catch((err) => {
                console.error("Qidiruvda xatolik:", err);
            })
            .finally(() => setLoading(false));
    }, [query]);

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <h1 className="text-xl font-bold text-zinc-100">
                Qidiruv natijalari: <span className="text-red-500">"{query}"</span>
            </h1>

            {loading ? (
                <div className="flex items-center justify-center min-h-[300px]">
                    <Loader2 className="w-8 h-8 animate-spin text-red-600" />
                </div>
            ) : videos.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[300px] text-zinc-500 space-y-3">
                    <SearchX className="w-12 h-12 stroke-[1.5]" />
                    <p className="text-base font-medium">Hech qanday video topilmadi</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    {videos.map((video) => (
                        <VideoCard key={video.id} video={video} />
                    ))}
                </div>
            )}
        </div>
    );
}