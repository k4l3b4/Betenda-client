import axiosInstance from "@/api/axios-instance"
import { uploadProgress } from "@/lib/utils"
import { CreatePostType } from "@/types/post"
import FormData from "form-data"

export const getPosts = async ({ pageParam = 1 }: { pageParam?: number }) => {
    const response = await axiosInstance.get(`posts/get_posts?page=${pageParam}`)
    return response.data
}

export const getPostsByTag = async ({ tag, pageParam = 1 }: { tag: string, pageParam?: number }) => {
    const response = await axiosInstance.get(`posts/posts_by_tag?tag=${tag}&page=${pageParam}`)
    return response.data
}

export const createPost = async ({ values, parent = undefined }: { values: CreatePostType, parent?: number | undefined }) => {
    const data = new FormData()
    { values?.content ? data.append('content', values?.content) : undefined }
    { values?.media ? data.append('media', values?.media, values?.media?.name) : undefined }

    const response = await axiosInstance.post(`posts/post${parent ? `?parent_id=${parent}` : ''}`, data, {
        onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
                (progressEvent?.loaded * 100) / progressEvent?.total
            );
            uploadProgress['create-post'] = percentCompleted; // Update the upload progress for the given key
        },
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