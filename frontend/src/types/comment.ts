export interface CommentUser {
    id: string;
    name?: string;
    username?: string;
    email?: string;
    avatarUrl?: string;
}

export interface Comment {
    id: string;
    videoId: string;
    user: CommentUser;
    content: string;
    createdAt: string;
}

export interface CommentRequest {
    content: string;
}