'use client'
import Comment from "./comment";
import { InfiniteCommentsType } from "@/types/comment";
import { AnimatePresence, motion } from "framer-motion";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { getComments } from "@/api/requests/comment/requests";
import { CircularProgress } from "@mui/material";
import { useReplyContext } from "@/context/reply-context";

type RepliesCompType = {
    parent_id: number,
    resource_type: string,
    resource_id: number,
}

const Replies: React.FC<RepliesCompType> = ({ resource_type, resource_id, parent_id }) => {
    const {
        handleReplyToComment,
        handleTopParent
    } = useReplyContext();

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
            queryKey: ['replies', parent_id],
            queryFn: ({ pageParam }) => getComments({ pageParam: pageParam, resource_id: resource_id, resource_type: resource_type, parent_id: parent_id }),
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
                        <h3>An unexpected Error occurred</h3>
                    )
                        :
                        comments?.pages?.[0]?.results?.length === 0 ? (
                            <div className="flex flex-col justify-center space-y-4 items-center mt-3 opacity-60">
                                <h4>Be the first to Reply!</h4>
                            </div>
                        )
                            :
                            <section id="comments" className="w-full space-y-4">
                                <AnimatePresence mode={"popLayout"}>
                                    {comments?.pages?.map(page =>
                                        page?.results?.map((comment) => {
                                            return (
                                                <motion.div
                                                    key={comment?.id}
                                                    layout
                                                    initial={{ scale: 0.9, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    exit={{ scale: 0.8, opacity: 0 }}
                                                    transition={{ type: "spring", duration: 0.5 }}
                                                >
                                                    <Comment comment={comment}/>
                                                </motion.div>
                                            )
                                        }))}
                                </AnimatePresence>
                            </section>
            }
        </>
    );
}

export default Replies;