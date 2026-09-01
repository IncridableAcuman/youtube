import type { Video } from "@/types/video";
import { Link } from "react-router-dom";

interface VideoCardProps {
    video: Video;
}

export function VideoCard({ video }: VideoCardProps) {
    const thumbnail =
        video.thumbnailUrl || `https://i.ytimg.com/vi/${video.youtubeKey}/hqdefault.jpg`;
    const viewsCount = (video.views ?? 0).toLocaleString();

    return (
        <Link to={`/watch/${video.id}`} className="group flex flex-col gap-2 cursor-pointer">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-zinc-900 border border-zinc-800">
                <img
                    src={thumbnail}
                    alt={video.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition duration-200"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.youtubeKey}/hqdefault.jpg`;
                    }}
                />
                <div className="absolute bottom-2 right-2 rounded-md bg-black/80 px-1.5 py-0.5 text-xs font-medium text-zinc-200 backdrop-blur-sm">
                    {video.duration || "10:00"}
                </div>
            </div>

            <div className="flex gap-3 pt-1">
                <div className="h-9 w-9 shrink-0 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center font-bold text-xs">
                    YT
                </div>
                <div className="flex flex-col overflow-hidden">
                    <h3 className="line-clamp-2 text-sm font-semibold text-zinc-100 group-hover:text-blue-400 transition leading-snug">
                        {video.title}
                    </h3>
                    <p className="mt-1 text-xs text-zinc-400">YouTube Kanal</p>
                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 mt-0.5">
                        <span>{viewsCount} ko'rishlar</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}