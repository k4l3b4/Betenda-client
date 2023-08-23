import { getUserProfile } from "@/api/requests/user/requests";
import FeedLayout from "@/components/layout/feed-layout";
import Meta from "@/components/meta/meta";
import { DateAndMonth } from "@/components/time/Time";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserContext } from "@/context/user-context";
import useAcceptFollowRequest from "@/hooks/use-accept-follow-request-hook";
import useFollowUser from "@/hooks/use-follow-user-hook";
import useUnFollowUser from "@/hooks/use-unfollow-user-hook";
import { formatNumberWithSuffix, getCookieValue, updateQueryData } from "@/lib/utils";
import { UserType } from "@/types/global";
import { QueryClient, dehydrate, useQuery, useQueryClient } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useEffect, useState } from "react";

const UserPosts = dynamic(() => import('@/components/post/user-posts'), {
    loading: () => <div className="w-full h-full flex items-center justify-center"><p className="font-medium opacity-70">Loading...</p></div>,
})
const ProfileButtonFormatter = dynamic(() => import('@/components/profile-button-formatter/profile-button-formatter'))

const User = () => {
    const { User: requestUser } = useUserContext()
    const queryClient = useQueryClient()
    const router = useRouter()
    const { username } = router.query as ParsedUrlQuery
    const cleanUsername = username as string
    const { data } = useQuery({ queryKey: ['get_user_by_username', cleanUsername], queryFn: () => getUserProfile({ username: cleanUsername }), enabled: username ? true : false })
    const user = data?.data as UserType

    const [currentNumber, setCurrentNumber] = useState<number>(0);
    const endNumber: number = 100;

    useEffect(() => {
        setTimeout(() => {
            setCurrentNumber(75);
        }, 1000);
    }, []);


    const onSuccess = (newData: any, isArray = false) => {
        updateQueryData(queryClient, ['get_user_by_username', cleanUsername], newData, isArray);
    };

    const { follow, isLoading: following } = useFollowUser(user?.id, (newData) => {
        onSuccess(newData, false);
    });

    const { unFollow, isLoading: unFollowing } = useUnFollowUser(user?.id, (newData) => {
        onSuccess(newData, false); // Set to true if the new data is an array
    });

    const { accept, isLoading: accepting } = useAcceptFollowRequest(user?.id, (newData) => {
        onSuccess(newData, false); // Set to true if the new data is an array
    });

    return (
        <FeedLayout>
            <div className="my-4 w-full">
                <Meta title={`${username ?? "Loading"}'s account`} />
                <div className="flex flex-col justify-around gap-4 px-2 w-full">
                    <div className="w-full">
                        <div className="relative bg-foreground w-full lg:w-[650px] h-44 2xs:h-56 xsm:h-72 rounded-md">
                            <div className="w-full h-full">
                                {user?.profile_cover ?
                                    <Image className="w-full object-cover h-full rounded-md" src={user?.profile_cover} width="700" height="400" alt="" />
                                    :
                                    <div className="rounded-md z-30 w-full h-full hover:bg-gray-400/50 hover:cursor-pointer ease-in-out transition-all delay-100 duration-200" />
                                }
                            </div>
                            <div className="relative">
                                <Avatar className="absolute -top-12 xsm:-top-24 left-4 h-20 w-20 xsm:h-32 xsm:w-32 z-50 rounded-md ring-4 ring-background">
                                    <AvatarImage src={user?.profile_avatar} alt={`@${user?.user_name}`} />
                                    <AvatarFallback className="text-5xl font-bold rounded-md border-none">{`${user?.first_name?.substr(0, 1)}${user?.last_name?.substr(0, 1)}`}</AvatarFallback>
                                </Avatar>
                            </div>
                        </div>
                        <div className="flex flex-row items-start justify-between mt-4 pt-5 p-4 relative bg-foreground w-full lg:w-[650px] rounded-md">
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
                                <div>
                                    <div className="my-2">
                                        <p className="font-medium text-xs opacity-70">{`${DateAndMonth(user?.joined_date)}`}</p>
                                        <p className="font-medium">Joined date</p>
                                    </div>
                                </div>
                                <div className="w-fit mt-4 h-8 flex items-center justify-between">
                                    <div className="flex items-center mr-4 gap-x-2">
                                        <p className="font-bold text-xl">{formatNumberWithSuffix(user?.following_count) ?? "-"}</p>
                                        <p className="font-medium text-xs opacity-70">Following</p>
                                    </div>
                                    <Separator orientation="vertical" />
                                    <div className="flex items-center ml-4 gap-x-2">
                                        <p className="font-bold text-xl">{formatNumberWithSuffix(user?.followers_count) ?? "-"}</p>
                                        <p className="font-medium text-xs opacity-70">Followers</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                {requestUser?.id === user?.id && <Link href="/settings" className={buttonVariants({ variant: "default", className: "px-5 whitespace-nowrap no-underline" })}>Edit profile</Link>}
                                <ProfileButtonFormatter user={user} follow={follow} unfollow={unFollow} accept={accept} fulfilling={(following || unFollowing || accepting)} />
                            </div>
                        </div>
                        <div>
                            <Tabs defaultValue="post" className="lg:w-[650px] w-full mt-2">
                                <TabsList className="flex flex-row lg:w-[650px] w-full justify-around items-center bg-foreground gap-2 rounded-b-none p-2">
                                    <TabsTrigger className="active:bg-background" value="post">Posts</TabsTrigger>
                                    <TabsTrigger className="active:bg-background" value="reactions">Comments</TabsTrigger>
                                    <TabsTrigger className="active:bg-background" value="poem">Poems</TabsTrigger>
                                    <TabsTrigger className="active:bg-background" value="saying">Sayings</TabsTrigger>
                                </TabsList>
                                <TabsContent className="mt-0 w-full min-h-[350px] max-h-[600px] rounded-md rounded-t-none bg-foreground overflow-y-auto" value="post">
                                    <UserPosts username={user?.user_name} />
                                </TabsContent>
                                <TabsContent className="mt-0 w-full min-h-[350px] max-h-[600px] rounded-md rounded-t-none bg-foreground" value="reactions">
                                </TabsContent>
                                <TabsContent className="mt-0 w-full min-h-[350px] max-h-[600px] rounded-md rounded-t-none bg-foreground" value="poem">
                                </TabsContent>
                                <TabsContent className="mt-0 w-full min-h-[350px] max-h-[600px] rounded-md rounded-t-none bg-foreground" value="saying">
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                    {/* <div className="flex flex-col gap-y-4 w-full lg:w-[650px]">
                        <div className="relative bg-foreground w-full h-72 rounded-md p-2">
                            <h3>Contributions</h3>
                            <div className="min-h-[200px] h-fit flex flex-col items-center justify-center">
                                <div className="mt-3 flex flex-col items-center w-full space-y-2 px-2">
                                    <div className="w-full">
                                        <label className="font-medium opacity-50" htmlFor="word-contribution-progress">Words contributed</label>
                                        <Progress gradient="gradient1" name="word-contribution-progress" current={currentNumber} end={endNumber} />
                                    </div>
                                    <div className="w-full">
                                        <label className="font-medium opacity-50" htmlFor="sentence-contribution-progress">Sentences contributed</label>
                                        <Progress gradient="gradient8" name="sentence-contribution-progress" current={currentNumber} end={endNumber} />
                                    </div>
                                    <div className="w-full">
                                        <label className="font-medium opacity-50" htmlFor="saying-contribution-progress">Sayings contributed</label>
                                        <Progress gradient="gradient9" name="saying-contribution-progress" current={currentNumber} end={endNumber} />
                                    </div>
                                    <div className="w-full">
                                        <label className="font-medium opacity-50" htmlFor="poem-contribution-progress">Poems written</label>
                                        <Progress gradient="gradient5" name="poem-contribution-progress" current={currentNumber} end={endNumber} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative bg-foreground w-full h-72 rounded-md p-2">
                            <h3>Achievements</h3>
                            <div className="min-h-[200px] h-fit flex flex-col items-center justify-center">
                                <div className="mt-3 flex flex-col items-center w-full space-y-2 px-2">
                                    <div className="w-full">
                                        <label className="font-medium opacity-50" htmlFor="word-contribution-progress">Words contributed</label>
                                        <Progress gradient="gradient1" name="word-contribution-progress" current={currentNumber} end={endNumber} />
                                    </div>
                                    <div className="w-full">
                                        <label className="font-medium opacity-50" htmlFor="sentence-contribution-progress">Sentences contributed</label>
                                        <Progress gradient="gradient8" name="sentence-contribution-progress" current={currentNumber} end={endNumber} />
                                    </div>
                                    <div className="w-full">
                                        <label className="font-medium opacity-50" htmlFor="saying-contribution-progress">Sayings contributed</label>
                                        <Progress gradient="gradient9" name="saying-contribution-progress" current={currentNumber} end={endNumber} />
                                    </div>
                                    <div className="w-full">
                                        <label className="font-medium opacity-50" htmlFor="poem-contribution-progress">Poem written</label>
                                        <Progress gradient="gradient5" name="poem-contribution-progress" current={currentNumber} end={endNumber} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
        </FeedLayout>
    );
}

export default User;


export const getServerSideProps: GetServerSideProps = async (context) => {
    const { req } = context;
    const { username } = context.params as ParsedUrlQuery

    const sessionId = getCookieValue(req, 'sessionid')
    const queryClient = new QueryClient()
    await queryClient.prefetchQuery({ queryKey: ['get_user_by_username', username], queryFn: () => getUserProfile({ username: username as string, sessionId: sessionId }) })
    return {
        props: {
            dehydratedState: dehydrate(queryClient),
        },
    }
}