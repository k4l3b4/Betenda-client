import { ReactionsType, SimpleUserType } from "@/types/global";

export interface CreateCommentType {
    comment: string,
}

export interface CommentType extends CreateCommentType {
    id: number,
    user: SimpleUserType,
    parent?: number,
    reply_to: SimpleUserType | null,
    reply_count: number,
    reactions: ReactionsType,
    created_at: string,
    updated_at: string,
}

export interface SimpleCommentType {
    id: number,
    comment: string,
}


export interface PaginatedCommentType {
    total_items: number,
    page: number,
    page_size: number,
    results: CommentType[]
}[]


export interface InfiniteCommentsType {
    pageParams: Record<number, number>[],
    pages: PaginatedCommentType[]
}



export type getCommentsType = {
    pageParam?: number
    parent_id?: number,
    resource_type: string,
    resource_id: number,
}


export type CommentRequestType = {
    resource_type: string,
    resource_id: number,
    values: CreateCommentType
}

export type ReplyRequestType = {
    parent: number,
    resource_type: string,
    resource_id: number,
    values: CreateCommentType
}