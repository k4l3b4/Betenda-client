import { getPostBySlug, getPostReplies } from "@/api/requests/post/requests";
import FeedLayout from "@/components/layout/feed-layout";
import Meta from "@/components/meta/meta";
import PostData from "@/components/post/post-data";
import { getCookieValue } from "@/lib/utils";
import { InfinitePostsType, PostType } from "@/types/post";
import CircularProgress from "@mui/material/CircularProgress";
import { QueryClient, dehydrate, useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";

const CreatePost = dynamic(() => import('@/components/post/create-post'), {
    loading: () => <div className="w-full h-full flex items-center justify-center"><p className="font-medium opacity-70">Loading...</p></div>,
})

const PostsComp = dynamic(() => import('@/components/post/posts-comp'), {
    loading: () => <div className="w-full h-full flex items-center justify-center"><p className="font-medium opacity-70">Loading...</p></div>,
})

const Post = () => {
    const queryClient = useQueryClient()
    const router = useRouter()
    const { slug } = router.query as ParsedUrlQuery
    const cleanSlug = slug as string
    const { data: post, isLoading: loadingPosts } = useQuery({ queryKey: ['get_post', cleanSlug], queryFn: () => getPostBySlug({ slug: cleanSlug }) })
    const postData = post?.data as PostType

    const { data: replies, isError: repliesError, isLoading: loadingReplies, isFetchingNextPage, refetch, isRefetching, fetchNextPage, hasNextPage } = useInfiniteQuery({ queryKey: ['get_replies', cleanSlug], queryFn: () => getPostReplies({ parent: postData?.id }), enabled: postData ? true : false, getNextPageParam: (lastPage) => lastPage?.data?.page < lastPage?.data?.pages_count ? lastPage?.data?.page + 1 : undefined, })
    const repliesData = replies as InfinitePostsType


    const onMutationSuccess = (data: any) => {
        const currentData = queryClient.getQueryData<InfinitePostsType>(['get_replies', cleanSlug]);

        if (currentData) {
            console.log("current data:", currentData)
            // Add the new notification to the first page
            const updatedResults = [
                data?.data, // getting this from the onSuccess handler in the useMutation hook
                ...(currentData.pages[0]?.results || []),
            ];
            console.log("updated data:", updatedResults)
            // Update the query data with the new notification added to the first page
            queryClient.setQueryData<InfinitePostsType>(['get_replies', cleanSlug], {
                pages: [
                    {
                        total_items: currentData.pages[0]?.total_items, // Preserve the total_items value
                        page: currentData.pages[0]?.page, // Preserve the page value
                        page_size: currentData.pages[0]?.page_size, // Preserve the page_size value
                        results: updatedResults, // Update the property name to "results"
                    },
                    ...currentData.pages.slice(1),
                ],
                pageParams: currentData.pageParams,
            });
        }
    }


    return (
        <FeedLayout>
            <Meta title={`${postData?.user?.first_name} on betenda: "${postData?.content?.substring(0, 15)}"`} />
            <section className={`${loadingPosts ? "space-y-4" : ""} w-full rounded-md flex flex-col items-center mt-2 p-0`} id="feed">
                {loadingPosts ?
                    <div className="flex flex-col justify-center items-center mt-5">
                        <CircularProgress color="inherit" thickness={4} size="2.3rem" />
                    </div>
                    :
                    <>
                        <PostData classNames={{ container: "hover:cursor-default", content: "ml-0 px-0 py-2", contentTxt: "text-lg" }} post={postData} />
                        <CreatePost className="bg-transparent" onSuccess={(data) => onMutationSuccess(data)} parent_id={postData?.id} placeholder={`Reply to ${postData?.user?.first_name}'s post`} />
                    </>
                }
                <h2 className="text-start w-full">Replies</h2>
                {loadingReplies ?
                    <div className="flex flex-col justify-center items-center mt-5">
                        <CircularProgress color="inherit" thickness={4} size="2.3rem" />
                    </div>
                    :
                    <>
                        <PostsComp parent_slug={postData?.slug} classNames={{ post: { contentTxt: "text-lg" } }} data={repliesData} error={repliesError} loading={loadingReplies} refetch={refetch} refetching={isRefetching} noData={{ message: "Looks like no on has replied yet" }} />
                    </>
                }
            </section>
        </FeedLayout>
    );
}

export default Post;


export const getServerSideProps: GetServerSideProps = async (context) => {
    const { req } = context;
    const { slug } = context.params as ParsedUrlQuery


    // Get the value of the 'sessionId' cookie
    const sessionId = getCookieValue(req, 'sessionid')

    const queryClient = new QueryClient()
    await queryClient.prefetchQuery({ queryKey: ['get_post', slug], queryFn: () => getPostBySlug({ slug: slug as string, sessionId: sessionId }) })
    return {
        props: {
            dehydratedState: dehydrate(queryClient),
        },
    }
}