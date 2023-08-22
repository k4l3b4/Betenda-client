import { SimpleUserType } from "./global";

export interface CreateReportType {
    report: string | null,
    report_type: string,
}

export interface Reports extends CreateReportType {
    id: number,
    user: SimpleUserType,
    created_at: string,
    content_type: string,
    object_id: number,
    content_object: string,
}


export interface PaginatedReportsType {
    total_items: number,
    page: number,
    page_size: number,
    results: Reports[]
}[]


export interface InfiniteReportsType {
    pageParams: Record<number, number>[],
    pages: PaginatedReportsType[]
}