import axiosInstance from "@/api/axios-instance"
import { RegisterType } from "@/types/auth"

export const getUser = async () => {
    const response = await axiosInstance.get("users/current_user")
    return response?.data
}

export const getUserProfile = async ({ username }: { username: string }) => {
    const response = await axiosInstance.get(`users/get_user?username=${username}`)
    return response.data
}

export const getFollowRequests = async () => {
    const response = await axiosInstance.post('users/requests')
    return response.data
}

export const followUser = async (id: number) => {
    const response = await axiosInstance.post(`users/follow/${id}`)
    return response.data
}

export const unFollowUser = async (id: number) => {
    const response = await axiosInstance.post(`users/unfollow/${id}`)
    return response.data
}


export const acceptFollowRequest = async (id: number) => {
    const response = await axiosInstance.post(`users/accept/${id}`)
    return response.data
}

export const updateProfile = async (values: RegisterType) => {
    const response = await axiosInstance.patch('users/profile')
    return response.data
}

export const changePassword = async () => {
    const response = await axiosInstance.post('users/change_password')
    return response.data
}