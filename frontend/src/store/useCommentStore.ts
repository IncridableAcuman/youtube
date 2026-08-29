import { create } from "zustand";
import { api } from "@/api.axio";
import type { Comment } from "@/types/comment";
import type { PageResponse } from "@/types/video";

interface CommentState {
    comments: Comment[];
    loading: boolean;
    error: string | null;

    fetchComments: (videoId: string, page?: number, size?: number) => Promise<void>;
    addComment: (videoId: string, text: string) => Promise<boolean>;
}

export const useCommentStore = create<CommentState>((set) => ({
    comments: [],
    loading: false,
    error: null,

    fetchComments: async (videoId: string, page = 0, size = 20) => {
        set({ loading: true, error: null });
        try {
            const res = await api.get<PageResponse<Comment>>(`/comments/video/${videoId}?page=${page}&size=${size}`);
            set({ comments: res.data.content || [], loading: false });
        } catch (err: any) {
            set({ error: err.response?.data?.message || "Izohlarni yuklab bo'lmadi", loading: false });
        }
    },

    addComment: async (videoId: string, text: string) => {
        try {
            // Backend `CommentRequest` binosan { content: text } yuboriladi
            const res = await api.post<Comment>(`/comments?videoId=${videoId}`, { content: text });
            set((state) => ({ comments: [res.data, ...state.comments] }));
            return true;
        } catch (err: any) {
            console.error("Izoh yuborishda xatolik:", err);
            return false;
        }
    },
}));