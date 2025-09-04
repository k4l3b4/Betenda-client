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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useUserContext } from "@/context/user-context";
import useBookMark from "@/hooks/use-bookmark-hook";
import { useDeletePost } from "@/hooks/use-delete-resource";
import useReactHook from "@/hooks/use-react-hook";
import { cn, formatNumberWithSuffix, guessMedia } from "@/lib/utils";
import { InfinitePostsType, PostType } from "@/types/post";
import { useQueryClient } from "@tanstack/react-query";
import { BookmarkIcon, HeartIcon, MessageCircle, MoreHorizontalIcon, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import HeadLessDialog from "../dialog/dialog";
import TippyTool from "../ui-utils/tooltip";
import { Separator } from "../ui/separator";


const PostData = ({ post, classNames, threadable = false, parent_slug = undefined }: { post: PostType, classNames?: { container?: string, profile?: string, content?: string, contentTxt?: string, contentMedia?: string, actions?: string }, threadable?: boolean, parent_slug?: string }) => {
    const queryClient = useQueryClient()
    const { User } = useUserContext()
    const [repliesCount, setRepliesCount] = useState<number>(post?.replies_count ?? 0);
    const [reactionCount, setReactionCount] = useState<number>(post?.reactions?.reaction_count[0]?.count ?? 0);
    const [reacted, setReacted] = useState<boolean>(post?.reactions?.user_reacted_with ? true : false)
    const [bookmarked, setBookmarked] = useState<boolean>(post?.bookmarked ? true : false)
    const [modalOpen, setModalOpen] = useState(false)

    const { mutate: deletePost, isLoading: isDeletingPost } = useDeletePost({ onSuccess: { deletedPostId: post?.id, parent: post?.parent, parent_slug: parent_slug } })

    const HandleDelete = (event: any) => {
        event.stopPropagation()
        deletePost({ id: post?.id })
    }

    const onBookMarkError = () => {
        setBookmarked(!bookmarked)
    }


    const handleAddToBookmark = () => {
        if (addingToBookMark) {
            return;
        }

        setBookmarked(!bookmarked)
        addtobookmark({ data: { resource_id: post?.id, resource_type: "post" } })
    }


    const router = useRouter()
    const pushToPost = () => {
        if (router.asPath !== `/post/${post?.slug}` && !isDeletingPost) {
            router.push(`/post/${post?.slug}`)
        }
    }

    const onReactionError = () => {
        if (reacted) {
            setReactionCount((prev) => prev - 1);
        }
        setReacted((prevReacted) => !prevReacted);
    }

    const { mutate, isLoading: isReacting } = useReactHook(onReactionError)
    const { addtobookmark, isLoading: addingToBookMark } = useBookMark({ onError: onBookMarkError })

    const handleReplySuccess = (data: any) => {
        setRepliesCount((prev) => prev + 1);
        console.log(data);
        const post = data?.data as PostType;

        if (threadable) {
            const currentData = queryClient.getQueryData<InfinitePostsType>(['posts']);

            if (currentData) {
                const updatedPages = currentData.pages?.map(page => {
                    const updatedResults = page?.results?.map((current) => {
                        if (current?.id === post?.parent) {
                            // Update the thread array of the post with the same parent ID
                            const updatedThread = [
                                ...current?.thread,
                                post, // Add the new reply post to the thread array
                            ];
                            return {
                                ...current,
                                thread: updatedThread,
                            };
                        }
                        return current;
                    });

                    return {
                        ...page,
                        results: updatedResults,
                    };
                });

                queryClient.setQueryData<InfinitePostsType>(['posts'], {
                    pages: updatedPages,
                    pageParams: currentData.pageParams,
                });
            }
        }
    };




    const handleReaction = ({ event, data }: { event: any, data: ReactType }) => {
        event?.stopPropagation();
        if (isReacting) {
            return;
        }
        if (!reacted) {
            setReactionCount((prev) => prev + 1);
        } else {
            if (reactionCount > 0) {
                setReactionCount((prev) => prev - 1);
            }
        }
        // Toggle the reacted state.
        setReacted((prevReacted) => !prevReacted);
        // Call the mutate function to trigger the API request.
        mutate(data);
    };

    function closeModal() {
        setModalOpen(false)
    }

    function openModal(event: any) {
        event.stopPropagation()
        setModalOpen(true)
    }
    return (
        <div className="w-full max-w-[650px]">
            <div className={cn(
                "hover:cursor-pointer w-full min-w-[300px] max-w-[650px] rounded-md xsm:pl-4 pt-4 my-2 h-fit",
                isDeletingPost ? "opacity-50 cursor-wait" : "",
                classNames?.container,
            )} onClick={pushToPost}>
                <div className="relative z-10">
                    <div className={cn("flex flex-row items-start gap-x-2", classNames?.profile)} id="user">
                        <Avatar className="w-12 h-12">
                            {post?.user?.profile_avatar ?
                                <AvatarImage src={post?.user?.profile_avatar} alt={post?.user?.user_name} />
                                :
                                null
                            }
                            <AvatarFallback>{`${post?.user?.first_name?.substring(0, 1)}${post?.user?.last_name?.substring(0, 1)}`}</AvatarFallback>
                        </Avatar>
                        <div className="flex items-baseline justify-between gap-x-2">
                            <div className="flex items-center justify-between">
                                <div>
                                    <ProfileHoverCard user={post?.user}>
                                        <Link onClick={(event) => event.stopPropagation()} href={`/${post?.user?.user_name}`} className="flex no-underline items-center z-50 space-x-2 px-1 transition-colors delay-100 duration-200 ease-in-out hover:bg-accent rounded-xl">
                                            <p className="font-medium line-clamp-1">{`${post?.user?.first_name} ${post?.user?.last_name}`}</p>
                                            <p className="text-xs text-muted-foreground line-clamp-1">{`@${post?.user?.user_name}`}</p>
                                        </Link>
                                    </ProfileHoverCard>
                                    <p className="text-xs text-muted-foreground line-clamp-1 px-1">{RelativeTime(post?.created_at)}</p>
                                </div>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button onClick={(event) => event.stopPropagation()} className="w-10 h-5 absolute right-1 top-1" variant="ghost" size="icon">
                                            <MoreHorizontalIcon />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-52" align="end">
                                        {/* report */}
                                        <Report resource_id={post?.id} resource_type="post">
                                            <DialogTrigger asChild>
                                                <Button className="w-full text-start flex !justify-start" onClick={(event) => event.stopPropagation()} variant="ghost">Report</Button>
                                            </DialogTrigger>
                                        </Report>
                                        {/* report */}
                                        {User?.id === post?.user?.id ?
                                            <>
                                                <Button className="w-full text-start flex !justify-start" onClick={(event) => event.stopPropagation()} variant="ghost">Edit</Button>
                                                <Button className="w-full text-start flex !justify-start" onClick={(event) => openModal(event)} variant="ghost">Delete</Button>
                                            </>
                                            :
                                            null
                                        }
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    </div>
                    <div className={cn("relative ml-10 max-w-full p-2 text-sm", classNames?.content)} id="post">
                        {post?.thread?.length > 0 ?
                            <div className="absolute rounded-full mt-[0px] w-[3px] h-full -left-[18px] bg-gray-400/50" />
                            :
                            null
                        }
                        <p className={cn("text-base mb-1 link", classNames?.contentTxt)}>{convertTextToLinks(post?.content as string)}</p>
                        {post?.media ?
                            guessMedia(post?.media) === "img" ?
                                <Image className={cn("w-full max-w-full object-cover h-full max-h-[400px] rounded-lg", classNames?.contentMedia)} src={post?.media} width="500" height="800" alt={post?.content ?? ""} />
                                :
                                guessMedia(post?.media) === "vid" ?
                                    <video controls onClick={(event) => event.stopPropagation()} muted className={cn("w-full max-w-full object-cover h-full max-h-[400px] rounded-lg", classNames?.contentMedia)} src={post?.media} />
                                    :
                                    null
                            :
                            null
                        }
                        <section onClick={(event) => event.stopPropagation()} id={`${post?.id}-actions`} className={cn("relative w-full flex flex-row justify-between mt-2", classNames?.actions)}>
                            <div className="group space-x-1.5 w-fit flex flex-row items-center text-center opacity-80">
                                <TippyTool asChild text="Reply">
                                    <div>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <button onClick={(event) => event?.stopPropagation()} className="left-0 w-8 h-8 rounded-full group-hover:bg-green-500/20 flex items-center justify-center">
                                                    <MessageCircle className="h-[1.2em] w-[1.2em] group-hover:text-green-600" />
                                                </button>
                                            </DialogTrigger>
                                            <DialogContent className="w-full flex justify-center rounded-md max-w-[700px] bg-foreground px-1">
                                                <CreatePost onSuccess={(data) => handleReplySuccess(data)} placeholder="Reply to your hearts content" parent_id={post?.id} />
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </TippyTool>
                                <p className={"text-xs font-normal opacity-80 group-hover:text-green-600"}>{formatNumberWithSuffix(repliesCount)}</p>
                            </div>
                            <div className="group space-x-1.5 w-fit flex flex-row items-center text-center opacity-80">
                                <TippyTool text="React">
                                    <button
                                        onClick={(event) => handleReaction({ event: event, data: { resource_type: "post", resource_id: post?.id } })}
                                        className="left-0 w-8 h-8 rounded-full group-hover:bg-pink-500/20 flex items-center justify-center"
                                    >
                                        <HeartIcon className={cn("h-[1.2em] w-[1.2em] group-hover:text-pink-600", reacted ? "text-pink-600 fill-pink-600" : "")} />
                                    </button>
                                </TippyTool>
                                <p className={cn("text-xs font-normal opacity-80 group-hover:text-pink-600", reacted ? "text-pink-600" : "")}>{formatNumberWithSuffix(reactionCount)}</p>
                            </div>
                            <div className="group opacity-80">
                                <TippyTool text="Share">
                                    <button className="left-0 w-8 h-8 rounded-full group-hover:bg-yellow-500/20 flex items-center justify-center">
                                        <Share2 className="h-[1.2em] w-[1.2em] group-hover:text-yellow-600" />
                                    </button>
                                </TippyTool>
                            </div>
                            <div className="group opacity-80">
                                <TippyTool text={bookmarked ? "Bookmarked!" : "Bookmark"}>
                                    <button onClick={handleAddToBookmark} className="w-8 h-8 rounded-full group-hover:bg-cyan-500/20 flex items-center justify-center">
                                        <BookmarkIcon className={cn("h-[1.2em] w-[1.2em] group-hover:text-cyan-600", bookmarked ? "text-cyan-600 fill-cyan-600" : "")} />
                                    </button>
                                </TippyTool>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
            {post?.thread?.length > 0 ? (
                <section id={`${post?.id}-thread`}>
                    {post?.thread?.slice(0, 2)?.map((post, index) => {
                        const showLine = index === 0 && post?.thread?.length > 1;
                        return (
                            <section className="relative" key={post?.id}>
                                {showLine ? (
                                    <div className="absolute rounded-full mt-[0px] w-[3px] h-full -left-[22px] bg-gray-400/50" />
                                ) : null}
                                <ReplyPost post={post} />
                            </section>
                        );
                    })}
                </section>
            ) : null}
            {post?.hasOwnProperty('thread') ?
                <Separator className="bg-slate-400 dark:bg-slate-700 bg-opacity-50 dark:bg-opacity-50" />
                :
                null
            }

            <HeadLessDialog title="Warning!" isOpen={modalOpen} onClose={closeModal} message="Are you sure you want to delete this post?, know that this action is permanent!" primaryButtonLabel="Yes, delete it" onPrimaryButtonClick={(event) => HandleDelete(event)} secondaryButtonLabel="No, " onSecondaryButtonClick={closeModal} />
        </div>
    );
}

export default PostData;