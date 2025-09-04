import NotiComp from "./noti-comp";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNotificationContext } from "@/context/notifications-context";

const Notifications = ({ classNames }: { classNames?: { container?: string, body?: string } }) => {
    const { unread_count, notifications, fetchNextPage, hasNextPage, isLoading, isError, refetch, isRefetching, isFetchingNextPage, handleSetRead } = useNotificationContext()

    const { ref, inView } = useInView({
        initialInView: false,
        rootMargin: '0px 0px 50px 0px'
    })

    useEffect(() => {
        if (inView) {
            fetchNextPage()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inView])

    useEffect(() => {
        handleSetRead(true)
        
        return () => {
            handleSetRead(false)
        }
    }, [])


    return (
        <div className="w-full h-full">
            <h2 className="mt-4">{unread_count > 0 ? unread_count : "No New"} Notification{unread_count > 1 ? "s" : ""}</h2>
            <div className={cn("my-6 space-y-6 right-0 px-1 2xxs:px-2 w-full h-full", classNames?.body)}>
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