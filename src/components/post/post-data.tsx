import { ReactType } from "@/api/requests/reactions/requests";
import convertTextToLinks from "@/components/convert-text-to-links/convert-text-to-links";
import CreatePost from "@/components/post/create-post";
import ReplyPost from "@/components/post/reply-post";
import ProfileHoverCard from "@/components/profile-hover-card/profile-hover-card";
import Report from "@/components/report/report";
import { RelativeTime } from "@/components/time/Time";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import useReactHook from "@/hooks/use-react-hook";
import { cn, formatNumberWithSuffix, guessMedia } from "@/lib/utils";
import { PostType } from "@/types/post";
import { motion } from 'framer-motion';
import { Heart, MessageCircle, MoreHorizontalIcon, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

const PostData = ({ post, className }: { post: PostType, className?: string }) => {
    const [repliesCount, setRepliesCount] = useState<number>(post?.replies_count ?? 0);
    const [reactionCount, setReactionCount] = useState<number>(post?.reactions?.reaction_count[0]?.count ?? 0);

    const [reacted, setReacted] = useState<boolean>(post?.reactions?.user_reacted_with ? true : false)
    const router = useRouter()
    const pushToPost = () => {
        if (router.asPath !== `/post/${post?.slug}`) {
            router.push(`/post/${post?.slug}`)
        }
    }

    const onError = () => {
        // If the API request fails and the user had reacted before, decrement the count.
        if (reacted) {
            setReactionCount((prev) => prev - 1);
        }
        setReacted((prevReacted) => !prevReacted);
    }

    const { mutate, isLoading: isReacting } = useReactHook(onError)

    const handleReplySuccess = () => {
        setRepliesCount((prev) => prev + 1);
    }

    const handleReaction = ({ event, data }: { event: any, data: ReactType }) => {
        event?.stopPropagation();
        if (isReacting) {
            // make the button inactive while the mutation is ongoing
            return;
        }

        // If the user hasn't reacted before, increment the count immediately before the API request.
        if (!reacted) {
            setReactionCount((prev) => prev + 1);
        } else {
            setReactionCount((prev) => prev - 1);
        }
        // Toggle the reacted state.
        setReacted((prevReacted) => !prevReacted);
        // Call the mutate function to trigger the API request.
        mutate(data);
    };


    return (
        <div className={cn(
            "hover:cursor-pointer w-full min-w-[350px] max-w-[650px] rounded-md p-4 pb-0 my-2 bg-foreground h-fit",
            className,
        )} onClick={pushToPost}>
            <div className="relative z-10">
                {post?.thread?.length > 0 ?
                    <span className="rounded-full absolute w-[3px] h-full left-5 top-12 bg-gray-400/50" />
                    :
                    null
                }
                <div className="flex items-center gap-x-2" id="user">
                    <Avatar>
                        {post?.user?.profile_avatar ?
                            <AvatarImage src={post?.user?.profile_avatar} alt={post?.user?.user_name} />
                            :
                            null
                        }
                        <AvatarFallback>{`${post?.user?.first_name?.substring(0, 1)}${post?.user?.last_name?.substring(0, 1)}`}</AvatarFallback>
                    </Avatar>
                    <div className="flex items-baseline gap-x-2">
                        <div className="flex items-center justify-between">
                            <div className="z-50">
                                <ProfileHoverCard user={post?.user}>
                                    <Link onClick={(event) => event.stopPropagation()} href={`/${post?.user?.user_name}`} className="font-medium no-underline hover:underline">{`${post?.user?.first_name} ${post?.user?.last_name}`}</Link>
                                </ProfileHoverCard>
                                <p className="text-xs text-muted-foreground">{`@${post?.user?.user_name}`}</p>
                            </div>
                            <Report resource_id={post?.id} resource_type="post">
                                <Button onClick={(event) => event.stopPropagation()} className="w-10 h-5 absolute right-1 top-1" variant="ghost" size="icon">
                                    <MoreHorizontalIcon />
                                </Button>
                            </Report>
                        </div>
                        <span className="text-xs">•</span>
                        <p className="text-xs text-muted-foreground">{RelativeTime(post?.created_at)}</p>
                    </div>
                </div>
                <div className="ml-10 max-w-full p-2 text-sm" id="post">
                    <p className="text-base mb-1 link">{convertTextToLinks(post?.content as string)}</p>
                    {post?.media ?
                        guessMedia(post?.media) === "img" ?
                            <Image className="w-full max-w-full object-cover h-auto rounded-md" src={post?.media} width="500" height="800" alt={post?.content ?? ""} />
                            :
                            guessMedia(post?.media) === "vid" ?
                                <video controls className="w-full max-w-full object-cover h-auto rounded-md" src={post?.media} />
                                :
                                null
                        :
                        null
                    }
                </div>
            </div>
            <section id={`${post?.id}-actions`} className="w-full flex flex-row justify-around">
                <div className="space-x-1 w-fit flex flex-row items-center text-center">
                    <motion.button
                        onClick={(event) => handleReaction({ event: event, data: { resource_type: "post", resource_id: post?.id } })}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <Heart fill={reacted ? "#DB2776" : "transparent"} className={cn("h-5 w-5", reacted ? "text-pink-600" : "")} />
                    </motion.button>
                    <p className="text-xs font-medium">{formatNumberWithSuffix(reactionCount)}</p>
                </div>
                <div className="flex flex-row items-center text-center">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button onClick={(event) => event?.stopPropagation()} className="space-x-1 w-fit" variant={null} size="icon">
                                <MessageCircle className="h-5 w-5" />
                                <p className="text-xs font-medium">{formatNumberWithSuffix(repliesCount)}</p>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="w-full rounded-md max-w-[700px] bg-foreground px-1">
                            <CreatePost onSuccess={handleReplySuccess} placeholder="Reply to your hearts content" parent_id={post?.id} />
                        </DialogContent>
                    </Dialog>
                </div>
                <div>
                    <Button variant={null} size="icon">
                        <Share2 className="h-5 w-5" />
                    </Button>
                </div>
            </section>
            {post?.thread?.length > 0 ?
                <section id={`${post?.id}-thread`}>
                    {post?.thread?.slice(0, 2)?.map((post, index) => {
                        const showLine = index == 0 && post?.thread?.length > 1;
                        return (
                            <section className="relative" key={post?.id}>
                                {showLine ?
                                    <span className="rounded-full absolute w-[3px] h-[80%] top-16 bg-gray-400/50" />
                                    :
                                    null
                                }
                                <ReplyPost post={post} />
                            </section>
                        )
                    })}
                </section>
                :
                null
            }
        </div>
    );
}

export default PostData;