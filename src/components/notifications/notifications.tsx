import useWebSocket from "@/hooks/use-web-socket-hook";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getNotifications, readNotifications } from "@/api/requests/notification/requests";
import { InfiniteNotificationsType, NotificationType } from "@/types/notification";
import NotiComp from "./noti-comp";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Notifications = ({ classNames }: { classNames?: { container?: string, body?: string } }) => {
    const queryClient = useQueryClient();

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
        if (notifications) {
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
                            }
                        }
                    );
                }
            }
        }
    }, [notifications, mutate]);



    const webSocketInstance = useWebSocket('notifications/');
    const { data: realtime, error } = webSocketInstance;
    const realtimeNotification = realtime as NotificationType

    const { ref, inView } = useInView({
        initialInView: false,
        rootMargin: '0px 0px 50px 0px'
    })

    useEffect(() => {
        if (inView) {
            fetchNextPage()
        }
        console.log(inView)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inView])

    useEffect(() => {
        if (realtimeNotification && realtimeNotification.id) {
            const currentData = queryClient.getQueryData<InfiniteNotificationsType>(['notifications']);

            if (currentData) {
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
            }
            console.log(currentData)
        }
    }, [realtimeNotification, queryClient]);


    return (
        <div className="w-full h-full">
            {notifications?.pages?.[0]?.results?.unread_count > 0 &&
                <span className="z-50 rounded-full text-[11px] font-medium absolute h-4 w-4 bg-red-500 flex items-center justify-center ring ring-foreground top-0.5 left-1 text-white">{notifications?.pages?.[0]?.results?.unread_count}</span>
            }

            <h2 className="mt-4">{notifications?.pages?.[0]?.results?.unread_count > 0 ? notifications?.pages?.[0]?.results?.unread_count : "No New"} Notifications</h2>
            <div className={cn("my-6 overflow-y-auto space-y-6 right-0 px-2 w-full h-full", classNames?.body)}>
                <NotiComp data={notifications} loading={isLoading} error={isError} refetch={refetch} refetching={isRefetching} />
                {hasNextPage &&
                    <div ref={ref} className="flex justify-center">
                        <Button
                            variant="secondary"
                            className="justify-self-center my-5 disabled:cursor-not-allowed disabled:opacity-80 font-semibold px-5 py-2 rounded text-opacity-90"
                            onClick={() => fetchNextPage()}
                            disabled={!hasNextPage || isFetchingNextPage}
                        >
                            {isFetchingNextPage
                                ? 'Loading more...'
                                : hasNextPage
                                    ? 'Load more'
                                    : 'All caught up'}
                        </Button>
                    </div>
                }
            </div>
        </div>
    );
}

export default Notifications;