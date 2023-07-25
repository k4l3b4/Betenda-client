import { getPostsByTag } from "@/api/requests/post/requests";
import FeedLayout from "@/components/layout/feed-layout";
import Meta from "@/components/meta/meta";
import PostsComp from "@/components/post/posts-comp";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCookieValue } from "@/lib/utils";
import { InfinitePostsType } from "@/types/post";
import { QueryClient, dehydrate, useInfiniteQuery } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";

const ResourcesWithTag = () => {
    const router = useRouter()
    const { tag } = router.query as ParsedUrlQuery;
    const qParam = tag as string
    const {
        data: posts, isError: postError, isLoading: postLoading, refetch: postRefetch, isRefetching: postRefetching, isFetchingNextPage: isFetchingPostNextPage, fetchNextPage: fetchNextPostPage, hasNextPage: hasNextPostPage
    } = useInfiniteQuery(
        {
            queryKey: ['get_post_by_tag', qParam],
            queryFn: ({ pageParam }) => getPostsByTag({ tag: qParam, pageParam: pageParam }),
            getNextPageParam: (lastPage) => lastPage?.data?.page < lastPage?.data?.pages_count ? lastPage?.data?.page + 1 : undefined,
        })

    const cleanPosts = posts as InfinitePostsType



    return (
        <FeedLayout>
            <Meta title={`#${qParam}` ?? "Loading..."} />
            <div className="w-full flex justify-center mt-2">
                <Tabs defaultValue="post" className="w-full max-w-[650px]">
                    <TabsList className="flex flex-row flex-wrap justify-evenly items-center gap-2">
                        <TabsTrigger value="post">Posts</TabsTrigger>
                        <TabsTrigger value="article">Articles</TabsTrigger>
                        <TabsTrigger value="poem">Poem</TabsTrigger>
                        <TabsTrigger value="saying">Sayings</TabsTrigger>
                    </TabsList>
                    <TabsContent className="w-full flex flex-col items-center" value="post">
                        <PostsComp data={cleanPosts} loading={postLoading} error={postError} refetch={postRefetch} refetching={postRefetching} />
                    </TabsContent>
                    <TabsContent className="w-full" value="article">
                    </TabsContent>
                    <TabsContent className="w-full" value="poem">
                    </TabsContent>
                    <TabsContent className="w-full" value="saying">
                    </TabsContent>
                </Tabs>
            </div>
        </FeedLayout>
    );
}

export default ResourcesWithTag;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { req } = context;
    const { tag } = context.params as ParsedUrlQuery


    // Get the value of the 'sessionId' cookie
    const sessionId = getCookieValue(req, 'sessionid')

    const queryClient = new QueryClient()
    await queryClient.prefetchInfiniteQuery({ queryKey: ['posts'], queryFn: () => getPostsByTag({ tag: tag as string, sessionId: sessionId }) })
    return {
        props: {
            dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
        },
    }
}