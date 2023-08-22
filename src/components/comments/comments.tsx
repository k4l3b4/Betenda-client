'use client'
import { getComments } from "@/api/requests/comment/requests";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useReplyContext } from "@/context/reply-context";
import { useUserContext } from "@/context/user-context";
import { InfiniteCommentsType } from "@/types/comment";
import CircularProgress from "@mui/material/CircularProgress";
import { useInfiniteQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { FrownIcon, GhostIcon } from "lucide-react";
import { Fragment, useEffect, useRef } from "react";
import Comment from "@/components/comments/comment";
import LoadMoreHider from "@/components/ui-utils/lead-more-hider";
import LoadMore from "@/components/load-more/load-more";


const Comments = () => {
    const { commentInput, handleInputChange, handleSaveComment, inputError, setInputError, resource_type, resource_id } = useReplyContext();

    useEffect(() => {
        if (inputError) {
            const timeoutId = setTimeout(() => {
                setInputError('');
            }, 4000);

            return () => {
                clearTimeout(timeoutId);
            };
        }
    }, [inputError]);

    const inputRef = useRef<HTMLInputElement>(null);
    const { User } = useUserContext()
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
            queryKey: ['comments', resource_id],
            queryFn: ({ pageParam }) => getComments({ pageParam: pageParam, resource_id: resource_id, resource_type: resource_type }),
            getNextPageParam: (lastPage) => lastPage?.data?.page < lastPage?.data?.pages_count ? lastPage?.data?.page + 1 : undefined,
        }
    )


    const comments = data as InfiniteCommentsType

    return (
        <>
            <section className="my-2 flex items-center gap-x-2" id="comment or reply">
                <Avatar className="w-12 h-12 mt-1">
                    <AvatarImage src={User?.profile_avatar} alt={`@${User?.user_name}`} />
                    <AvatarFallback>{User?.first_name?.substring(0, 1) + User?.last_name?.substring(0, 1)}</AvatarFallback>
                </Avatar>
                <section id="comment_input" className="relative w-full">
                    <div className="relative w-full flex items-center justify-between gap-x-2">
                        <Input
                            ref={inputRef}
                            value={commentInput}
                            onChange={handleInputChange}
                            className="w-full bg-foreground font-medium py-4"
                            placeholder="What do you think?" type="text"
                        />
                        <Button onClick={handleSaveComment} variant="ghost">Post</Button>
                    </div>
                    {inputError && <p className="absolute -bottom-4 text-xs text-red-500 left-0">{inputError}</p>}
                </section>
            </section>
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
                                                            <Comment comment={comment} resource_type={resource_type} resource_id={resource_id} inputRef={inputRef} />
                                                        </motion.div>
                                                    </Fragment>
                                                )
                                            }))}
                                    </AnimatePresence>
                                </div>
                                <LoadMoreHider page={comments?.pages?.[1] ? true : false} loading={isFetchingNextPage}>
                                    <LoadMore fetchNextPage={fetchNextPage} hasNextPage={hasNextPage as boolean} isFetchingNextPage={isFetchingNextPage} />
                                </LoadMoreHider>
                            </section>
            }
        </>
    );
}

export default Comments;