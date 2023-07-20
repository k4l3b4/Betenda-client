import axiosInstance from "@/api/axios-instance"
import { CreateWordType } from "@/types/contributions"


export const registerWord = async (values: CreateWordType) => {
    const response = await axiosInstance.post('contributions/word', values)
    return response?.data
}


export const updateWord = async ({ values, id }: { values: CreateWordType, id: number }) => {
    const response = await axiosInstance.post(`contributions/word?id=${id}`, values)
    return response?.data
}