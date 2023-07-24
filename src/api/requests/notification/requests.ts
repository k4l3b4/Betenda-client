import axiosInstance from "@/api/axios-instance"

export const getNotifications = async () => {
    const response = await axiosInstance.get("notifications/list")
    return response?.data
}