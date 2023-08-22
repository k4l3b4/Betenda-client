import axiosInstance from "@/api/axios-instance"
import { RegisterLanguageType } from "@/types/contributions"

export const getLanguages = async () => {
    const response = await axiosInstance.get('contributions/langs')
    return response?.data
}

export const registerLanguage = async (values: RegisterLanguageType) => {
    const response = await axiosInstance.post('/contributions/langs', values)
    return response?.data
}