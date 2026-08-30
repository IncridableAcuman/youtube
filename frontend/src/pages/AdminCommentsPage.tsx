import React, { useEffect } from "react";
import { useAdminStore } from "@/store/useAdminStore";
import { Loader2, Trash2 } from "lucide-react";

export const AdminCommentsPage: React.FC = () => {
    const { comments, fetchComments, deleteComment, loading } = useAdminStore();

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight">Izohlar Moderatsiyasi</h1>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-red-600" />
                </div>
            ) : (
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-sm text-zinc-300">
                        <thead className="bg-zinc-950 text-xs text-zinc-400 uppercase border-b border-zinc-800">
                        <tr>
                            <th className="p-4">Muallif</th>
                            <th className="p-4">Izoh Matni</th>
                            <th className="p-4">Video</th>
                            <th className="p-4 text-right">Amallar</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                        {comments.map((comment) => (
                            <tr key={comment.id} className="hover:bg-zinc-800/40 transition">
                                <td className="p-4 font-semibold text-white">{comment.authorName}</td>
                                <td className="p-4 text-zinc-300 max-w-sm truncate">{comment.text}</td>
                                <td className="p-4 text-zinc-400 max-w-xs truncate">{comment.videoTitle}</td>
                                <td className="p-4 text-right">
                                    <button
                                        onClick={() => deleteComment(comment.id)}
                                        className="p-1.5 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white rounded-lg transition"
                                        title="O'chirish"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};