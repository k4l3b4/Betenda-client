import Meta from "@/components/meta/meta"
import { QueryClient, dehydrate, useInfiniteQuery } from '@tanstack/react-query';
import { GetServerSideProps } from "next"
import { getPosts } from "@/api/requests/post/requests"
import { InfinitePostsType } from "@/types/post";
import PostsComp from "@/components/post/posts-comp";
import FeedLayout from "@/components/layout/feed-layout";
import { getCookieValue } from "@/lib/utils";
import LoadMore from "@/components/load-more/load-more";
import LoadMoreHider from "@/components/ui-utils/load-more-hider";

export default function IndexPage() {
  const { data, isError, isLoading, isFetchingNextPage, refetch, isRefetching, fetchNextPage, hasNextPage } = useInfiniteQuery(
    {
      queryKey: ['posts'],
      queryFn: getPosts,
      getNextPageParam: (lastPage) => lastPage?.page < lastPage?.pages_count ? lastPage?.page + 1 : undefined,
    })
  const posts = data as InfinitePostsType


  return (
    <>
      <Meta title="Our home" />
      <FeedLayout>
        <section className="w-full rounded-md flex flex-col items-center p-0 relative" id="feed">
          <PostsComp classNames={{ noData: "mt-4", loading: "mt-4", error: "mt-4" }} data={posts} error={isError} loading={isLoading} refetch={refetch} refetching={isRefetching} threadable={true} />
          <LoadMoreHider page={posts?.pages?.[1] ? true : false} loading={isFetchingNextPage}>
            <LoadMore fetchNextPage={fetchNextPage} hasNextPage={hasNextPage as boolean} isFetchingNextPage={isFetchingNextPage} />
          </LoadMoreHider>
        </section>
      </FeedLayout>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req } = context;
  const sessionId = getCookieValue(req, 'sessionid')

  const queryClient = new QueryClient()
  await queryClient.prefetchInfiniteQuery({ queryKey: ['posts'], queryFn: () => getPosts({ pageParam: 1, sessionId: sessionId }) })
  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  }
}