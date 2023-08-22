import axiosInstance from "@/api/axios-instance"
import { CommentRequestType, ReplyRequestType, getCommentsType } from "@/types/comment"

export const getComments = async ({ pageParam = 1, resource_type, resource_id, parent_id }: getCommentsType) => {
    const response = await axiosInstance.get(`comments/list?resource_type=${resource_type}&resource_id=${resource_id}${parent_id ? `&parent_id=${parent_id}` : ''}${pageParam && `&page=${pageParam}&page_size=10`}`
    )
    return response?.data
}


export const createComment = async ({ values, resource_type, resource_id }: CommentRequestType) => {
    const response = await axiosInstance.post(`comments/comment?resource_type=${resource_type}&resource_id=${resource_id}`, values)
    return response?.data
}


export const createReply = async ({ values, resource_type, resource_id, parent }: ReplyRequestType) => {
    const response = await axiosInstance.post(`comments/reply?resource_type=${resource_type}&resource_id=${resource_id}&parent=${parent}`, values)
    return response?.data
}


export const updateCommentRequest = async ({ id }: { id: number}) => {
    const response = await axiosInstance.patch(`comments/update?id=${id}`)
    return response?.data
}


export const deleteCommentRequest = async ({ id }: { id: number}) => {
    const response = await axiosInstance.delete(`comments/delete?comment_id=${id}`)
    return response?.data
}