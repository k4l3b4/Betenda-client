import PostData from "@/components/post/post-data"
import { Separator } from "@/components/ui/separator"
import Meta from "@/components/meta/meta"
import { QueryClient, dehydrate, useInfiniteQuery } from '@tanstack/react-query';
import { GetServerSideProps } from "next"
import { getPosts } from "@/api/requests/post/requests"
import { useUserContext } from "@/context/user-context"
import CreatePost from "@/components/post/create-post";
import { InfinitePostsType } from "@/types/post";
import Link from "next/link";
import ReplyPost from "@/components/post/reply-post";
import PostsComp from "@/components/post/posts-comp";

export default function IndexPage() {
  const { data, isError, isLoading, isFetchingNextPage, refetch, isRefetching, fetchNextPage, hasNextPage } = useInfiniteQuery({ queryKey: ['posts'], queryFn: getPosts, getNextPageParam: (lastPage) => lastPage?.data?.page < lastPage?.data?.pages_count ? lastPage?.data?.page + 1 : undefined, })
  const posts = data as InfinitePostsType
  const { User } = useUserContext()
  return (
    <div className="relative flex w-full flex-row justify-around px-2 gap-x-2 min-h-screen">
      <Meta title="Our home" />
      <aside className="rounded-md w-full max-w-[250px] sticky left-0 top-20 h-[calc(100vh-100px)] p-2">
        <div>
          <h2>Top accounts</h2>
          <ul className="ml-2 mt-2">
            <li><a href="#">My Friend</a></li>
            <li><a href="#">My Other Friend</a></li>
            <li><a href="#">My Best Friend</a></li>
          </ul>
        </div>
        <div className="mt-4">
          <h3>Who to follow</h3>
          <ul className="ml-2 mt-2">
            <li><a href="#">My Friend</a></li>
            <li><a href="#">My Other Friend</a></li>
            <li><a href="#">My Best Friend</a></li>
          </ul>
        </div>
      </aside>
      <Separator className="h-full w-[1px] bg-black" orientation="vertical" />
      <section className="rounded-md container flex flex-col items-center">
        <CreatePost />
        <PostsComp data={posts} error={isError} loading={isLoading} refetch={refetch} refetching={isRefetching} />
      </section>
      <Separator className="h-full" orientation="vertical" />
      <aside className="rounded-md w-full max-w-[250px] sticky left-0 top-20 h-[calc(100vh-100px)] p-2">
        <h2>Trending</h2>
        <div className="ml-4">
          <h3 className="underline">Tags</h3>
          <div className="flex flex-col gap-2">
            <Link className="text-lg" href="/tags/#tag">#guragigna</Link>
            <Link className="text-lg" href="/tags/#tag">#betenda</Link>
            <Link className="text-lg" href="/tags/#tag">#new_era</Link>
            <Link className="text-lg" href="/tags/#tag">#gurans</Link>
            <Link className="text-lg" href="/tags/#tag">#cheha</Link>
            <Link className="text-lg" href="/tags/#tag">#neged</Link>
          </div>
        </div>
      </aside>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const queryClient = new QueryClient()
  await queryClient.prefetchInfiniteQuery({ queryKey: ['posts'], queryFn: getPosts })
  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  }
}