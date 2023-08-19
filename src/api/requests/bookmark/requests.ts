import axiosInstance from "@/api/axios-instance"


interface AddToBookmarkType {
    resource_type: string,
    resource_id: number
}

type GetBookmarkItemsType = {
    pageParam?: number,
}


export const getBookmarkItems = async ({ pageParam = 1 }: GetBookmarkItemsType) => {
    const response = await axiosInstance.get(`bookmark/list${pageParam && `?page=${pageParam}&page_size=10`}`
    )
    return response?.data
}


export const addToBookmark = async ({ resource_type, resource_id }: AddToBookmarkType) => {
    const response = await axiosInstance.post(`bookmark/add?resource_type=${resource_type}&resource_id=${resource_id}`)
    return response?.data
}