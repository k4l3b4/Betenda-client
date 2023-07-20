import axiosInstance from "@/api/axios-instance"
import { CreatePoemType } from "@/types/contributions"


export const registerPoem = async (values: CreatePoemType) => {
    const response = await axiosInstance.post('contributions/poem', values)
    return response?.data
}


export const updatePoem = async ({ values, id }: { values: CreatePoemType, id: number }) => {
    const response = await axiosInstance.post(`contributions/poem?id=${id}`, values)
    return response?.data
}