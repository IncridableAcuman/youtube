import { useState } from "react";
import { useCommentStore } from "@/store/useCommentStore";

export default function AdminCommentsPage() {
    const [videoId, setVideoId] = useState("");
    const { comments, loading, fetchComments } = useCommentStore();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (videoId.trim()) {
            fetchComments(videoId.trim());
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Izohlar Moderatsiyasi</h1>
                <p className="text-xs text-zinc-500 mt-1">Video ID orqali izohlarni yuklab, ularni ko'rib chiqish</p>
            </div>

            <form onSubmit={handleSearch} className="flex gap-3 max-w-lg">
                <input
                    type="text"
                    placeholder="Video ID kiriting..."
                    value={videoId}
                    onChange={(e) => setVideoId(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                />
                <button
                    type="submit"
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition"
                >
                    Qidirish
                </button>
            </form>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
                {loading ? (
                    <div className="text-center text-zinc-500 text-sm py-8">Izohlar yuklanmoqda...</div>
                ) : comments.length ? (
                    <div className="space-y-4">
                        {comments.map((comment) => (
                            <div key={comment.id} className="flex justify-between items-start border-b border-zinc-100 dark:border-zinc-800 pb-4">
                                <div>
                                    <p className="text-xs font-bold text-zinc-500">{comment.user?.username || "Foydalanuvchi"}</p>
                                    <p className="text-sm mt-1 text-zinc-800 dark:text-zinc-200">{comment.content}</p>
                                </div>
                                <button className="text-xs text-red-600 hover:underline font-semibold">O'chirish</button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-zinc-400 text-sm py-8">
                        {videoId ? "Bu video bo'yicha izohlar topilmadi" : "Izohlarni tekshirish uchun video ID kiriting"}
                    </p>
                )}
            </div>
        </div>
    );
}