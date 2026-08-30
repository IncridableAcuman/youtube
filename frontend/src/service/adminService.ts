import {api} from "@/api.axio.ts";

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
    role: "ADMIN" | "USER";
}
export interface DashboardStats {
    totalUsers: number;
    totalVideos: number;
    totalChannels: number;
    totalViews: number;
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
    subscribersCount: number;
    createdAt: string;
}

export interface CommentResponse {
    id: string;
    videoId: string;
    content: string;
    createdAt: string;
    user: UserResponse;
}

export interface PageResponse<T> {
    content: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

export const adminService = {
    // Stats
    getDashboardStats: async () => {
        const res = await api.get<DashboardStatsResponse>("/admin/dashboard/stats");
        return res.data;
    },

    // Users
    getUsers: async (query = "", page = 0, size = 10) => {
        const res = await api.get<PageResponse<UserResponse>>("/admin/users", { params: { query, page, size } });
        return res.data;
    },
    deleteUser: async (id: string) => api.delete(`/admin/users/${id}`),

    // Videos
    getVideos: async (page = 0, size = 10) => {
        const res = await api.get<PageResponse<VideoResponse>>("/videos", { params: { page, size } });
        return res.data;
    },
    deleteVideo: async (id: string) => api.delete(`/videos/${id}`),

    // Comments
    getVideoComments: async (videoId: string, page = 0, size = 10) => {
        const res = await api.get<PageResponse<CommentResponse>>(`/comments/video/${videoId}`, { params: { page, size } });
        return res.data;
    },
};