"use client"

import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts';
import axios, { AxiosError } from 'axios';
import { createContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axios';
import { ApiError } from '@/types/api';
import { UserType } from '@/types/global';
import useMutation from '@/hooks/use-mutator';
import { LoginType } from '@/types/login';



const UserContext = createContext<any>({});

export default UserContext;

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter()
    const [callGetUser, setCallGetUser] = useState<boolean>(false)
    const [returnUrl, setReturnUrl] = useState<string>("/")
    const token = useReadLocalStorage('token')
    const [User, setUser] = useState<UserType | null>(null)


    const login = async (data: LoginType) => {
        const response = await axiosInstance.post("me")
        return response.data
    }

    const { mutate: LoginUser, isLoading: LoginLoading, isError: IsLoginError, error: LoginError } = useMutation(login)

    const getUser = async () => {
        try {
            const response = await axiosInstance.get("me")
            setUser(response?.data)
        } catch (error: ApiError | any) {

        }
    }

    const followUser = async (user_id: number) => {
        try {
            const response = await axiosInstance.post("me")
            setUser(response?.data)
        } catch (error: ApiError | any) {

        }
    }

    const unfollowUser = async (user_id: number) => {
        const response = await axiosInstance.post(`users/follow/${user_id}`)
        return response?.data
    }

    const value = {
        User: User,
        LoadingUser: LoadingUser,
        isFetching: isFetching,
        refetchUser: refetchUser,
        userError: userError,
        callGetUser: callGetUser,

        LoginUser: LoginUser,
        LoginLoading: LoginLoading,
        LoginSuccess: LoginSuccess,
        LoginError: LoginError,

        LogoutUser: LogoutUser,

        returnUrl: returnUrl,
        setReturnUrl: setReturnUrl

    }
    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}