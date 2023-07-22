import axiosInstance from "@/api/axios-instance"

export const getArticles = async ({ pageParam }: { pageParam?: number }) => {
    const response = await axiosInstance.get(`articles/list${pageParam && `?page=${pageParam}`}`)
    return response?.data
}