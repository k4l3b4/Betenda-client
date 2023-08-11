import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useState } from 'react';
import { useReadLocalStorage } from 'usehooks-ts';
import { useMutation, useQuery } from '@tanstack/react-query';
import { loginUser } from '@/api/requests/auth/requests';
import { LoginType } from '@/types/auth';
import { getUser } from '@/api/requests/user/requests';
import { UserContextValue, UserType } from '@/types/global';
import { AxiosError } from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { renderErrors } from '@/lib/utils';


const UserContext = createContext<UserContextValue | undefined>(undefined);

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUserContext must be used within a UserProvider, please wrap your top most level component that need the UserContext with <UserProvider>');
    }
    return context;
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const { toast } = useToast()
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
        onError: (error: AxiosError) => {
            console.log(error);
            if (!error?.response) {
                if (error?.code === "ERR_BAD_REQUEST") {
                    toast({
                        variant: "destructive",
                        title: "Oops",
                        description: "Malformed syntax or invalid request message framing"
                    });
                } else if (error?.code === "ERR_CONNECTION_TIMED_OUT") {
                    toast({
                        variant: "destructive",
                        title: "Oops",
                        description: "Connection timed out"
                    });
                }
            } else if (error?.response) {
                toast({
                    variant: "destructive",
                    title: "Oops",
                    description: (
                        <div dangerouslySetInnerHTML={{ __html: renderErrors(error?.response?.data) }} />
                    )
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "Oops",
                    description: "An error occurred"
                });
            }
        }
    })


    const handleSetReturnUrl = (url: string) => {
        setReturnUrl(url)
    }


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
        queryKey: ['get_user'], queryFn: getUser,
        enabled: callGetUser,
        onError: (error: AxiosError) => {
            if (error?.response?.status === 401) {
                LogoutUser()
                setCallGetUser(false)
                router.push('/auth/login')
            }
        }
    })
    const User = UserData?.data



    const value = {
        // fetching the user
        User: User as UserType,
        LoadingUser: LoadingUser,
        isFetching: isFetching,
        refetchUser: refetchUser,
        userError: userError,
        callGetUser: callGetUser,
        // login
        LoginUser: LoginUser,
        LoginLoading: LoginLoading,
        LoginSuccess: LoginSuccess,
        LoginError: LoginError,

        LogoutUser: LogoutUser,
        // redirect after login
        returnUrl: returnUrl,
        handleSetReturnUrl: handleSetReturnUrl

    }

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};