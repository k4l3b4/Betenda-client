import PostData from "@/components/post/post-data"
import { Separator } from "@/components/ui/separator"
import Meta from "@/components/meta/meta"
import { QueryClient, dehydrate, useInfiniteQuery } from '@tanstack/react-query';
import { GetServerSideProps } from "next"
import { getPosts } from "@/api/requests/post/requests"
import { useUserContext } from "@/context/user-context"
import CreatePost from "@/components/post/create-post";
import { Fragment } from "react";
import { PaginatedPostType } from "@/types/post";

export default function IndexPage() {
  const { data, isError, isLoading, isFetchingNextPage, refetch, fetchNextPage, hasNextPage } = useInfiniteQuery({ queryKey: ['posts'], queryFn: getPosts, getNextPageParam: (lastPage) => lastPage?.data?.current_page < lastPage?.data?.last_page ? lastPage?.data?.current_page + 1 : undefined, })
  const posts = data?.pages as PaginatedPostType[]
  const { User } = useUserContext()
  return (
    <div className="flex w-full flex-row justify-around px-2">
      <Meta title="Betenda" />
      <aside className="sticky left-0 top-20 h-screen w-72">
        <div>
          <h2 className="text-2xl font-semibold">Top accounts</h2>
          <ul>
            <li><a href="#">My Friend</a></li>
            <li><a href="#">My Other Friend</a></li>
            <li><a href="#">My Best Friend</a></li>
          </ul>
        </div>
      </aside>
      <Separator className="h-full" orientation="vertical" />
      <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
        <CreatePost />

        {
          isLoading ?
            <>
              Loading
            </>
            :
            isError ? (
              <div className="flex flex-col justify-center items-center mt-3">
                Error
                {/* <Button onClick={refetch} name="Retry" /> */}
              </div>
            )
              :
              posts[0]?.results?.length === 0 ? (
                "no data"
              )
                :
                posts?.map(page =>
                  page?.results?.map((post, i) => {
                    return (
                      <Fragment key={post?.id}>
                        <PostData post={post} />
                      </Fragment>
                    )
                  }))
        }

      </section>
      <Separator className="h-full" orientation="vertical" />
      <aside className="sticky left-0 top-20 h-screen">
        <h2>Blogroll</h2>
        <ul>
          <li><a href="#">My Friend</a></li>
          <li><a href="#">My Other Friend</a></li>
          <li><a href="#">My Best Friend</a></li>
        </ul>
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