import axiosInstance from "@/api/axios-instance"
import { UpdateProfileType } from "@/types/auth"
import FormData from "form-data"

export const getUser = async () => {
    const response = await axiosInstance.get("users/current_user")
    return response?.data
}

export const getUserProfile = async ({ username, sessionId = "" }: { username: string, sessionId?: string }) => {
    const response = await axiosInstance.get(`users/get_user?username=${username}`, {
        headers: {
            Cookie: `sessionid=${sessionId}`,
        },
    })
    return response.data
}

export const getFollowRequests = async () => {
    const response = await axiosInstance.post('users/requests')
    return response.data
}

export const followUser = async (id: number) => {
    if (!id) {
        throw new Error("An id should be passed either directly to the useFollowRequest hook or to the follow function")
    }
    const response = await axiosInstance.post(`users/follow/${id}`)
    return response.data
}

export const unFollowUser = async (id: number) => {
    if (!id) {
        throw new Error("An id should be passed either directly to the useUnFollowUser hook or to the unFollow function")
    }
    const response = await axiosInstance.post(`users/unfollow/${id}`)
    return response.data
}


export const getMutualFriends = async () => {
    const response = await axiosInstance.get(`users/mutual_users`)
    return response.data
}

export const getTopAccounts = async () => {
    const response = await axiosInstance.get(`users/top_accounts`)
    return response.data
}

export const getAuthors = async (search?: string) => {
    const response = await axiosInstance.get(`users/search_author${search ? `?search=${search}` : ''}`)
    return response.data
}

export const acceptFollowRequest = async (id: number) => {
    if (!id) {
        throw new Error("An id should be passed either directly to the useAcceptFollowRequest hook or to the accept function")
    }
    const response = await axiosInstance.post(`users/accept/${id}`)
    return response.data
}

export const updateProfile = async (values: UpdateProfileType) => {
    const data = new FormData();
    if (values?.first_name) data.append('first_name', values.first_name);
    if (values?.last_name) data.append('last_name', values.last_name);
    if (values?.user_name) data.append('user_name', values.user_name);
    if (values?.bio) data.append('bio', values.bio);
    if (values?.birth_date) data.append('birth_date', values.birth_date);
    if (values?.email) data.append('email', values.email);
    if (values?.profile_avatar) {
        data.append('profile_avatar', values.profile_avatar, values.profile_avatar.name);
    }
    if (values?.profile_cover) {
        data.append('profile_cover', values.profile_cover, values.profile_cover.name);
    }
    const response = await axiosInstance.patch('users/profile', data, {
        timeout: 90000,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
};

export const changePassword = async () => {
    const response = await axiosInstance.post('users/change_password')
    return response.data
}