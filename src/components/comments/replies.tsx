import { getComments } from "@/api/requests/comment/requests";
import DataError from "@/components/app-ui-states/data-error";
import DataLoading from "@/components/app-ui-states/data-loading";
import NoData from "@/components/app-ui-states/no-data";
import LoadMore from "@/components/load-more/load-more";
import LoadMoreHider from "@/components/ui-utils/load-more-hider";
import { InfiniteCommentsType } from "@/types/comment";
import { useInfiniteQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import Comment from "./comment";

type RepliesCompType = {
    parent_id: number,
    resource_type: string,
    resource_id: number,
    inputRef: React.RefObject<HTMLInputElement>;
}

const Replies: React.FC<RepliesCompType> = ({ resource_type, resource_id, parent_id, inputRef }) => {
    const {
        data,
        isError,
        isLoading,
        isFetchingNextPage, refetch, isRefetching,
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
                    <DataLoading />
                    :
                    isError ? (
                        <DataError refetch={refetch} refetching={isRefetching} />
                    )
                        :
                        comments?.pages?.[0]?.results?.length === 0 ? (
                            <NoData message="Be the first to Reply!" />
                        )
                            :
                            <section id={`${resource_id}-replies`} className="w-full space-y-4">
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
                                                    <Comment inputRef={inputRef} comment={comment} resource_type={resource_type} resource_id={resource_id} />
                                                </motion.div>
                                            )
                                        }))}
                                </AnimatePresence>
                                <LoadMoreHider page={comments?.pages?.[1] ? true : false} loading={isFetchingNextPage}>
                                    <LoadMore fetchNextPage={fetchNextPage} hasNextPage={hasNextPage as boolean} isFetchingNextPage={isFetchingNextPage} />
                                </LoadMoreHider>
                            </section>
            }
        </>
    );
}

export default Replies;