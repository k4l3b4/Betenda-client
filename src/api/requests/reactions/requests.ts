import axiosInstance from "@/api/axios-instance"
import FormData from "form-data";

export type ReactType = {
    resource: 'article' | 'comment' | 'poem' | 'post' | 'saying';
    id: number;
    reaction?: string;
}

export const reactToResource = async ({ resource, id, reaction }: ReactType) => {
    const formData = new FormData();
    formData.append("reaction", reaction ?? "❤️");
    const response = await axiosInstance.post(`reactions/react?resource_type=${resource}&resource_id=${id}`, formData)
    return response?.data
}