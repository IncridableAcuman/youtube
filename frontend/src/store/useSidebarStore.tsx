import { create } from "zustand";

interface SidebarState {
    isOpen: boolean;
    toggleSidebar: () => void;
    closeSidebar: () => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
    isOpen: true, // Sukut bo'yicha ochiq
    toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
    closeSidebar: () => set({ isOpen: false }),
}));