import { ArticleType } from "./article"
import { PoemType } from "./contributions"
import { PostType } from "./post"

export interface BookMarkType {
    id: number,
    content_data: PostType | ArticleType | PoemType,
    content_type_name: "poem" | "post" | "article",
    added_date: string,
}

export interface PaginatedBookMarkType {
    total_items: number,
    page: number,
    page_size: number,
    results: BookMarkType[]
}[]

export interface InfiniteBookMarkType {
    pageParams: Record<number, number>[],
    pages: PaginatedBookMarkType[]
}