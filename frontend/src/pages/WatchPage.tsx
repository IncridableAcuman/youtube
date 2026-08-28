import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useVideoStore } from "@/store/useVideoStore";
import { useCommentStore } from "@/store/useCommentStore";
import { ThumbsUp, ThumbsDown, Eye, Send, User } from "lucide-react";

export default function WatchPage() {
    const { id } = useParams<{ id: string }>();
    const { currentVideo, fetchVideoDetails, toggleReaction } = useVideoStore();
    const { comments, fetchComments, addComment } = useCommentStore();
    const [text, setText] = useState("");

    useEffect(() => {
        if (id) {
            fetchVideoDetails(id);
            fetchComments(id);
        }
    }, [id]);

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim() || !id) return;
        const ok = await addComment(id, text);
        if (ok) setText("");
    };

    if (!currentVideo) {
        return (
            <div className="flex items-center justify-center min-h-[400px] text-zinc-400 text-sm">
                Video yuklanmoqda...
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-5 text-zinc-100">
            {/* Video Player */}
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl">
                <iframe
                    src={`https://www.youtube.com/embed/${currentVideo.youtubeKey}?autoplay=1`}
                    title={currentVideo.title}
                    className="h-full w-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>

            {/* Video Ma'lumotlari */}
            <div className="space-y-4">
                <h1 className="text-xl md:text-2xl font-bold leading-tight text-zinc-100">
                    {currentVideo.title}
                </h1>

                {/* Kanal va Reaksiyalar Paneli */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-zinc-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center font-bold text-sm">
                            YT
                        </div>
                        <div>
                            <p className="font-semibold text-sm text-zinc-100">YouTube Kanal</p>
                            <p className="text-xs text-zinc-400">Obunachilar yo'q</p>
                        </div>
                        <button className="ml-2 px-4 py-1.5 bg-zinc-100 hover:bg-zinc-200 active:bg-zinc-300 text-zinc-950 font-medium text-xs rounded-full transition">
                            A'zo bo'lish
                        </button>
                    </div>

                    {/* Like / Dislike Tugmalari */}
                    <div className="flex items-center gap-2">
                        <div className="flex items-center rounded-full bg-zinc-900 border border-zinc-800 p-0.5">
                            <button
                                onClick={() => toggleReaction(currentVideo.id, true)}
                                className="flex items-center gap-2 px-4 py-1.5 hover:bg-zinc-800 text-xs font-semibold rounded-l-full text-zinc-200 transition"
                            >
                                <ThumbsUp className="w-4 h-4 text-zinc-300" />
                                <span>{currentVideo.likes}</span>
                            </button>
                            <div className="w-[1px] h-4 bg-zinc-800" />
                            <button
                                onClick={() => toggleReaction(currentVideo.id, false)}
                                className="flex items-center gap-2 px-4 py-1.5 hover:bg-zinc-800 text-xs font-semibold rounded-r-full text-zinc-200 transition"
                            >
                                <ThumbsDown className="w-4 h-4 text-zinc-300" />
                                <span>{currentVideo.dislikes}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tavsif Karti */}
                <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2 text-sm">
                    <div className="flex items-center gap-3 text-xs font-medium text-zinc-400">
                        <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" /> {currentVideo.views.toLocaleString()} ko'rishlar
                        </span>
                        <span>•</span>
                        <span>{new Date(currentVideo.createdAt).toLocaleDateString("uz-UZ")}</span>
                    </div>
                    <p className="text-zinc-200 whitespace-pre-line text-sm leading-relaxed">
                        {currentVideo.description || "Ushbu video uchun tavsif mavjud emas."}
                    </p>
                </div>
            </div>

            {/* Izohlar Bo'limi */}
            <div className="space-y-4 pt-4">
                <h3 className="text-lg font-bold text-zinc-100">
                    {comments.length} ta Izoh
                </h3>

                <form onSubmit={handleCommentSubmit} className="flex gap-2">
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Izoh yozing..."
                        className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition"
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 shadow-lg shadow-blue-600/20 transition"
                    >
                        <Send className="w-4 h-4" /> Yuborish
                    </button>
                </form>

                <div className="space-y-3">
                    {comments.length === 0 ? (
                        <p className="text-xs text-zinc-500">Hozircha izohlar yo'q. Birinchi bo'lib izoh qoldiring!</p>
                    ) : (
                        comments.map((c) => (
                            <div key={c.id} className="p-3.5 bg-zinc-900/60 border border-zinc-800/80 rounded-xl text-sm flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700/50 flex items-center justify-center shrink-0">
                                    <User className="w-4 h-4 text-zinc-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-zinc-400 mb-0.5">Foydalanuvchi</p>
                                    <p className="text-zinc-200 text-sm">{c.text}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}