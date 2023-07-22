import { getPostsByTag } from "@/api/requests/post/requests";
import Meta from "@/components/meta/meta";
import PostsComp from "@/components/post/posts-comp";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InfinitePostsType } from "@/types/post";
import { useInfiniteQuery } from "@tanstack/react-query";
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
        <div>
            <Meta title={`#${qParam}`} />
            <div className="flex justify-center mt-2">
                <Tabs defaultValue="word" className="w-full max-w-[750px]">
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
        </div>
    );
}

export default ResourcesWithTag;