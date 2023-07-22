import { UserType, ReactionsType } from "@/types/global"

export interface CreatePostType {
    content: string,
    media?: File,
}

export interface PostType {
    id: number,
    content?: string,
    slug: string,
    media?: string,
    media_type: string | null,
    user: UserType,
    reactions: ReactionsType,
    thread: PostType[],
    created_at: string,
    edited_at: string,
}


export interface PaginatedPostType {
    total_items: number,
    page: number,
    page_size: number,
    results: PostType[]
}[]


export interface InfinitePostsType {
    pageParams: Record<number, number>[],
    pages: PaginatedPostType[]
}