import { Button } from "@/components/ui/button";
import { InfiniteNotificationsType, NotificationType } from "@/types/notification";
import { RelativeTime } from "../time/Time";
import { CircularProgress } from "@mui/material";
import { cn } from "@/lib/utils";
import { MailOpen } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Image from "next/image";
import { Fragment } from "react";
import { Separator } from "../ui/separator";

type NotiCompType = {
    loading: boolean,
    error: boolean,
    refetch: () => void,
    refetching: boolean,
    classNames?: {
        post?: string,
        loading?: string,
        error?: string,
        noData?: string,
    }
    data: InfiniteNotificationsType | null
}

type GroupNotificationType = {
    todayNotifications: NotificationType[] | null,
    sevenDaysNotifications: NotificationType[] | null,
    thirtyDaysNotifications: NotificationType[] | null,
    earlierNotifications: NotificationType[] | null,
}


const NotiComp: React.FC<NotiCompType> = ({ loading, error, refetch, refetching, data, classNames }) => {
    const notifications = data?.pages
    // const [groupedNotifications, setGroupedNotifications] = useState<GroupNotificationType | null>(null)

    // const groupNotifications = (notifications: NotificationType[]) => {
    //     const today = new Date();
    //     today.setUTCHours(0, 0, 0, 0);
    //     const sevenDaysAgo = new Date(today);
    //     sevenDaysAgo.setUTCDate(today.getUTCDate() - 7);
    //     const thirtyDaysAgo = new Date(today);
    //     thirtyDaysAgo.setUTCDate(today.getUTCDate() - 30);

    //     const todayNotifications: NotificationType[] = [];
    //     const sevenDaysNotifications: NotificationType[] = [];
    //     const thirtyDaysNotifications: NotificationType[] = [];
    //     const earlierNotifications: NotificationType[] = [];

    //     notifications?.forEach(notification => {
    //         const createdDate = new Date(notification.created_at);

    //         if (createdDate >= today) {
    //             todayNotifications.push(notification);
    //         } else if (createdDate >= sevenDaysAgo && createdDate < today) {
    //             sevenDaysNotifications.push(notification);
    //         } else if (createdDate >= thirtyDaysAgo && createdDate < sevenDaysAgo) {
    //             thirtyDaysNotifications.push(notification);
    //         } else {
    //             earlierNotifications.push(notification);
    //         }
    //     });

    //     return {
    //         todayNotifications,
    //         sevenDaysNotifications,
    //         thirtyDaysNotifications,
    //         earlierNotifications,
    //     };
    // };

    // useEffect(() => {
    //     const notifications_list = notifications?.flatMap(page => page?.results?.notifications);
    //     const groupedNotifications = groupNotifications(notifications_list as NotificationType[]);
    //     if (groupedNotifications) {
    //         setGroupedNotifications(groupedNotifications)
    //     }
    // }, [notifications])



    return (
        <>
            {
                loading ?
                    <div className={cn("flex flex-col h-full justify-center items-center mt-5",
                        classNames?.loading
                    )}>
                        <CircularProgress color="inherit" thickness={4} size="2.3rem" />
                    </div>
                    :
                    error ? (
                        <div className="flex -full flex-col justify-center items-center mt-3">
                            Error
                            <Button onClick={refetch}>{refetching ? "Retrying" : "Retry"}</Button>
                        </div>
                    )
                        :
                        notifications?.[0]?.results?.notifications?.length === 0 ? (
                            <div className={cn("flex h-full flex-col justify-center space-y-4 items-center mt-3 opacity-60",
                                classNames?.noData
                            )}>
                                <MailOpen size={100} strokeWidth={1.3} />
                                <h4>Nothing here</h4>
                            </div>
                        )
                            :
                            notifications?.map(page =>
                                page?.results?.notifications?.map((noti) => {
                                    return (
                                        <Fragment key={noti?.id}>
                                            <div className="relative cursor-pointer flex flex-col justify-between items-start" id={`Notification #${noti?.id}`}>
                                                <div className="flex items-center w-full justify-between">
                                                    <div className="flex items-start gap-x-2 w-full">
                                                        <Avatar className="w-11 h-11" id="sender">
                                                            {noti?.sender?.profile_avatar ?
                                                                <AvatarImage src={noti?.sender?.profile_avatar} alt={noti?.sender?.user_name} />
                                                                :
                                                                null
                                                            }
                                                            <AvatarFallback>{`${noti?.sender?.first_name?.substring(0, 1)}${noti?.sender?.last_name?.substring(0, 1)}`}</AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex flex-col justify-start w-full">
                                                            <div onClick={(event) => event.stopPropagation()}>
                                                                <div className="flex items-center gap-x-2">
                                                                    <Link href={`/${noti?.sender?.user_name}`} className="font-bold no-underline hover:underline">{`${noti?.sender?.first_name} ${noti?.sender?.last_name}`}</Link>
                                                                    <div className="w-0.5 h-3 opacity-50 bg-gray-400 rounded-full" />
                                                                    <p className="opacity-60 text-xs">{RelativeTime(noti?.created_at)}</p>
                                                                </div>
                                                                <p className="link opacity-70 line-clamp-1">{noti?.message as string}</p>
                                                            </div>
                                                            {noti?.comment &&
                                                                <div className="relative pl-3 mt-1 w-full">
                                                                    <div className="w-0.5 h-4 absolute left-1 top-0 opacity-70 bg-gray-400 rounded-full" />
                                                                    <p className="opacity-50 text-sm w-full line-clamp-1"><span className="font-medium text-sm">You</span>: {noti?.comment?.comment}</p>
                                                                    <span className="sml:hidden 2xxs:block w-[100px] z-10 absolute bottom-0 right-0 h-full bg-gradient-to-r from-transparent via-transparent to-background" />
                                                                </div>
                                                            }
                                                        </div>
                                                    </div>
                                                    {
                                                        noti?.article?.image &&
                                                        <Image className="sml:hidden 2xxs:block w-20 h-[85px] object-cover z-50" src={noti?.article?.image} height="400" width="300" alt="" />
                                                    }
                                                    {
                                                        noti?.post?.media &&
                                                        <Image className="sml:hidden 2xxs:block w-16 h-[85px] object-cover z-50" src={noti?.post?.media} height="400" width="300" alt="" />
                                                    }
                                                </div>
                                            </div>
                                            <Separator className="bg-slate-400 dark:bg-slate-700 bg-opacity-50 dark:bg-opacity-50" />
                                        </Fragment>
                                    )
                                }))
            }
        </>


    );
}

export default NotiComp;