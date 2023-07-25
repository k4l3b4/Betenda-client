import { getPostBySlug, getPostReplies } from "@/api/requests/post/requests";
import FeedLayout from "@/components/layout/feed-layout";
import Meta from "@/components/meta/meta";
import CreatePost from "@/components/post/create-post";
import PostData from "@/components/post/post-data";
import PostsComp from "@/components/post/posts-comp";
import { getCookieValue } from "@/lib/utils";
import { InfinitePostsType, PostType } from "@/types/post";
import { QueryClient, dehydrate, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";

const Post = () => {
    const router = useRouter()
    const { slug } = router.query as ParsedUrlQuery
    const cleanSlug = slug as string
    const { data: post, isLoading: loadingPosts } = useQuery({ queryKey: ['get_post', cleanSlug], queryFn: () => getPostBySlug({ slug: cleanSlug }) })
    const postData = post?.data as PostType

    const { data: replies, isError: repliesError, isLoading: loadingReplies, isFetchingNextPage, refetch, isRefetching, fetchNextPage, hasNextPage } = useInfiniteQuery({ queryKey: ['get_replies', cleanSlug], queryFn: () => getPostReplies({ parent: postData?.id }), enabled: postData ? true : false, getNextPageParam: (lastPage) => lastPage?.data?.page < lastPage?.data?.pages_count ? lastPage?.data?.page + 1 : undefined, })
    const repliesData = replies as InfinitePostsType


    return (
        <FeedLayout>
            <Meta title={`${postData?.content?.substring(0, 15) ?? `${`${postData?.user?.first_name}'s post`}`}` ?? "Loading..."} />
            < section className="rounded-md container flex flex-col items-center" id="feed">
                {loadingPosts ?
                    <div>
                        Loading
                    </div>
                    :
                    <>
                        <PostData post={postData} />
                        <CreatePost parent_id={postData?.id} placeholder={`Reply to ${postData?.user?.first_name}'s post`} />
                    </>
                }
                {loadingReplies ?
                    <div>
                        Loading
                    </div>
                    :
                    <>
                        <h2 className="text-start w-full">Replies</h2>
                        <PostsComp postClassName="hover-anim" data={repliesData} error={repliesError} loading={loadingReplies} refetch={refetch} refetching={isRefetching} />
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
            dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
        },
    }
}