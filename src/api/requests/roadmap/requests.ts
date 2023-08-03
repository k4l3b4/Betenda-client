import axiosInstance from "@/api/axios-instance"

export const getGoal = async ({ pageParam = 1, sessionId = "" }: { pageParam?: number, sessionId?: string }) => {
    const response = await axiosInstance.get(`roadmap/goals?page=${pageParam}`, {
        headers: {
            Cookie: `sessionid=${sessionId}`,
        },
    })
    return response.data
}