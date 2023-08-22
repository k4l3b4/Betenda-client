import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useState } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserType } from '@/types/global';
import { InfiniteNotificationsType, NotificationType } from '@/types/notification';
import useWebSocket from '@/hooks/use-web-socket-hook';
import { useUserContext } from './user-context';
import { getNotifications, readNotifications } from '@/api/requests/notification/requests';

interface NotificationContextValueType {
    unread_count: number,
    isError: boolean,
    isLoading: boolean,
    isFetchingNextPage: boolean,
    refetch: () => void,
    isRefetching: boolean,
    fetchNextPage: () => void,
    hasNextPage: boolean,
    notifications: InfiniteNotificationsType,
    handleSetRead: (value: boolean) => void
}



const NotificationContext = createContext<NotificationContextValueType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter()
    const queryClient = useQueryClient();
    const { User } = useUserContext()
    const [shouldRead, setShouldRead] = useState(false)
    const unread_count = User?.unread_count!

    const { mutate } = useMutation({ mutationFn: readNotifications })

    const { data, isError, isLoading, isFetchingNextPage, refetch, isRefetching, fetchNextPage, hasNextPage } = useInfiniteQuery(
        {
            queryKey: ['notifications'],
            queryFn: getNotifications,
            getNextPageParam: (lastPage) => lastPage?.page < lastPage?.pages_count ? lastPage?.page + 1 : undefined,
        }
    )

    const notifications = data as InfiniteNotificationsType

    useEffect(() => {
        if (notifications && shouldRead) {
            const lastPage = notifications.pages[notifications.pages.length - 1];
            const unreadNotifications = lastPage.results.notifications.filter(notification => !notification.is_read);

            if (unreadNotifications.length > 0) {
                const unreadIds = unreadNotifications.map(notification => notification.id).join(',');
                if (unreadIds) {
                    mutate({ ids: unreadIds },
                        {
                            onSuccess: () => {
                                queryClient.setQueryData<InfiniteNotificationsType | undefined>(['notifications'], (prevData) => {
                                    if (!prevData) return prevData;

                                    const newData = { ...prevData };
                                    const lastPage = newData.pages[newData.pages.length - 1];

                                    const unreadIdsArray: number[] = unreadIds.split(',').map(id => parseInt(id));

                                    lastPage.results.notifications.forEach(notification => {
                                        if (unreadIdsArray.includes(notification.id)) {
                                            notification.is_read = true;
                                        }
                                    });

                                    lastPage.results.unread_count -= unreadNotifications.length;

                                    return newData;
                                });
                                queryClient.setQueryData<{ data: UserType, message: string, timestamp: string } | undefined>(['get_user'], (prevData) => {
                                    if (!prevData) {
                                        return;
                                    }
                                    console.log("prevData:", prevData)
                                    const updatedData = {
                                        message: prevData.message,
                                        timestamp: prevData.timestamp,
                                        data: {
                                            ...prevData.data,
                                            unread_count: prevData?.data?.unread_count! - prevData?.data?.unread_count!,
                                        },
                                    };
                                    return updatedData
                                });
                            }
                        }
                    );
                }
            }
        }
    }, [notifications, mutate, shouldRead]);


    const handleSetRead = (value: boolean) => {
        setShouldRead(value)
    }


    const webSocketInstance = useWebSocket('notifications/');
    const { data: realtime, error } = webSocketInstance;
    const realtimeNotification = realtime as NotificationType

    useEffect(() => {
        if (realtimeNotification && realtimeNotification.id) {
            const currentData = queryClient.getQueryData<InfiniteNotificationsType>(['notifications']);

            if (!currentData || currentData.pages[0]?.results?.notifications.some(notification => notification.id === realtimeNotification.id)) {
                return; // Exit early since there is a duplication error this should handle it until we find and fix the bug
            }

            const updatedResults = [
                realtimeNotification,
                ...(currentData.pages[0]?.results?.notifications || []),
            ];
            queryClient.setQueryData<InfiniteNotificationsType>(['notifications'], {
                pages: [
                    {
                        total_items: currentData.pages[0]?.total_items,
                        page: currentData.pages[0]?.page,
                        page_size: currentData.pages[0]?.page_size,
                        results: {
                            unread_count: currentData.pages[0]?.results?.unread_count + 1,
                            notifications: updatedResults
                        },
                    },
                    ...currentData.pages.slice(1),
                ],
                pageParams: currentData.pageParams,
            });

            queryClient.setQueryData<{ data: UserType, message: string, timestamp: string } | undefined>(['get_user'], (prevData) => {
                if (!prevData) {
                    return;
                }
                console.log("prevData:", prevData)
                const updatedData = {
                    message: prevData.message,
                    timestamp: prevData.timestamp,
                    data: {
                        ...prevData.data,
                        unread_count: prevData?.data?.unread_count! + 1,
                    },
                };
                return updatedData
            });
        }
    }, [realtimeNotification, queryClient]);


    const value: NotificationContextValueType = {
        unread_count: unread_count,
        isError: isError,
        isLoading: isLoading,
        isFetchingNextPage: isFetchingNextPage,
        refetch: refetch,
        isRefetching: isRefetching,
        fetchNextPage: fetchNextPage,
        hasNextPage: hasNextPage as boolean,
        notifications: notifications,
        handleSetRead: handleSetRead
    }

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotificationContext = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotificationContext must be used within a NotificationProvider, please wrap your top most level component that need the NotificationContext with <NotificationProvider>');
    }
    return context;
};