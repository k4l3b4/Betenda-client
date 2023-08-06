import axiosInstance from "@/api/axios-instance"
import FormData from "form-data";

export type ReactType = {
    resource_type: 'article' | 'comment' | 'poem' | 'post' | 'saying';
    resource_id: number;
    reaction?: string;
}

export const reactToResource = async ({ resource_type, resource_id, reaction }: ReactType) => {
    const formData = new FormData();
    formData.append("reaction", reaction ?? "❤️");
    const response = await axiosInstance.post(`reactions/react?resource_type=${resource_type}&resource_id=${resource_id}`, formData)
    return response?.data
}