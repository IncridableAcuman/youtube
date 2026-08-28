import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { VideoCard } from "@/components/video/VideoCard";
import { Loader2, BellCheck, Bell, Film } from "lucide-react";
import {useChannelStore} from "@/store/useChannelStore.ts";

export default function ChannelPage() {
    const { channelId } = useParams<{ channelId: string }>();
    const [subscribing, setSubscribing] = useState(false);

    const {
        currentChannel: channel,
        channelVideos: videos,
        loading,
        fetchChannelDetails,
        fetchChannelVideos,
        toggleSubscription,
        clearCurrentChannel,
    } = useChannelStore();

    useEffect(() => {
        if (!channelId) return;

        fetchChannelDetails(channelId);
        fetchChannelVideos(channelId);

        return () => {
            clearCurrentChannel();
        };
    }, [channelId]);

    const handleToggleSubscribe = async () => {
        if (!channel || subscribing) return;

        setSubscribing(true);
        try {
            await toggleSubscription(channel.id);
        } catch (err) {
            console.error("Obuna xatoligi:", err);
        } finally {
            setSubscribing(false);
        }
    };

    if (loading && !channel) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-zinc-500 gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-red-600" />
                <span className="text-xs">Kanal yuklanmoqda...</span>
            </div>
        );
    }

    if (!channel) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-zinc-500">
                <p className="text-base font-medium text-zinc-400">Kanal topilmadi</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6 text-zinc-100 px-4 py-2">
            {/* Banner */}
            <div className="h-36 sm:h-52 w-full rounded-2xl bg-gradient-to-r from-zinc-800 via-zinc-900 to-zinc-800 border border-zinc-800/80 overflow-hidden relative shadow-inner flex items-center justify-center">
                {channel.bannerUrl ? (
                    <img
                        src={channel.bannerUrl}
                        alt="Banner"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span className="text-zinc-600 text-xs font-medium">Banner yuklanmagan</span>
                )}
            </div>

            {/* Kanal Header Ma'lumotlari */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
                <div className="flex items-center gap-5">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-red-600/10 text-red-500 border-2 border-zinc-800 flex items-center justify-center font-bold text-2xl shrink-0 overflow-hidden shadow-md">
                        {channel.avatarUrl ? (
                            <img src={channel.avatarUrl} alt={channel.name} className="w-full h-full object-cover" />
                        ) : (
                            channel.name.slice(0, 2).toUpperCase()
                        )}
                    </div>

                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight text-white">{channel.name}</h1>
                        <p className="text-xs text-zinc-400">
                            {channel.handle || `@${channel.name.toLowerCase().replace(/\s+/g, '')}`} • {channel.subscribersCount ?? 0} obunachi
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
                    className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition active:scale-95 shrink-0 shadow-sm ${
                        channel.isSubscribed
                            ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700/50"
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
            <div className="space-y-4 pt-2">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Film className="w-5 h-5 text-red-600" />
                    Videolar
                </h2>
                {videos.length === 0 ? (
                    <div className="py-12 border border-dashed border-zinc-800 rounded-2xl text-center text-zinc-500">
                        <p className="text-sm">Ushbu kanalda hozircha videolar yo'q.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                        {videos.map((video) => (
                            <VideoCard key={video.id} video={{ ...video, channelName: channel.name }} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}