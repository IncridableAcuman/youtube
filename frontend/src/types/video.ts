export interface Video {
    id: string;
    title: string;
    description?: string;
    youtubeUrl: string;
    youtubeId: string;
    channelName?: string;
    channelAvatar?: string;
    views?: number;
    duration?: string;
    createdAt?: string;
}