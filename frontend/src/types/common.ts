// types/common.ts
export interface PageResponse<T> {
    content: T[];
    pageNo: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}

// types/user.ts
export interface User {
    id: string;
    fullName?: string;
    username?: string;
    email?: string;
    avatarUrl?: string;
    role?: string;
}