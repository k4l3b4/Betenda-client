import axiosInstance from "@/api/axios-instance"

export const getLanguages = async () => {
    const response = await axiosInstance.get('contributions/langs')
    return response?.data
}