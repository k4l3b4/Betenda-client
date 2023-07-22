import axiosInstance from "@/api/axios-instance"
import { CreatePoemType } from "@/types/contributions"
import FormData from "form-data"


export const registerPoem = async (values: CreatePoemType) => {
    const data = new FormData()
    { values?.language ? data.append('language', values?.language) : undefined }
    { values?.poem ? data.append('poem', values?.poem) : undefined }
    { values?.recording ? data.append('media', values?.recording, values?.recording?.name) : undefined }
    const response = await axiosInstance.post('contributions/poem', data, {
        timeout: 90000,
        headers: {
            'Content-Type': values?.recording?.type
        }
    })
    
    return response?.data
}


export const updatePoem = async ({ values, id }: { values: CreatePoemType, id: number }) => {
    const data = new FormData()
    { values?.language ? data.append('language', values?.language) : undefined }
    { values?.poem ? data.append('poem', values?.poem) : undefined }
    { values?.recording ? data.append('media', values?.recording, values?.recording?.name) : undefined }
    const response = await axiosInstance.patch(`contributions/poem?id=${id}`, data, {
        timeout: 90000,
        headers: {
            'Content-Type': values?.recording?.type
        }
    })

    return response?.data
}