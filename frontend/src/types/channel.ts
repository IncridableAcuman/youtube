export interface Channel {
    id: string;
    name: string;
    description?: string;
    handle?: string;
    avatarUrl?: string;
    bannerUrl?: string;
    subscribersCount: number;
    isSubscribed?: boolean;
}

export interface ChannelRequest {
    name: string;
    description?: string;
    handle?: string;
}