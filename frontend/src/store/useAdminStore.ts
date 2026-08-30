import { create } from 'zustand';
import {
    adminService,
    type UserResponse,
    type PageResponse, type DashboardStatsResponse // PageResponse endi adminService.ts dan olindi
} from "@/service/adminService.ts";

interface AdminState {
    // Statik Ma'lumotlar
    stats: DashboardStatsResponse | null;
    loadingStats: boolean;
    fetchStats: () => Promise<void>;

    // Foydalanuvchilar Paginatsiyasi Holati
    usersData: PageResponse<UserResponse> | null;
    loadingUsers: boolean;
    searchQuery: string;
    page: number;
    pageSize: number;

    // Harakatlar (Actions)
    setSearchQuery: (query: string) => void;
    setPage: (page: number) => void;
    fetchUsers: () => Promise<void>;
    deleteUser: (id: string) => Promise<void>;
}

export const useAdminStore = create<AdminState>((set, get) => ({
    stats: null,
    loadingStats: false,

    usersData: null,
    loadingUsers: false,
    searchQuery: '',
    page: 0,
    pageSize: 10,

    // Dashboard Statisikasini Yuklash
    fetchStats: async () => {
        set({ loadingStats: true });
        try {
            const stats:DashboardStatsResponse = await adminService.getDashboardStats();
            set({ stats, loadingStats: false });
        } catch (error) {
            console.error('Dashboard statistikasini yuklashda xatolik:', error);
            set({ loadingStats: false });
        }
    },

    // Qidiruv So'rovini Yangilash
    setSearchQuery: (query: string) => {
        set({ searchQuery: query, page: 0 });
        get().fetchUsers();
    },

    // Sahifani Yangilash
    setPage: (page: number) => {
        set({ page });
        get().fetchUsers();
    },

    // Foydalanuvchilar Ro'yxatini Yuklash
    fetchUsers: async () => {
        set({ loadingUsers: true });
        try {
            const { searchQuery, page, pageSize } = get();
            const usersData = await adminService.getUsers(searchQuery, page, pageSize);
            set({ usersData, loadingUsers: false });
        } catch (error) {
            console.error('Foydalanuvchilarni yuklashda xatolik:', error);
            set({ loadingUsers: false });
        }
    },

    // Foydalanuvchini O'chirish
    deleteUser: async (id: string) => {
        try {
            await adminService.deleteUser(id);
            get().fetchUsers(); // O'chirilgandan so'ng ro'yxatni avtomatik qayta yuklash
        } catch (error) {
            console.error('Foydalanuvchini o\'chirishda xatolik:', error);
        }
    },
}));