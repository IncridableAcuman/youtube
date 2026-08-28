import { create } from "zustand";
import { api } from "@/api.axio";
import type { Channel, ChannelRequest } from "@/types/channel";
import type { Video } from "@/types/video";

interface ChannelState {
    myChannel: Channel | null;
    currentChannel: Channel | null;
    channelVideos: Video[];
    loading: boolean;
    error: string | null;

    // Actions
    fetchMyChannel: () => Promise<Channel | null>;
    createChannel: (data: ChannelRequest) => Promise<Channel>;
    fetchChannelDetails: (channelId: string) => Promise<Channel | null>;
    fetchChannelVideos: (channelId: string) => Promise<Video[]>;
    toggleSubscription: (channelId: string) => Promise<boolean>;
    checkIsSubscribed: (channelId: string) => Promise<boolean>;
    assignVideoToChannel: (videoId: string) => Promise<void>;
    setMyChannel: (channel: Channel | null) => void;
    clearCurrentChannel: () => void;
}

export const useChannelStore = create<ChannelState>((set, get) => ({
    myChannel: null,
    currentChannel: null,
    channelVideos: [],
    loading: false,
    error: null,

    // 1. Shaxsiy kanalni olish (GET /channels/me)
    fetchMyChannel: async () => {
        set({ loading: true, error: null });
        try {
            const res = await api.get<Channel>("/channels/me");
            set({ myChannel: res.data, loading: false });
            return res.data;
        } catch {
            set({ myChannel: null, loading: false });
            return null;
        }
    },

    // 2. Yangi kanal yaratish (POST /channels)
    createChannel: async (data: ChannelRequest) => {
        set({ loading: true, error: null });
        try {
            const res = await api.post<Channel>("/channels", data);
            set({ myChannel: res.data, loading: false });
            return res.data;
        } catch (err: any) {
            const message = err.response?.data?.message || "Kanal yaratishda xatolik";
            set({ loading: false, error: message });
            throw new Error(message);
        }
    },

    // 3. Kanal tafsilotlarini yuklash (GET /channels/{channelId})
    fetchChannelDetails: async (channelId: string) => {
        set({ loading: true, error: null });
        try {
            const res = await api.get<Channel>(`/channels/${channelId}`);
            set({ currentChannel: res.data, loading: false });
            return res.data;
        } catch (err: any) {
            const message = err.response?.data?.message || "Kanalni yuklashda xatolik";
            set({ loading: false, error: message });
            return null;
        }
    },

    // 4. Kanal videolarini olish (GET /channels/{channelId}/videos)
    fetchChannelVideos: async (channelId: string) => {
        set({ loading: true, error: null });
        try {
            const res = await api.get<Video[]>(`/channels/${channelId}/videos`);
            set({ channelVideos: res.data, loading: false });
            return res.data;
        } catch (err: any) {
            set({ loading: false, error: err.response?.data?.message || "Videolarni yuklashda xatolik" });
            return [];
        }
    },

    // 5. Obuna bo'lish / bekor qilish (POST /channels/{channelId}/subscribe)
    toggleSubscription: async (channelId: string) => {
        try {
            const res = await api.post<{ subscribed: boolean; message: string }>(`/channels/${channelId}/subscribe`);
            const isSubscribed = res.data.subscribed;

            // Aktiv kanal obunachilar soni va holatini store'da darhol yangilash
            const { currentChannel } = get();
            if (currentChannel && currentChannel.id === channelId) {
                set({
                    currentChannel: {
                        ...currentChannel,
                        isSubscribed,
                        subscribersCount: isSubscribed
                            ? currentChannel.subscribersCount + 1
                            : Math.max(0, currentChannel.subscribersCount - 1),
                    },
                });
            }
            return isSubscribed;
        } catch (err: any) {
            throw new Error(err.response?.data?.message || "Obuna holatini o'zgartirishda xatolik");
        }
    },

    // 6. Obuna holatini tekshirish (GET /channels/{channelId}/is-subscribed)
    checkIsSubscribed: async (channelId: string) => {
        try {
            const res = await api.get<boolean>(`/channels/${channelId}/is-subscribed`);
            const { currentChannel } = get();
            if (currentChannel && currentChannel.id === channelId) {
                set({
                    currentChannel: { ...currentChannel, isSubscribed: res.data },
                });
            }
            return res.data;
        } catch {
            return false;
        }
    },

    // 7. Videoni kanalga biriktirish (POST /channels/videos/{videoId}/assign)
    assignVideoToChannel: async (videoId: string) => {
        set({ loading: true, error: null });
        try {
            await api.post(`/channels/videos/${videoId}/assign`);
            set({ loading: false });
        } catch (err: any) {
            const message = err.response?.data?.message || "Videoni biriktirishda xatolik";
            set({ loading: false, error: message });
            throw new Error(message);
        }
    },

    setMyChannel: (channel) => set({ myChannel: channel }),

    clearCurrentChannel: () => set({ currentChannel: null, channelVideos: [] }),
}));