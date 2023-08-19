import axiosInstance from "@/api/axios-instance"
import { CreateArticleType, UpdateArticleType } from "@/types/article"
import FormData from "form-data"

export const getArticles = async ({ pageParam = 1, sessionId = "" }: { pageParam?: number, sessionId?: string }) => {
    const response = await axiosInstance.get(`articles/list${pageParam && `?page=${pageParam}`}`,
        {
            headers: {
                Cookie: `sessionid=${sessionId}`,
            },
        }
    )
    return response?.data
}

export const getArticleBySlug = async ({ slug, sessionId = null }: { slug: string, sessionId?: string | null }) => {
    const response = await axiosInstance.get(`articles/${slug}`, {
        headers: {
            Cookie: `sessionid=${sessionId}`,
        },
    })
    return response?.data
}

export const getTrendingArticles = async () => {
    const response = await axiosInstance.get(`articles/trending`)
    return response?.data
}

export const getArticlesByTag = async ({ tag, pageParam = 1 }: { tag: string, pageParam?: number }) => {
    const response = await axiosInstance.get(`articles/articles_by_tag?tag=${tag}&page=${pageParam}`)
    return response.data
}


export const searchArticles = async ({ slug, pageParam = 1 }: { slug: string, pageParam?: number }) => {
    const response = await axiosInstance.get(`articles/search?search=${slug}&page=${pageParam}`)
    return response.data
}


export const createArticle = async ({ values }: { values: CreateArticleType }) => {
    const data = new FormData()
    data.append('title', values.title);
    data.append('desc', values.desc);
    data.append('body', values.body);
    data.append('status', values.status);
    data.append('featured', values.featured);
    data.append('authors', values?.authors);
    if (values?.image) {
        data.append('image', values.image, values.image.name);
    }

    const response = await axiosInstance.post(`articles/article`, data, {
        timeout: 90000,
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    })

    return response.data
}


export const updateArticle = async ({ values, id }: { values: UpdateArticleType, id: number }) => {
    const data = new FormData()
    { values.title ? data.append('title', values.title) : null }
    { values.desc ? data.append('desc', values.desc) : null }
    { values.body ? data.append('body', values.body) : null }
    { values.status ? data.append('status', values.status) : null }
    { values.featured ? data.append('featured', values.featured) : null }
    { values.authors ? data.append('authors', values?.authors) : null }
    if (values?.image) {
        data.append('image', values.image, values.image.name);
    }

    const response = await axiosInstance.patch(`articles/article?id=${id}`, data, {
        timeout: 90000,
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    })

    return response.data
}


export const deleteArticleRequest = async ({ id }: { id: number }) => {
    const response = await axiosInstance.delete(`articles/article?id=${id}`)
    return response?.data
}