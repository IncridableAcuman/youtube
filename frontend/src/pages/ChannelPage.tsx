import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { api } from "@/api.axio";
import type { Channel } from "@/types/channel";
import type { Video } from "@/types/video";
import { VideoCard } from "@/components/video/VideoCard";
import { Loader2, BellCheck, Bell } from "lucide-react";

export default function ChannelPage() {
    const { channelId } = useParams<{ channelId: string }>();

    const [channel, setChannel] = useState<Channel | null>(null);
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const [subscribing, setSubscribing] = useState(false);

    // Kanal ma'lumotlari va videolarni yuklash
    useEffect(() => {
        if (!channelId) return;

        setLoading(true);
        Promise.all([
            api.get<Channel>(`/channels/${channelId}`),
            api.get<Video[]>(`/channels/${channelId}/videos`),
        ])
            .then(([channelRes, videosRes]) => {
                setChannel(channelRes.data);
                setVideos(videosRes.data || []);
            })
            .catch((err) => console.error("Kanal ma'lumotlarini olishda xatolik:", err))
            .finally(() => setLoading(false));
    }, [channelId]);

    // Obunani yoqish/o'chirish
    const handleToggleSubscribe = async () => {
        if (!channel || subscribing) return;

        setSubscribing(true);
        try {
            const res = await api.post<{ subscribed: boolean; message: string }>(
                `/channels/${channel.id}/subscribe`
            );

            setChannel((prev) => {
                if (!prev) return null;
                const isSubscribed = res.data.subscribed;
                return {
                    ...prev,
                    isSubscribed,
                    subscribersCount: isSubscribed
                        ? prev.subscribersCount + 1
                        : Math.max(0, prev.subscribersCount - 1),
                };
            });
        } catch (err) {
            console.error("Obuna xatoligi:", err);
        } finally {
            setSubscribing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-red-600" />
            </div>
        );
    }

    if (!channel) {
        return <div className="text-center py-10 text-zinc-500">Kanal topilmadi</div>;
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6 text-zinc-100">
            {/* Banner (Default yoki Channel Banner) */}
            <div className="h-36 sm:h-52 w-full rounded-2xl bg-gradient-to-r from-zinc-800 via-zinc-900 to-zinc-800 border border-zinc-800 overflow-hidden relative">
                {channel.bannerUrl && (
                    <img
                        src={channel.bannerUrl}
                        alt="Banner"
                        className="w-full h-full object-cover"
                    />
                )}
            </div>

            {/* Kanal Header Ma'lumotlari */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
                <div className="flex items-center gap-4">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-red-600/20 text-red-500 border-2 border-zinc-800 flex items-center justify-center font-bold text-2xl shrink-0 overflow-hidden">
                        {channel.avatarUrl ? (
                            <img src={channel.avatarUrl} alt={channel.name} className="w-full h-full object-cover" />
                        ) : (
                            channel.name.slice(0, 2).toUpperCase()
                        )}
                    </div>

                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold">{channel.name}</h1>
                        <p className="text-xs text-zinc-400">
                            {channel.handle || `@${channel.name.toLowerCase().replace(/\s+/g, '')}`} • {channel.subscribersCount} obunachi
                        </p>
                        <p className="text-xs text-zinc-400 line-clamp-1 max-w-xl">
                            {channel.description || "Tavsif mavjud emas"}
                        </p>
                    </div>
                </div>

                {/* Obuna tugmasi */}
                <button
                    onClick={handleToggleSubscribe}
                    disabled={subscribing}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition shrink-0 ${
                        channel.isSubscribed
                            ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                            : "bg-white text-zinc-950 hover:bg-zinc-200"
                    }`}
                >
                    {subscribing ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : channel.isSubscribed ? (
                        <>
                            <BellCheck className="w-4 h-4 text-red-500" />
                            <span>A'zo bo'lingan</span>
                        </>
                    ) : (
                        <>
                            <Bell className="w-4 h-4" />
                            <span>A'zo bo'lish</span>
                        </>
                    )}
                </button>
            </div>

            {/* Kanal Videolari */}
            <div className="space-y-4">
                <h2 className="text-lg font-bold">Videolar</h2>
                {videos.length === 0 ? (
                    <p className="text-sm text-zinc-500">Ushbu kanalda hozircha videolar yo'q.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                        {videos.map((video) => (
                            <VideoCard key={video.id} video={video} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}