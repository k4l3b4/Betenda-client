import { SimpleUserType } from "@/types/global";
import { SimplePostType } from "@/types/post";
import { SimpleArticleType } from "@/types/article";
import { SimplePoemType } from "@/types/contributions";
import { SimpleCommentType } from "@/types/comment";

export interface NotificationType {
    id: number,
    user: SimpleUserType,
    sender: SimpleUserType | null,
    message: string,
    message_type: string,
    is_read: boolean,
    created_at: string,
    post: SimplePostType,
    article: SimpleArticleType,
    poem: SimplePoemType,
    comment: SimpleCommentType
}


export interface PaginatedNotificationsType {
    total_items: number,
    page: number,
    page_size: number,
    results: {
        unread_count: number,
        notifications: NotificationType[]
    }
}[]


export interface InfiniteNotificationsType {
    pageParams: Record<number, number>[],
    pages: PaginatedNotificationsType[]
}