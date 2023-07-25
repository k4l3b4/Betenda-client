import { acceptFollowRequest, followUser, getUserProfile, unFollowUser } from "@/api/requests/user/requests";
import Meta from "@/components/meta/meta";
import ProfileButtonFormatter from "@/components/profile-button-formatter/profile-button-formatter";
import { DateAndMonth } from "@/components/time/Time";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useUserContext } from "@/context/user-context";
import { formatNumberWithSuffix, getCookieValue } from "@/lib/utils";
import { UserType } from "@/types/global";
import { QueryClient, dehydrate, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useEffect, useState } from "react";

const User = () => {
    const queryClient = useQueryClient()
    const { User } = useUserContext()
    const router = useRouter()
    const { username } = router.query as ParsedUrlQuery
    const cleanUsername = username as string
    const { data } = useQuery({ queryKey: ['get_user_by_username', cleanUsername], queryFn: () => getUserProfile({ username: cleanUsername }), enabled: username ? true : false })
    const user = data?.data as UserType

    const { mutate: follow, isLoading: following } = useMutation({
        mutationFn: () => followUser(user?.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['get_user_by_username'] })
        }
    })

    const { mutate: unFollow, isLoading: unFollowing } = useMutation({
        mutationFn: () => unFollowUser(user?.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['get_user_by_username'] })
        }
    })

    const { mutate: accept, isLoading: accepting } = useMutation({
        mutationFn: () => acceptFollowRequest(user?.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['get_user_by_username'] })
        }
    })

    return (
        <div className="mt-4">
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
                                <AvatarImage src={user?.profile_avatar} alt={`@${user?.user_name}`} />
                                <AvatarFallback className="text-5xl font-bold">{`${user?.first_name?.substr(0, 1)}${user?.last_name?.substr(0, 1)}`}</AvatarFallback>
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
                                    <p className="font-bold text-xl">{formatNumberWithSuffix(user?.following_count) ?? "-"}</p>
                                    <p className="font-medium text-xs opacity-70">Following</p>
                                </div>
                                <Separator orientation="vertical" />
                                <div className="flex items-center ml-4 gap-x-2">
                                    <p className="font-bold text-xl">{formatNumberWithSuffix(user?.followers_count)?? "-"}</p>
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
                            <ProfileButtonFormatter user={user} follow={follow} unfollow={unFollow} accept={accept} fulfilling={(following || unFollowing || accepting)} />
                        </div>
                    </div>
                </div>
                <div>

                </div>
            </div>
        </div >
    );
}

export default User;


export const getServerSideProps: GetServerSideProps = async (context) => {
    const { req } = context;
    const { username } = context.params as ParsedUrlQuery
    console.log(username)

    // Get the value of the 'sessionId' cookie
    const sessionId = getCookieValue(req, 'sessionid')
    console.log(sessionId)
    const queryClient = new QueryClient()
    await queryClient.prefetchQuery({ queryKey: ['get_user_by_username', username], queryFn: () => getUserProfile({ username: username as string, sessionId: sessionId }) })
    return {
        props: {
            dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
        },
    }
}