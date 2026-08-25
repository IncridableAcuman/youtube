import React from "react";
import { Link } from "react-router-dom";
import type {Video} from "@/types/video";
import { MoreVertical } from "lucide-react";

interface VideoCardProps {
    video: Video;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
    const thumbnailUrl = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;

    return (
        <div className="flex flex-col gap-3 group cursor-pointer">
            {/* Thumbnail Container */}
            <Link to={`/watch/${video.id}`} className="relative aspect-video rounded-xl overflow-hidden bg-zinc-900">
                <img
                    src={thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    loading="lazy"
                />
                {/* Davomiyligi ko'rsatgichi */}
                {video.duration && (
                    <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded backdrop-blur-sm">
            {video.duration}
          </span>
                )}
            </Link>

            {/* Meta ma'lumotlar (Kanal avatari va sarlavha) */}
            <div className="flex gap-3 px-0.5">
                <div className="shrink-0">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-red-600 to-zinc-700 flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                        {video.channelAvatar ? (
                            <img src={video.channelAvatar} alt={video.channelName} className="w-full h-full object-cover" />
                        ) : (
                            (video.channelName || "YT").slice(0, 2).toUpperCase()
                        )}
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    <Link to={`/watch/${video.id}`}>
                        <h3 className="text-sm font-semibold text-zinc-100 line-clamp-2 leading-snug group-hover:text-red-500 transition">
                            {video.title}
                        </h3>
                    </Link>

                    <p className="text-xs text-zinc-400 mt-1 hover:text-zinc-200 transition truncate">
                        {video.channelName || "YouTube Kanal"}
                    </p>

                    <div className="flex items-center gap-1 text-[12px] text-zinc-400 mt-0.5">
                        <span>{video.views ? `${video.views.toLocaleString()} marta ko'rildi` : "Yangi video"}</span>
                        <span>•</span>
                        <span>{video.createdAt || "Yaqinda"}</span>
                    </div>
                </div>

                {/* Qo'shimcha menyu */}
                <button className="opacity-0 group-hover:opacity-100 transition p-1 hover:bg-zinc-800 rounded-full h-fit text-zinc-400">
                    <MoreVertical className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};