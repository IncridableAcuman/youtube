import {api} from "@/api.axio.ts";

export interface PageResponse<T> {
    content: T[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}

export interface UserResponse {
    id: string;
    username: string;
    email: string;
    role: string;
    createdAt: string;
}

export interface DashboardStats {
    totalUsers: number;
    totalVideos: number;
    totalViews: number;
    totalLikes: number;
    userRegistrations: { date: string; count: number }[];
    videoUploads: { date: string; count: number }[];
}

export const adminService = {
    // Stats
    getDashboardStats: async (): Promise<DashboardStats> => {
        const response = await api.get<DashboardStats>('/admin/dashboard/stats');
        return response.data;
    },

    // Users (Pagination + Search)
    getUsers: async (query = '', page = 0, size = 10): Promise<PageResponse<UserResponse>> => {
        const response = await api.get<PageResponse<UserResponse>>('/admin/users', {
            params: { query, page, size },
        });
        return response.data;
    },

    // Delete User
    deleteUser: async (id: string): Promise<void> => {
        await api.delete(`/admin/users/${id}`);
    },
};