import { ReactionsType, UserType } from "@/types/global";

export interface CreateArticleType {
    title: string,
    desc: string,
    body: string,
    image?: File,
    authors?: string,
    status: string,
    featured: boolean,
}

export interface UpdateArticleType {
    title?: string,
    desc?: string,
    body?: string,
    image?: File,
    authors?: string,
    status?: string,
    featured?: boolean,
}

export interface ArticleType {
    id: number,
    title: string,
    slug: string,
    desc: string,
    body: string,
    image?: string,
    authors: UserType[],
    status: string,
    featured: boolean,
    bookmarked: boolean,
    comments_count: number,
    published_date: string,
    modified_date: string,
    reactions: ReactionsType,
}

export interface SimpleArticleType {
    id: number,
    title: string,
    slug: string,
    image: string,
    status: string,
}


export interface PaginatedArticleType {
    total_items: number,
    page: number,
    page_size: number,
    results: ArticleType[]
}[]


export interface InfiniteArticlesType {
    pageParams: Record<number, number>[],
    pages: PaginatedArticleType[]
}