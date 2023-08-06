import axiosInstance from "@/api/axios-instance"
import { CreateReportType } from "@/types/report"

export const reportResource = async ({ values, resource_type, resource_id }: { values: CreateReportType, resource_type: string, resource_id: number }) => {
    const response = await axiosInstance.post(`reports/report?resource_type=${resource_type}&resource_id=${resource_id}`, values)
    return response?.data
}

export const getReports = async ({ resource_type, resource_id, pageParam = 1 }: { resource_type: string, resource_id: number, pageParam?: number }) => {
    const response = await axiosInstance.get(`reports/list?resource_type=${resource_type}&resource_id=${resource_id}&page=${pageParam}`)
    return response?.data
}