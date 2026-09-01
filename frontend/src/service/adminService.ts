import { api } from "@/api.axio";

export interface DailyStat {
    date: string;
    count: number;
}

export interface DashboardStatsResponse {
    totalUsers: number;
    totalVideos: number;
    totalViews: number;
    totalLikes: number;
    userRegistrations: DailyStat[];
    videoUploads: DailyStat[];
    totalChannels?: number;
}

export interface UserResponse {
    id: string;
    fullName: string;
    username: string;
    email: string;
    avatar: string;
    role: "ADMIN" | "USER" | "MODERATOR";
    enabled: boolean;
}

export interface VideoResponse {
    id: string;
    title: string;
    description: string;
    youtubeKey: string;
    thumbnailUrl: string;
    duration: string;
    views: number;
    likes: number;
    dislikes: number;
    channelName?: string;
    category?: string;
    createdAt: string;
}

export interface ChannelResponse {
    id: string;
    name: string;
    handle: string;
    description: string;
    subscribers: number;
    userId: string;
    createdAt: string;
}

export interface CommentResponse {
    id: string;
    videoId: string;
    content: string;
    userId: string;
    createdAt: string;
    user?: UserResponse;
}

export interface PageResponse<T> {
    content: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}

export const adminService = {
    // 1. Dashboard Statistikasi
    getDashboardStats: async () => {
        const res = await api.get<DashboardStatsResponse>("/admin/dashboard/stats");
        return res.data;
    },

    // 2. Foydalanuvchilar (Users) Boshqaruvi
    getUsers: async (query = "", page = 0, size = 10) => {
        const res = await api.get<PageResponse<UserResponse>>("/admin/users", { params: { query, page, size } });
        return res.data;
    },
    deleteUser: async (id: string) => api.delete(`/admin/users/${id}`),
    toggleUserBan: async (id: string) => {
        const res = await api.patch<UserResponse>(`/admin/users/${id}/toggle-ban`);
        return res.data;
    },
    changeUserRole: async (id: string, role: "ADMIN" | "USER" | "MODERATOR") => {
        const res = await api.patch<UserResponse>(`/admin/users/${id}/role`, null, { params: { role } });
        return res.data;
    },

    // 3. Videolar (Videos) Boshqaruvi
    getVideos: async (page = 0, size = 10) => {
        const res = await api.get<PageResponse<VideoResponse>>("/admin/videos", { params: { page, size } });
        return res.data;
    },
    deleteVideo: async (id: string) => api.delete(`/admin/videos/${id}`),

    // 4. Kanallar (Channels) Boshqaruvi
    getChannels: async (page = 0, size = 10) => {
        const res = await api.get<PageResponse<ChannelResponse>>("/admin/channels", { params: { page, size } });
        return res.data;
    },
    deleteChannel: async (id: string) => api.delete(`/admin/channels/${id}`),

    // 5. Izohlar (Comments) Boshqaruvi
    getComments: async (page = 0, size = 10) => {
        const res = await api.get<PageResponse<CommentResponse>>("/admin/comments", { params: { page, size } });
        return res.data;
    },
    deleteComment: async (id: string) => api.delete(`/admin/comments/${id}`),
};