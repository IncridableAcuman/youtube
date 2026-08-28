// src/types/comment.ts
export interface Comment {
    id: string;
    userId: string;
    videoId: string;
    text: string;
    createdAt: string;
}

export interface CommentRequest {
    text: string;
}