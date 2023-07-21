import { followUser, getUserProfile, unFollowUser } from "@/api/requests/user/requests";
import Meta from "@/components/meta/meta";
import { DateAndMonth } from "@/components/time/Time";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useUserContext } from "@/context/user-context";
import { formatNumberWithSuffix } from "@/lib/utils";
import { UserType } from "@/types/global";
import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useEffect, useState } from "react";

const User = () => {
    const { User } = useUserContext()
    const router = useRouter()
    const { username } = router.query as ParsedUrlQuery
    const cleanUsername = username as string
    const { data } = useQuery({ queryKey: ['get_user', cleanUsername], queryFn: () => getUserProfile({ username: cleanUsername }) })
    const user = data?.data as UserType
    const [followStatus, setFollowStatus] = useState<string>("Follow");
    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
    const isUserFollowingRequestedUser = user?.follows_requesting_user;
    const isRequestedUserFollowingUser = user?.requesting_user_follows;

    const { mutate: follow, isLoading: following } = useMutation({
        mutationFn: () => followUser(user?.id),
        onSuccess: () => {
            if (isUserFollowingRequestedUser && isRequestedUserFollowingUser) {
                setFollowStatus("Friends");
                setIsButtonDisabled(false);
            } else {
                setFollowStatus("Following");
            }
        }
    })

    const { mutate: unFollow, isLoading: unFollowing } = useMutation({
        mutationFn: () => unFollowUser(user?.id),
        onSuccess: () => {
            if (!isUserFollowingRequestedUser) {
                setFollowStatus("Follow");
                setIsButtonDisabled(true);
            } else {
                setFollowStatus("Following");
            }
        }
    })

    // When the component mounts or whenever 'user' changes, update the follow status and button disabled state.
    useEffect(() => {
        if (user?.id === User?.id) {
            setFollowStatus("Add friends");
            setIsButtonDisabled(false);
        }
        else if (isUserFollowingRequestedUser && isRequestedUserFollowingUser) {
            setFollowStatus("Friends");
            setIsButtonDisabled(false);
        } else if (isUserFollowingRequestedUser && !isRequestedUserFollowingUser) {
            setFollowStatus("Following");
            setIsButtonDisabled(false);
        } else if (!isUserFollowingRequestedUser && isRequestedUserFollowingUser) {
            setFollowStatus("Follow back");
            setIsButtonDisabled(true);
        } else if (!isUserFollowingRequestedUser && !isRequestedUserFollowingUser) {
            setFollowStatus("Follow");
            setIsButtonDisabled(true);
        }
    }, [isUserFollowingRequestedUser, isRequestedUserFollowingUser, user?.id, User?.id]);


    const handleClick = () => {
        switch (followStatus) {
            case "Follow":
            case "Follow back":
                follow();
                break;
            case "Following":
            case "Friends":
                unFollow();
                break;
            default:
                // Ignoring the click of users on their own profile
                break;
        }
    }


    return (
        <div>
            <Meta title={`${username ?? "Loading"}'s account`} />
            <div className="flex flex-row justify-around gap-2">
                <div>
                    <div className="relative bg-foreground w-[650px] h-72 rounded-md">
                        <div className="w-full h-full">
                            {user?.profile_cover ?
                                <Image className="w-full object-cover h-full" src="" width="700" height="400" alt="" />
                                :
                                <div className="rounded-md z-30 w-full h-full hover:bg-gray-400/50 hover:cursor-pointer ease-in-out transition-all delay-100 duration-200" />
                            }
                        </div>
                        <div className="relative">
                            <Avatar className="absolute -top-24 left-4 h-32 w-32 z-50 rounded-md ring-4 ring-background">
                                {user?.profile_cover ?
                                    <AvatarImage src={user?.profile_avatar} alt={`@${user?.user_name}`} />
                                    :
                                    <AvatarFallback className="text-5xl font-bold">{`${user?.first_name?.substr(0, 1)}${user?.last_name?.substr(0, 1)}`}</AvatarFallback>
                                }
                            </Avatar>
                        </div>
                    </div>
                    <div className="flex flex-row items-start justify-between top-4 pt-5 p-4 relative bg-foreground w-[650px] rounded-md">
                        <div>
                            <div>
                                <p className="font-bold text-3xl">{`${user?.first_name} ${user?.last_name}`}</p>
                                <p className="font-medium text-xs opacity-70">{`@${user?.user_name}`}</p>
                            </div>
                            {
                                user?.bio && <div className="my-2">
                                    <p className="font-medium text-xs opacity-70">{`${user?.bio}`}</p>
                                    <p className="font-medium">Bio</p>
                                </div>
                            }
                            <div className="w-fit mt-4 h-8 flex items-center justify-between">
                                <div className="flex items-center mr-4 gap-x-2">
                                    <p className="font-bold text-xl">{formatNumberWithSuffix(user?.following_count)}</p>
                                    <p className="font-medium text-xs opacity-70">Following</p>
                                </div>
                                <Separator orientation="vertical" />
                                <div className="flex items-center ml-4 gap-x-2">
                                    <p className="font-bold text-xl">{formatNumberWithSuffix(user?.followers_count)}</p>
                                    <p className="font-medium text-xs opacity-70">Followers</p>
                                </div>
                            </div>
                            <div>
                                <div className="my-2">
                                    <p className="font-medium text-xs opacity-70">{`${DateAndMonth(user?.joined_date)}`}</p>
                                    <p className="font-medium">Joined date</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <Button onClick={handleClick} disabled={isButtonDisabled}>{followStatus}</Button>
                        </div>
                    </div>
                </div>
                <div>

                </div>
            </div>
        </div>
    );
}

export default User;