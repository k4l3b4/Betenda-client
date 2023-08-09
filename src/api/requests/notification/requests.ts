import axiosInstance from "@/api/axios-instance"

export const getNotifications = async ({ pageParam = 1 }: { pageParam?: number }) => {
    const response = await axiosInstance.get(`notifications/list?page=${pageParam}`)
    return response?.data
}

export const readNotifications = async ({ ids }: { ids: string }) => {
    const response = await axiosInstance.post('notifications/read', { 'ids': ids })
    return response?.data
}