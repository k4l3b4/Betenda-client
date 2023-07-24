import useWebSocket from "@/hooks/useWebSocker";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { getNotifications } from "@/api/requests/notification/requests";
import { InfiniteNotificationsType, NotificationType } from "@/types/notification";
import NotiComp from "./noti-comp";
import { useEffect, useState } from "react";

const Notifications = ({ children }: { children: React.ReactElement }) => {
    const queryClient = useQueryClient();
    const { data, isError, isLoading, isFetchingNextPage, refetch, isRefetching, fetchNextPage, hasNextPage } = useInfiniteQuery({ queryKey: ['notifications'], queryFn: getNotifications, getNextPageParam: (lastPage) => lastPage?.data?.page < lastPage?.data?.pages_count ? lastPage?.data?.page + 1 : undefined, })
    const notifications = data as InfiniteNotificationsType
    const [updatedNotifications, setUpdatedNotifications] = useState<InfiniteNotificationsType | null>(null)

    const webSocketInstance = useWebSocket('notifications/');
    const { data: realtime, error } = webSocketInstance;
    const realtimeNotification = realtime as NotificationType
    console.log(JSON.stringify(realtimeNotification))


    useEffect(() => {
        // When new real-time notifications are received, update the state.
        if (realtimeNotification && realtimeNotification.id) {
            // Fetch the current query data
            const currentData = queryClient.getQueryData<InfiniteNotificationsType>(['notifications']);

            if (currentData) {
                // Add the new notification to the first page
                const updatedResults = [
                    realtimeNotification,
                    ...(currentData.pages[0]?.results || []),
                ];

                // Update the query data with the new notification added to the first page
                queryClient.setQueryData<InfiniteNotificationsType>(['notifications'], {
                    pages: [
                        {
                            total_items: currentData.pages[0]?.total_items, // Preserve the total_items value
                            page: currentData.pages[0]?.page, // Preserve the page value
                            page_size: currentData.pages[0]?.page_size, // Preserve the page_size value
                            results: updatedResults, // Update the property name to "results"
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
        <DropdownMenu>
            <DropdownMenuTrigger className="w-fit" asChild>
                {children}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="h-full max-h-[500px] overflow-y-auto mr-16 w-80">
                <DropdownMenuLabel>
                    <h1 className="text-lg font-bold">Notifications</h1>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Tabs defaultValue="all" className="w-full max-w-[320px]">
                    <TabsList className="h-fit flex flex-row flex-wrap justify-start items-center gap-2">
                        <TabsTrigger className="px-1.5 h-6" value="all">
                            All
                        </TabsTrigger>
                        <TabsTrigger className="px-1.5 h-6" value="replies">
                            Replies
                        </TabsTrigger>
                        <TabsTrigger className="px-1.5 h-6" value="mentions">
                            Mentions
                        </TabsTrigger>
                        <TabsTrigger className="px-1.5 h-6" value="comments">
                            Comments
                        </TabsTrigger>
                        <TabsTrigger className="px-1.5 h-6" value="friend_requests">
                            Friend requests
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent className="w-full" value="all">
                        <DropdownMenuGroup>
                            <NotiComp data={notifications} loading={isLoading} error={isError} refetch={refetch} refetching={isRefetching} />
                        </DropdownMenuGroup>
                    </TabsContent>
                    <TabsContent className="w-full" value="replies">
                        <DropdownMenuGroup>
                            replies
                        </DropdownMenuGroup>
                    </TabsContent>
                    <TabsContent className="w-full" value="mentions">
                        <DropdownMenuGroup>
                            mentions
                        </DropdownMenuGroup>
                    </TabsContent>
                    <TabsContent className="w-full" value="comments">
                        <DropdownMenuGroup>
                            comments
                        </DropdownMenuGroup>
                    </TabsContent>
                    <TabsContent className="w-full" value="friend_requests">
                        <DropdownMenuGroup>
                            friend requests
                        </DropdownMenuGroup>
                    </TabsContent>
                </Tabs>
                <DropdownMenuSeparator />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default Notifications;