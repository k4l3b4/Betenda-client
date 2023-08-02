'use client'
import Comment from "./comment";
import { InfiniteCommentsType } from "@/types/comment";
import { AnimatePresence, motion } from "framer-motion";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getComments } from "@/api/requests/comment/requests";
import { Fragment, useState } from "react";
import Replies from "@/components/comments/replies";
import { FrownIcon, GhostIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import CircularProgress from "@mui/material/CircularProgress";
import { useUserContext } from "@/context/user-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useReplyContext } from "@/context/reply-context";

type CommentCompType = {
    resource_type: string,
    resource_id: number,
}

const Comments: React.FC<CommentCompType> = ({ resource_type, resource_id }) => {
    const { commentInput, handleInputChange, handleReplyToComment, handleSaveComment, handleTopParent } = useReplyContext();

    const { User } = useUserContext()
    const [openReply, setOpenReply] = useState(false)

    const handleReplyOpen = () => {
        setOpenReply(!openReply)
    }

    const queryClient = useQueryClient()
    const {
        data,
        isError,
        isLoading,
        isFetchingNextPage,
        refetch,
        isRefetching,
        fetchNextPage,
        hasNextPage
    } = useInfiniteQuery(
        {
            queryKey: ['comments'],
            queryFn: ({ pageParam }) => getComments({ pageParam: pageParam, resource_id: resource_id, resource_type: resource_type }),
            getNextPageParam: (lastPage) => lastPage?.data?.page < lastPage?.data?.pages_count ? lastPage?.data?.page + 1 : undefined,
        }
    )

    const comments = data as InfiniteCommentsType

    return (
        <>
            {
                isLoading ?
                    <div className="flex flex-col justify-center items-center mt-5">
                        <CircularProgress color="inherit" thickness={4} size="2.3rem" />
                    </div>
                    :
                    isError ? (
                        <div className={"flex flex-col justify-center items-center mt-3"}>
                            <div className="opacity-60 mb-4 flex flex-col items-center">
                                <GhostIcon size={120} strokeWidth={1.3} />
                                <h3>An unexpected Error occurred</h3>
                            </div>
                        </div>
                    )
                        :
                        comments?.pages?.[0]?.results?.length === 0 ? (
                            <div className="flex flex-col justify-center space-y-4 items-center mt-3 opacity-60">
                                <FrownIcon size={120} strokeWidth={1.3} />
                                <h4>Be the first to comment!</h4>
                            </div>
                        )
                            :
                            <section id="comments" className="w-full space-y-6">
                                <h4>{`${comments?.pages?.[0]?.total_items} Comment(s)`}</h4>
                                <div className="my-2 flex items-center gap-x-2">
                                    <Avatar className="w-12 h-12 mt-1">
                                        <AvatarImage src={User?.profile_avatar} alt={`@${User?.user_name}`} />
                                        <AvatarFallback>{User?.first_name?.substring(0, 1) + " " + User?.last_name?.substring(0, 1)}</AvatarFallback>
                                    </Avatar>
                                    <div className="w-full flex items-center justify-between gap-x-2">
                                        <Input
                                            value={commentInput}
                                            onChange={handleInputChange}
                                            className="w-full bg-foreground font-medium py-4"
                                            placeholder="What do you think?" type="text"
                                        />
                                        <Button onClick={handleSaveComment} variant="ghost">Post</Button>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <AnimatePresence mode={"popLayout"}>
                                        {comments?.pages?.map(page =>
                                            page?.results?.map((comment) => {
                                                return (
                                                    <Fragment key={comment?.id}>
                                                        <motion.div
                                                            key={comment?.id}
                                                            layout

                                                            animate={{ scale: 1, opacity: 1 }}
                                                            exit={{ scale: 0.9, opacity: 0 }}
                                                            transition={{ type: "spring", duration: 0.5 }}
                                                        >
                                                            <Comment comment={comment} />
                                                            {comment?.reply_count > 0 && <button className="ml-[72px] mt-2 opacity-70 text-sm" onClick={handleReplyOpen}>{openReply ? `Hide replies` : `View replies(${comment?.reply_count})`}</button>}
                                                        </motion.div>
                                                        {(openReply && comment?.reply_count > 0) &&
                                                            <section className="ml-16">
                                                                <Replies resource_type={resource_type} resource_id={resource_id} parent_id={comment?.id} />
                                                            </section>
                                                        }
                                                    </Fragment>
                                                )
                                            }))}
                                    </AnimatePresence>
                                </div>
                            </section>
            }
        </>
    );
}

export default Comments;