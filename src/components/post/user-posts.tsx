import { getUserPosts } from "@/api/requests/post/requests";
import PostsComp from "@/components/post/posts-comp";
import { InfinitePostsType } from "@/types/post";
import { useInfiniteQuery } from "@tanstack/react-query";
import LoadMore from "../load-more/load-more";

const UserPosts = ({ username }: { username: string }) => {
    const { data, isError, isLoading, isFetchingNextPage, refetch, isRefetching, fetchNextPage, hasNextPage } = useInfiniteQuery(
        {
            queryKey: ['user_posts', username],
            queryFn: ({ pageParam }) => getUserPosts({ pageParam: pageParam, username: username }),
            getNextPageParam: (lastPage) => lastPage?.page < lastPage?.pages_count ? lastPage?.page + 1 : undefined,
            enabled: username ? true : false
        })
    const posts = data as InfinitePostsType

    return (
        <div className="h-full">
            <PostsComp classNames={{ loading: "h-full", error: "h-full", post: { container: "px-2 py-4" } }} data={posts} loading={isLoading} error={isError} refetch={refetch} refetching={isRefetching} />
            {hasNextPage &&
                <LoadMore fetchNextPage={fetchNextPage} hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} />
            }
        </div>
    );
}

export default UserPosts;