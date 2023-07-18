import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useState } from 'react';
import { useReadLocalStorage } from 'usehooks-ts';
import { useMutation, useQuery } from '@tanstack/react-query';
import { loginUser } from '@/api/requests/auth/requests';
import { LoginType } from '@/types/auth';
import { getUser } from '@/api/requests/user/requests';
import ApiError from '@/types/api';


const UserContext = createContext<any>({});

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUserContext must be used within a UserProvider');
    }
    return context;
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter()
    const [callGetUser, setCallGetUser] = useState<boolean>(false)
    const [returnUrl, setReturnUrl] = useState<string>("/")
    const token = useReadLocalStorage('access')
    const { mutate: LoginUser, isLoading: LoginLoading, isError: LoginError, isSuccess: LoginSuccess } = useMutation({
        mutationFn: (values: LoginType) => loginUser(values),
        onSuccess: (data) => {
            const access = data?.data?.access
            const refresh = data?.data?.access
            localStorage.setItem('access', JSON.stringify(access));
            localStorage.setItem('refresh', JSON.stringify(refresh));
            window.location.replace(returnUrl)
        },
        onError: (error: ApiError) => {
            // handle error
        }
    })

    useEffect(() => {
        if (token) {
            setCallGetUser(true)
        }
    }, [setCallGetUser, token])


    const LogoutUser = () => {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        window.location.replace('/auth/login')
    }

    const { data: UserData, refetch: refetchUser, isLoading: LoadingUser, isError: userError, isFetching } = useQuery({
        queryKey: ['get-user'], queryFn: getUser,
        enabled: callGetUser,
        onError: (error: ApiError) => {
            if (error?.response?.status === 401) {
                LogoutUser()
                setCallGetUser(false)
                router.push('/auth/login')
            }
        }
    })
    const User = UserData?.data



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
};