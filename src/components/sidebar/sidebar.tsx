import { getMutualFriends, getTopAccounts } from "@/api/requests/user/requests";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { formatNumberWithSuffix, updateQueryData } from "@/lib/utils";
import { GhostIcon } from "lucide-react";
import { UserType } from "@/types/global";
import ProfileButtonFormatter from "../profile-button-formatter/profile-button-formatter";
import useFollowUser from "@/hooks/use-follow-user-hook";
import useUnFollowUser from "@/hooks/use-unfollow-user-hook";
import useAcceptFollowRequest from "@/hooks/use-accept-follow-request-hook";

const Sidebar = () => {
    const queryClient = useQueryClient()
    const { data: top_accounts } = useQuery({ queryKey: ['top_accounts'], queryFn: getTopAccounts })
    const { data: mutual_friends } = useQuery({ queryKey: ['mutual_friends'], queryFn: getMutualFriends })

    const onSuccess = (newData: any, isArray = false) => {
        updateQueryData(queryClient, ['top_accounts'], newData, isArray);
    };

    const { follow, isLoading: following } = useFollowUser(null, (newData) => {
        onSuccess(newData, true);
    });

    const { unFollow, isLoading: unFollowing } = useUnFollowUser(null, (newData) => {
        onSuccess(newData, true); // Set to true if the new data is an array
    });

    const { accept, isLoading: accepting } = useAcceptFollowRequest(null, (newData) => {
        onSuccess(newData, true); // Set to true if the new data is an array
    });


    return (
        <aside suppressHydrationWarning className="rounded-md w-full max-w-[300px] sticky left-0 top-[74px] h-[calc(70vh-100px)] p-2">
            <div className="bg-foreground p-2 rounded-md">
                <h2>Top accounts</h2>
                <ul className="ml-2 mt-2 space-y-2">
                    {top_accounts?.data?.length > 0 ?
                        top_accounts?.data?.map((user: UserType) => {
                            return (
                                <div key={user?.id} className="flex items-center gap-x-2" id="user">
                                    <Avatar>
                                        {user?.profile_avatar ?
                                            <AvatarImage src={user?.profile_avatar} alt={user?.user_name} />
                                            :
                                            null
                                        }
                                        <AvatarFallback>{`${user?.first_name?.substring(0, 1)}${user?.last_name?.substring(0, 1)}`}</AvatarFallback>
                                    </Avatar>
                                    <div className="w-full flex items-baseline gap-x-2">
                                        <div className="w-full flex items-center justify-between gap-x-2">
                                            <div>
                                                <Link onClick={(event) => event.stopPropagation()} href={`/${user?.user_name}`} className="font-medium no-underline hover:underline">{`${user?.first_name} ${user?.last_name}`}</Link>
                                                <p className="text-xs text-muted-foreground">{`@${user?.user_name}`}</p>
                                            </div>
                                            <ProfileButtonFormatter className="h-7 px-2" user={user} follow={() => follow(user?.id)} unfollow={() => unFollow(user?.id)} accept={() => accept(user?.id)} fulfilling={(following || unFollowing || accepting)} />
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                        :
                        <div className="w-full h-full flex flex-col items-center justify-center opacity-50 py-4">
                            <GhostIcon size={100} strokeWidth={1.3} />
                            <h4>No accounts</h4>
                        </div>
                    }
                </ul>
            </div>
            <div className="bg-foreground p-2 rounded-md mt-4">
                <h2>Who to follow</h2>
                {mutual_friends?.data?.length > 0 ?
                    mutual_friends?.data?.map((user: UserType) => {
                        return (
                            <div key={user?.id} className="flex items-center gap-x-2" id="user">
                                <Avatar>
                                    {user?.profile_avatar ?
                                        <AvatarImage src={user?.profile_avatar} alt={user?.user_name} />
                                        :
                                        null
                                    }
                                    <AvatarFallback>{`${user?.first_name?.substring(0, 1)}${user?.last_name?.substring(0, 1)}`}</AvatarFallback>
                                </Avatar>
                                <div className="flex items-baseline gap-x-2">
                                    <div className="w-full flex items-start justify-between gap-x-2">
                                        <div>
                                            <Link onClick={(event) => event.stopPropagation()} href={`/${user?.user_name}`} className="font-medium no-underline hover:underline">{`${user?.first_name} ${user?.last_name}`}</Link>
                                            <p className="text-xs text-muted-foreground">{`@${user?.user_name}`}</p>
                                        </div>
                                        <ProfileButtonFormatter user={user} follow={follow} unfollow={unFollow} accept={accept} fulfilling={(following || unFollowing || accepting)} />
                                    </div>
                                </div>
                            </div>
                        )
                    })
                    :
                    <div className="w-full h-full flex flex-col items-center justify-center opacity-50 py-4">
                        <GhostIcon size={100} strokeWidth={1.3} />
                        <h4>Looking cold</h4>
                    </div>
                }
            </div>
        </aside>
    );
}

export default Sidebar;