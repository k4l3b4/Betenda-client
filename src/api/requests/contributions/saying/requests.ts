import axiosInstance from "@/api/axios-instance"
import { CreateSayingType } from "@/types/contributions"


export const registerSaying = async (values: CreateSayingType) => {
    const response = await axiosInstance.post('contributions/saying', values)
    return response?.data
}


export const updateSaying = async ({ values, id }: { values: CreateSayingType, id: number }) => {
    const response = await axiosInstance.patch(`contributions/saying?id=${id}`, values)
    return response?.data
}