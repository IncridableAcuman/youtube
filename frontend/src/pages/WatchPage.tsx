import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useVideoStore } from "@/store/useVideoStore";
import { useCommentStore } from "@/store/useCommentStore";
import { useChannelStore } from "@/store/useChannelStore";
import {
    ThumbsUp,
    ThumbsDown,
    Eye,
    Send,
    User,
    Loader2,
    Bell,
    BellCheck,
    Calendar,
    ChevronDown,
    ChevronUp,
    Folder,
    Tag,
} from "lucide-react";

export default function WatchPage() {
    const { id } = useParams<{ id: string }>();
    const { currentVideo, fetchVideoDetails, toggleReaction } = useVideoStore();
    const { comments, fetchComments, addComment, loading: commentsLoading } = useCommentStore();
    const { toggleSubscription, checkIsSubscribed } = useChannelStore();

    const [subscribed, setSubscribed] = useState(false);
    const [subLoading, setSubLoading] = useState(false);
    const [text, setText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDescExpanded, setIsDescExpanded] = useState(false);

    useEffect(() => {
        if (id) {
            fetchVideoDetails(id);
            fetchComments(id);
        }
    }, [id]);

    useEffect(() => {
        if (currentVideo?.channelId) {
            checkIsSubscribed(currentVideo.channelId).then(setSubscribed);
        }
    }, [currentVideo?.channelId]);

    const handleSubscribe = async () => {
        if (!currentVideo?.channelId || subLoading) return;
        setSubLoading(true);
        try {
            const isSub = await toggleSubscription(currentVideo.channelId);
            setSubscribed(isSub);
        } catch (err) {
            console.error("Obunada xatolik:", err);
        } finally {
            setSubLoading(false);
        }
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim() || !id || isSubmitting) return;

        setIsSubmitting(true);
        const ok = await addComment(id, text);
        if (ok) setText("");
        setIsSubmitting(false);
    };

    if (!currentVideo) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px] text-zinc-500 gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-red-600" />
                <span className="text-xs">Video yuklanmoqda...</span>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6 text-zinc-100 px-4 py-2">
            {/* Video Player Frame */}
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-zinc-950 border border-zinc-800/80 shadow-2xl">
                <iframe
                    src={`https://www.youtube.com/embed/${currentVideo.youtubeKey}?autoplay=1`}
                    title={currentVideo.title}
                    className="h-full w-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>

            {/* Video Sarlavhasi va Kanal Paneli */}
            <div className="space-y-4">
                <h1 className="text-xl md:text-2xl font-bold leading-snug text-white tracking-tight">
                    {currentVideo.title}
                </h1>

                {/* Kanal profil ma'lumoti hamda Reaksiyalar */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
                    <div className="flex items-center gap-4">
                        {currentVideo.channelId ? (
                            <Link
                                to={`/channels/${currentVideo.channelId}`}
                                className="flex items-center gap-3 group"
                            >
                                <div className="w-11 h-11 rounded-full bg-red-600/10 text-red-500 border border-zinc-800 flex items-center justify-center font-bold text-sm shrink-0 group-hover:border-red-600/50 transition">
                                    {(currentVideo.channelName || "Kanal").slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-semibold text-sm text-zinc-100 group-hover:text-red-400 transition">
                                        {currentVideo.channelName || "YouTube Kanal"}
                                    </p>
                                    <p className="text-xs text-zinc-400">Kanalga o'tish</p>
                                </div>
                            </Link>
                        ) : (
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-full bg-red-600/10 text-red-500 border border-zinc-800 flex items-center justify-center font-bold text-sm shrink-0">
                                    YT
                                </div>
                                <div>
                                    <p className="font-semibold text-sm text-zinc-100">YouTube Kanal</p>
                                    <p className="text-xs text-zinc-400">Kanal tafsiloti</p>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={handleSubscribe}
                            disabled={subLoading}
                            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-full transition active:scale-95 shadow-sm ${
                                subscribed
                                    ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700/50"
                                    : "bg-white text-zinc-950 hover:bg-zinc-200"
                            }`}
                        >
                            {subLoading ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : subscribed ? (
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

                    {/* Like / Dislike Tugmalari */}
                    <div className="flex items-center gap-2">
                        <div className="flex items-center rounded-full bg-zinc-900 border border-zinc-800/80 p-1">
                            <button
                                onClick={() => toggleReaction(currentVideo.id, true)}
                                className="flex items-center gap-2 px-4 py-1.5 hover:bg-zinc-800 text-xs font-semibold rounded-l-full text-zinc-200 transition active:scale-95"
                                title="Like bosish"
                            >
                                <ThumbsUp className="w-4 h-4 text-zinc-400 group-hover:text-zinc-200" />
                                <span>{currentVideo.likes || 0}</span>
                            </button>
                            <div className="w-[1px] h-4 bg-zinc-800" />
                            <button
                                onClick={() => toggleReaction(currentVideo.id, false)}
                                className="flex items-center gap-2 px-4 py-1.5 hover:bg-zinc-800 text-xs font-semibold rounded-r-full text-zinc-200 transition active:scale-95"
                                title="Dislike bosish"
                            >
                                <ThumbsDown className="w-4 h-4 text-zinc-400 group-hover:text-zinc-200" />
                                <span>{currentVideo.dislikes || 0}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tavsif Karti */}
                <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800/80 space-y-3 text-sm transition">
                    <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-zinc-400">
                        <span className="flex items-center gap-1.5">
                            <Eye className="w-3.5 h-3.5 text-zinc-500" />
                            {(currentVideo.views || 0).toLocaleString()} marta ko'rildi
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                            {currentVideo.createdAt
                                ? new Date(currentVideo.createdAt).toLocaleDateString("uz-UZ")
                                : "Yaqinda yuklandi"}
                        </span>

                        {currentVideo.category && (
                            <span className="flex items-center gap-1 text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-full font-medium">
                                <Folder className="w-3 h-3 text-blue-400" />
                                {currentVideo.category}
                            </span>
                        )}
                    </div>

                    <p
                        className={`text-zinc-300 whitespace-pre-line text-sm leading-relaxed transition-all ${
                            !isDescExpanded ? "line-clamp-3" : ""
                        }`}
                    >
                        {currentVideo.description || "Ushbu video uchun tavsif mavjud emas."}
                    </p>

                    {currentVideo.description && currentVideo.description.length > 150 && (
                        <button
                            onClick={() => setIsDescExpanded(!isDescExpanded)}
                            className="text-xs font-semibold text-zinc-400 hover:text-white flex items-center gap-1 mt-1 transition"
                        >
                            {isDescExpanded ? (
                                <>
                                    <span>Yashirish</span>
                                    <ChevronUp className="w-3.5 h-3.5" />
                                </>
                            ) : (
                                <>
                                    <span>Ko'proq ko'rsatish</span>
                                    <ChevronDown className="w-3.5 h-3.5" />
                                </>
                            )}
                        </button>
                    )}

                    {currentVideo.tags && currentVideo.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-zinc-800/60">
                            {currentVideo.tags.map((tag: string, index: number) => (
                                <span
                                    key={index}
                                    className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition cursor-pointer bg-zinc-950 px-2.5 py-1 rounded-lg border border-zinc-800"
                                >
                                    <Tag className="w-3 h-3 text-zinc-500" />
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Izohlar Bo'limi */}
            <div className="space-y-5 pt-2">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>{comments.length} ta Izoh</span>
                </h3>

                {/* Izoh yozish formasi */}
                <form onSubmit={handleCommentSubmit} className="flex gap-3 items-start">
                    <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700/50 flex items-center justify-center shrink-0 text-zinc-300 font-bold text-xs mt-0.5">
                        <User className="w-4 h-4 text-zinc-400" />
                    </div>
                    <div className="flex-1 flex gap-2">
                        <input
                            type="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Izoh yozing..."
                            disabled={isSubmitting}
                            className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900/90 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition disabled:opacity-50"
                        />
                        <button
                            type="submit"
                            disabled={!text.trim() || isSubmitting}
                            className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:hover:bg-red-600 text-white px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-red-600/20 active:scale-95 transition shrink-0"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    <Send className="w-4 h-4" /> Yuborish
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Izohlar Ro'yxati */}
                <div className="space-y-3 pt-2">
                    {commentsLoading ? (
                        <div className="flex justify-center py-6 text-zinc-500">
                            <Loader2 className="w-6 h-6 animate-spin text-red-600" />
                        </div>
                    ) : comments.length === 0 ? (
                        <div className="py-8 border border-dashed border-zinc-800 rounded-2xl text-center text-zinc-500">
                            <p className="text-xs">Hozircha izohlar yo'q. Birinchi bo'lib izoh qoldiring!</p>
                        </div>
                    ) : (
                        comments.map((c) => {
                            const userName = c.user?.name || c.user?.username || "Foydalanuvchi";
                            const initial = userName.slice(0, 1).toUpperCase();

                            return (
                                <div
                                    key={c.id}
                                    className="p-3.5 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl text-sm flex gap-3 hover:border-zinc-700/80 transition"
                                >
                                    <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700/50 flex items-center justify-center shrink-0 font-bold text-xs text-zinc-300">
                                        {c.user?.avatarUrl ? (
                                            <img
                                                src={c.user.avatarUrl}
                                                alt={userName}
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        ) : (
                                            initial
                                        )}
                                    </div>
                                    <div className="space-y-1 flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="text-xs font-semibold text-zinc-300">
                                                {userName}
                                            </p>
                                            {c.createdAt && (
                                                <span className="text-[10px] text-zinc-500">
                                                    {new Date(c.createdAt).toLocaleDateString("uz-UZ", {
                                                        day: "numeric",
                                                        month: "short",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-zinc-200 text-sm leading-relaxed">{c.content}</p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}