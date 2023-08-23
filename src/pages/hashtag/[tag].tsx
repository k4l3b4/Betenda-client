import { getArticles } from "@/api/requests/article/requests";
import { getPostsByTag } from "@/api/requests/post/requests";
import ArticlesComp from "@/components/article/articles-comp";
import FeedLayout from "@/components/layout/feed-layout";
import LoadMore from "@/components/load-more/load-more";
import Meta from "@/components/meta/meta";
import PostsComp from "@/components/post/posts-comp";
import LoadMoreHider from "@/components/ui-utils/load-more-hider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InfiniteArticlesType } from "@/types/article";
import { InfinitePostsType } from "@/types/post";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";

const ResourcesWithTag = () => {
    const router = useRouter()
    const { tag } = router.query as ParsedUrlQuery;
    const qParam = tag as string
    // posts query
    const { data: posts, isError: postError, isLoading: postLoading, refetch: postRefetch, isRefetching: postRefetching, isFetchingNextPage: isFetchingPostNextPage, fetchNextPage: fetchNextPostPage, hasNextPage: hasNextPostPage } = useInfiniteQuery(
        {
            queryKey: ['get_post_by_tag', qParam],
            queryFn: ({ pageParam }) => getPostsByTag({ tag: qParam, pageParam: pageParam }),
            getNextPageParam: (lastPage) => lastPage?.data?.page < lastPage?.data?.pages_count ? lastPage?.data?.page + 1 : undefined,
        })

    const cleanPosts = posts as InfinitePostsType

    // Articlea query
    const { data: articles, isError: articleError, isLoading: articleLoading, isFetchingNextPage: isFetchingArticleNextPage, refetch: articleRefetch, isRefetching: articleRefetching, fetchNextPage: fetchNextArticlePage, hasNextPage: hasNextArticlePage } = useInfiniteQuery(
        {
            queryKey: ['get_articles_by_tag'],
            queryFn: getArticles,
            getNextPageParam: (lastPage) => lastPage?.page < lastPage?.pages_count ? lastPage?.page + 1 : undefined,
        }
    )
    const cleanArticles = articles as InfiniteArticlesType


    return (
        <FeedLayout>
            <Meta title={qParam ? `#${qParam}` : "Loading..."} />
            <div className="w-full flex justify-center mt-2">
                <Tabs defaultValue="posts" className="w-full max-w-[650px]">
                    <TabsList className="flex flex-row flex-wrap justify-evenly items-center gap-2 sticky top-4 mb-4 z-50 bg-foreground">
                        <TabsTrigger value="posts">Posts</TabsTrigger>
                        <TabsTrigger value="articles">Articles</TabsTrigger>
                        <TabsTrigger value="poems">Poems</TabsTrigger>
                    </TabsList>
                    <TabsContent className="w-full" value="posts">
                        <PostsComp data={cleanPosts} loading={postLoading} error={postError} refetch={postRefetch} refetching={postRefetching} />
                        <LoadMoreHider page={cleanPosts?.pages?.[1] ? true : false} loading={isFetchingPostNextPage}>
                            <LoadMore fetchNextPage={fetchNextPostPage} hasNextPage={hasNextPostPage as boolean} isFetchingNextPage={isFetchingPostNextPage} />
                        </LoadMoreHider>
                    </TabsContent>
                    <TabsContent className="w-full" value="articles">
                        <ArticlesComp data={cleanArticles} error={articleError} loading={articleLoading} refetch={articleRefetch} refetching={articleRefetching} />
                        <LoadMoreHider page={cleanArticles?.pages?.[1] ? true : false} loading={isFetchingArticleNextPage}>
                            <LoadMore fetchNextPage={fetchNextArticlePage} hasNextPage={hasNextArticlePage as boolean} isFetchingNextPage={isFetchingArticleNextPage} />
                        </LoadMoreHider>
                    </TabsContent>
                    <TabsContent className="w-full" value="poems">

                    </TabsContent>
                </Tabs>
            </div>
        </FeedLayout>
    );
}

export default ResourcesWithTag;