import { getArticles } from "@/api/requests/article/requests";
import ArticlesComp from "@/components/article/articles-comp";
import FeedLayout from "@/components/layout/feed-layout";
import LoadMore from "@/components/load-more/load-more";
import Meta from "@/components/meta/meta";
import { buttonVariants } from "@/components/ui/button";
import { useUserContext } from "@/context/user-context";
import { getCookieValue } from "@/lib/utils";
import { InfiniteArticlesType } from "@/types/article";
import { QueryClient, dehydrate, useInfiniteQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { GetServerSideProps } from "next";
import Link from "next/link";

const Articles = () => {
    const { User } = useUserContext()
    const { data, isError, isLoading, isFetchingNextPage, refetch, isRefetching, fetchNextPage, hasNextPage } = useInfiniteQuery(
        {
            queryKey: ['articles'],
            queryFn: getArticles,
            getNextPageParam: (lastPage) => lastPage?.page < lastPage?.pages_count ? lastPage?.page + 1 : undefined,
        }
    )
    const articles = data as InfiniteArticlesType

    return (
        <>
            <Meta title="Articles" />
            <FeedLayout trending="unmount">
                <section className="w-full rounded-md flex flex-col items-center p-0 mt-4" id="articles">
                    {(User?.is_superuser || User?.is_staff) && (
                        <div className="w-full max-w-[650px] flex justify-end">
                            <Link className={buttonVariants({ variant: "default", className: "gap-x-2 no-underline" })} href="/dashboard/article/create"><PlusIcon /><p>Write an article</p></Link>
                        </div>
                    )}
                    <ArticlesComp data={articles} error={isError} loading={isLoading} refetch={refetch} refetching={isRefetching} />
                    <LoadMore fetchNextPage={fetchNextPage} hasNextPage={hasNextPage as boolean} isFetchingNextPage={isFetchingNextPage} />
                </section>
            </FeedLayout>
        </>
    )
}

export default Articles;




export const getServerSideProps: GetServerSideProps = async (context) => {
    const { req } = context;
    const sessionId = getCookieValue(req, 'sessionid')

    const queryClient = new QueryClient()
    await queryClient.prefetchInfiniteQuery({ queryKey: ['posts'], queryFn: () => getArticles({ pageParam: 1, sessionId: sessionId }) })
    return {
        props: {
            dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
        },
    }
}