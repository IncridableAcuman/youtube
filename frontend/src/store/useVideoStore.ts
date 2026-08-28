import { create } from "zustand";
import { api } from "@/api.axio";
import type { Video, PageResponse, VideoRequest } from "@/types/video";

interface VideoState {
    videos: Video[];
    myVideos: Video[];
    currentVideo: Video | null;
    loading: boolean;
    error: string | null;
    totalPages: number;

    fetchVideos: (page?: number, size?: number, sortBy?: string, sortDir?: string) => Promise<void>;
    fetchVideoDetails: (id: string) => Promise<void>;
    fetchMyVideos: () => Promise<void>;
    searchVideos: (query: string, page?: number, size?: number) => Promise<void>;
    addVideo: (data: VideoRequest) => Promise<boolean>;
    editVideo: (id: string, data: Partial<VideoRequest>) => Promise<boolean>;
    deleteVideo: (id: string) => Promise<boolean>;
    toggleReaction: (id: string, isLike: boolean) => Promise<void>;
}

export const useVideoStore = create<VideoState>((set, get) => ({
    videos: [],
    myVideos: [],
    currentVideo: null,
    loading: false,
    error: null,
    totalPages: 0,

    fetchVideos: async (page = 0, size = 12, sortBy = "createdAt", sortDir = "desc") => {
        set({ loading: true, error: null });
        try {
            const res = await api.get<PageResponse<Video>>(`/videos?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`);
            set({ videos: res.data.content, totalPages: res.data.totalPages, loading: false });
        } catch (err: any) {
            set({ error: err.response?.data?.message || "Videolarni yuklashda xatolik", loading: false });
        }
    },

    fetchVideoDetails: async (id: string) => {
        set({ loading: true, error: null });
        try {
            const res = await api.get<Video>(`/videos/${id}`);
            set({ currentVideo: res.data, loading: false });
        } catch (err: any) {
            set({ error: err.response?.data?.message || "Video topilmadi", loading: false });
        }
    },

    fetchMyVideos: async () => {
        set({ loading: true, error: null });
        try {
            const res = await api.get<Video[]>("/videos/me");
            set({ myVideos: res.data, loading: false });
        } catch (err: any) {
            set({ error: err.response?.data?.message || "Mening videolarimni yuklab bo'lmadi", loading: false });
        }
    },

    searchVideos: async (query: string, page = 0, size = 10) => {
        set({ loading: true, error: null });
        try {
            const res = await api.get<PageResponse<Video>>(`/videos/search?query=${query}&page=${page}&size=${size}`);
            set({ videos: res.data.content, totalPages: res.data.totalPages, loading: false });
        } catch (err: any) {
            set({ error: err.response?.data?.message || "Qidiruvda xatolik", loading: false });
        }
    },

    addVideo: async (data: VideoRequest) => {
        set({ loading: true });
        try {
            await api.post("/videos", data);
            await get().fetchVideos();
            set({ loading: false });
            return true;
        } catch (err: any) {
            set({ error: err.response?.data?.message || "Video qo'shib bo'lmadi", loading: false });
            return false;
        }
    },

    editVideo: async (id: string, data: Partial<VideoRequest>) => {
        set({ loading: true });
        try {
            const res = await api.patch<Video>(`/videos/${id}`, data);
            set((state) => ({
                myVideos: state.myVideos.map((v) => (v.id === id ? res.data : v)),
                currentVideo: state.currentVideo?.id === id ? res.data : state.currentVideo,
                loading: false,
            }));
            return true;
        } catch (err: any) {
            set({ error: err.response?.data?.message || "Tahrirlashda xatolik", loading: false });
            return false;
        }
    },

    deleteVideo: async (id: string) => {
        set({ loading: true });
        try {
            await api.delete(`/videos/${id}`);
            set((state) => ({
                myVideos: state.myVideos.filter((v) => v.id !== id),
                videos: state.videos.filter((v) => v.id !== id),
                loading: false,
            }));
            return true;
        } catch (err: any) {
            set({ error: err.response?.data?.message || "O'chirishda xatolik", loading: false });
            return false;
        }
    },

    toggleReaction: async (id: string, isLike: boolean) => {
        try {
            const endpoint = isLike ? `/videos/${id}/like` : `/videos/${id}/dislike`;
            const res = await api.post<Video>(endpoint);
            set((state) => ({
                currentVideo: state.currentVideo?.id === id ? res.data : state.currentVideo,
                videos: state.videos.map((v) => (v.id === id ? res.data : v)),
            }));
        } catch (err: any) {
            console.error("Reaksiya bildirishda xatolik:", err);
        }
    },
}));