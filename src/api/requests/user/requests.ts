import axiosInstance from "@/api/axios-instance"

export const getUser = async () => {
    const response = await axiosInstance.get("/users/current_user")
    return response?.data
}

export const followRequests = async () => {
    const response = await axiosInstance.get('users/requests')
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

export const updateProfile = async () => {
    const response = await axiosInstance.post('users/profile')
    return response.data
}

export const changePassword = async () => {
    const response = await axiosInstance.post('users/change_password')
    return response.data
}