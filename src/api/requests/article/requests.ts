import axiosInstance from "@/api/axios-instance"
import { CreateArticleType } from "@/types/article"
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

export const getArticleBySlug = async ({ slug, sessionId = "" }: { slug: string, sessionId?: string }) => {
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