import axiosInstance from "@/api/axios-instance"
import { CreateSentenceType } from "@/types/contributions"


export const registerSentence = async (values: CreateSentenceType) => {
    const response = await axiosInstance.post('contributions/sentence', values)
    return response?.data
}


export const updateSentence = async ({ values, id }: { values: CreateSentenceType, id: number }) => {
    const response = await axiosInstance.patch(`contributions/sentence?id=${id}`, values)
    return response?.data
}