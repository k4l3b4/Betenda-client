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

export const getPoems = async ({ pageParam = 1 }: { pageParam?: number }) => {
    const response = await axiosInstance.get(`contributions/poems?page=${pageParam}`)
    return response?.data
}


export const getPoemBySlug = async ({ slug }: { slug: string }) => {
    const response = await axiosInstance.get(`contributions/poems/${slug}`)
    return response?.data
}

export const deletePoemRequest = async ({ id }: { id: number }) => {
    const response = await axiosInstance.get(`contributions/poem?id=${id}`)
    return response?.data
}