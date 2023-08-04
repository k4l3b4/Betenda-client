import axiosInstance from "@/api/axios-instance"
import { CreatePostType } from "@/types/post"
import FormData from "form-data"

export const getPosts = async ({ pageParam = 1, sessionId = "" }: { pageParam?: number, sessionId?: string }) => {
    const response = await axiosInstance.get(`posts/get_posts?page=${pageParam}`, {
        headers: {
            Cookie: `sessionid=${sessionId}`,
        },
    })
    return response.data
}

export const getUserPosts = async ({ pageParam = 1, username }: { pageParam?: number, username: string }) => {
    const response = await axiosInstance.get(`posts/posts_by_user?username=${username}&page=${pageParam}`, {
    })
    return response.data
}

export const getPostBySlug = async ({ slug, sessionId = "" }: { slug: string, sessionId?: string }) => {
    const response = await axiosInstance.get(`posts/get_post/${slug}`, {
        headers: {
            Cookie: `sessionid=${sessionId}`,
        },
    })
    return response.data
}

export const getPostReplies = async ({ parent, pageParam = 1 }: { parent: number, pageParam?: number }) => {
    const response = await axiosInstance.get(`posts/get_replies?parent=${parent}&page=${pageParam}`)
    return response.data
}

export const getPostsByTag = async ({ tag, pageParam = 1, sessionId = "" }: { tag: string, pageParam?: number, sessionId?: string }) => {
    const response = await axiosInstance.get(`posts/posts_by_tag?tag=${tag}&page=${pageParam}`, {
        headers: {
            Cookie: `sessionid=${sessionId}`,
        },
    })
    return response.data
}

export const createPost = async ({ values, parent = undefined }: { values: CreatePostType, parent?: number | undefined }) => {
    const data = new FormData()
    if (values?.content) data.append('content', values.content);
    if (values?.media) {
        data.append('media', values.media, values.media.name);
    }

    const response = await axiosInstance.post(`posts/post${parent ? `?parent_id=${parent}` : ''}`, data, {
        timeout: 90000,
        headers: {
            'Content-Type': values.media?.type
        }
    })

    return response.data
}


export const updatePost = async ({ values, id }: { values: CreatePostType, id: number }) => {
    const data = new FormData()

    data.append('id', id)
    { values?.content ? data.append('content', values?.content) : undefined }
    { values?.media ? data.append('media', values?.media, values?.media?.name) : undefined }

    const response = await axiosInstance.patch("posts/post", data, {
        timeout: 90000,
        headers: {
            'Content-Type': values.media?.type
        }
    })
    return response.data
}


export const deletePost = async ({ id }: { id: number }) => {
    const response = await axiosInstance.delete(`posts/post?id=${id}`)
    return response.data
}