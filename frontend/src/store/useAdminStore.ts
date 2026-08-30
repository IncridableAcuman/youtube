import { create } from "zustand";
import { api } from "@/api.axio";

export interface DashboardStats {
    totalUsers: number;
    totalVideos: number;
    totalChannels: number;
    totalViews: number;
}

export interface AdminUser {
    id: string;
    fullName: string;
    username: string;
    email: string;
    role: "USER" | "ADMIN" | "MODERATOR";
    banned: boolean;
    createdAt: string;
}

export interface AdminVideo {
    id: string;
    title: string;
    channelName: string;
    viewsCount: number;
    status: "APPROVED" | "PENDING" | "REJECTED";
    createdAt: string;
}

export interface AdminChannel {
    id: string;
    name: string;
    handle: string;
    subscribersCount: number;
    status: "ACTIVE" | "BANNED";
    createdAt: string;
}

export interface AdminComment {
    id: string;
    text: string;
    authorName: string;
    videoTitle: string;
    flagged: boolean;
    createdAt: string;
}

interface AdminState {
    stats: DashboardStats | null;
    users: AdminUser[];
    videos: AdminVideo[];
    channels: AdminChannel[];
    comments: AdminComment[];
    loading: boolean;
    error: string | null;

    fetchDashboardStats: () => Promise<void>;
    fetchUsers: () => Promise<void>;
    toggleUserBan: (userId: string) => Promise<void>;
    changeUserRole: (userId: string, role: AdminUser["role"]) => Promise<void>;
    fetchVideos: () => Promise<void>;
    updateVideoStatus: (videoId: string, status: AdminVideo["status"]) => Promise<void>;
    deleteVideo: (videoId: string) => Promise<void>;
    fetchChannels: () => Promise<void>;
    toggleChannelStatus: (channelId: string) => Promise<void>;
    fetchComments: () => Promise<void>;
    deleteComment: (commentId: string) => Promise<void>;
}

export const useAdminStore = create<AdminState>((set, get) => ({
    stats: null,
    users: [],
    videos: [],
    channels: [],
    comments: [],
    loading: false,
    error: null,

    fetchDashboardStats: async () => {
        set({ loading: true, error: null });
        try {
            const res = await api.get("/admin/stats");
            set({ stats: res.data, loading: false });
        } catch (err: any) {
            set({ error: err.response?.data?.message || "Statistikani yuklashda xatolik", loading: false });
        }
    },

    fetchUsers: async () => {
        set({ loading: true, error: null });
        try {
            const res = await api.get("/admin/users");
            set({ users: res.data, loading: false });
        } catch (err: any) {
            set({ error: err.response?.data?.message || "Foydalanuvchilarni yuklashda xatolik", loading: false });
        }
    },

    toggleUserBan: async (userId: string) => {
        try {
            const res = await api.patch(`/admin/users/${userId}/toggle-ban`);
            set({
                users: get().users.map((u) => (u.id === userId ? { ...u, banned: res.data.banned } : u)),
            });
        } catch (err: any) {
            set({ error: "Foydalanuvchi statusini o'zgartirishda xatolik" });
        }
    },

    changeUserRole: async (userId: string, role: AdminUser["role"]) => {
        try {
            await api.patch(`/admin/users/${userId}/role`, { role });
            set({
                users: get().users.map((u) => (u.id === userId ? { ...u, role } : u)),
            });
        } catch (err: any) {
            set({ error: "Rolni o'zgartirishda xatolik" });
        }
    },

    fetchVideos: async () => {
        set({ loading: true, error: null });
        try {
            const res = await api.get("/admin/videos");
            set({ videos: res.data, loading: false });
        } catch (err: any) {
            set({ error: err.response?.data?.message || "Videolarni yuklashda xatolik", loading: false });
        }
    },

    updateVideoStatus: async (videoId: string, status: AdminVideo["status"]) => {
        try {
            await api.patch(`/admin/videos/${videoId}/status`, { status });
            set({
                videos: get().videos.map((v) => (v.id === videoId ? { ...v, status } : v)),
            });
        } catch (err: any) {
            set({ error: "Video statusini yangilashda xatolik" });
        }
    },

    deleteVideo: async (videoId: string) => {
        try {
            await api.delete(`/admin/videos/${videoId}`);
            set({ videos: get().videos.filter((v) => v.id !== videoId) });
        } catch (err: any) {
            set({ error: "Videonini o'chirishda xatolik" });
        }
    },

    fetchChannels: async () => {
        set({ loading: true, error: null });
        try {
            const res = await api.get("/admin/channels");
            set({ channels: res.data, loading: false });
        } catch (err: any) {
            set({ error: err.response?.data?.message || "Kanallarni yuklashda xatolik", loading: false });
        }
    },

    toggleChannelStatus: async (channelId: string) => {
        try {
            const res = await api.patch(`/admin/channels/${channelId}/toggle-status`);
            set({
                channels: get().channels.map((c) => (c.id === channelId ? { ...c, status: res.data.status } : c)),
            });
        } catch (err: any) {
            set({ error: "Kanal statusini o'zgartirishda xatolik" });
        }
    },

    fetchComments: async () => {
        set({ loading: true, error: null });
        try {
            const res = await api.get("/admin/comments");
            set({ comments: res.data, loading: false });
        } catch (err: any) {
            set({ error: err.response?.data?.message || "Izohlarni yuklashda xatolik", loading: false });
        }
    },

    deleteComment: async (commentId: string) => {
        try {
            await api.delete(`/admin/comments/${commentId}`);
            set({ comments: get().comments.filter((c) => c.id !== commentId) });
        } catch (err: any) {
            set({ error: "Izohni o'chirishda xatolik" });
        }
    },
}));