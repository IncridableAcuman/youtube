// src/types/video.ts
export interface Video {
    id: string;
    userId: string;
    title: string;
    description: string;
    youtubeUrl: string;
    youtubeKey: string;
    duration: string;
    views: number;
    likes: number;
    dislikes: number;
    createdAt: string;
    thumbnailUrl: string;
}

export interface PageResponse<T> {
    content: T[];
    pageNo: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}

export interface VideoRequest {
    title: string;
    description: string;
    youtubeUrl: string;
    duration: string;
}