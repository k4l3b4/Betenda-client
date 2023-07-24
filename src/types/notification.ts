import { UserType } from "@/types/global";

export interface NotificationType {
    id: number,
    user: UserType,
    message: string,
    message_type: string,
    is_read: boolean,
    created_at: string,
}


export interface PaginatedNotificationsType {
    total_items: number,
    page: number,
    page_size: number,
    results: NotificationType[]
}[]


export interface InfiniteNotificationsType {
    pageParams: Record<number, number>[],
    pages: PaginatedNotificationsType[]
}