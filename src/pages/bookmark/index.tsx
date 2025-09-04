import { getBookmarkItems } from "@/api/requests/bookmark/requests";
import DataError from "@/components/app-ui-states/data-error";
import DataLoading from "@/components/app-ui-states/data-loading";
import NoData from "@/components/app-ui-states/no-data";
import ArticleData from "@/components/article/article-data";
import FeedLayout from "@/components/layout/feed-layout";
import LoadMore from "@/components/load-more/load-more";
import Meta from "@/components/meta/meta";
import PostData from "@/components/post/post-data";
import LoadMoreHider from "@/components/ui-utils/load-more-hider";
import { ArticleType } from "@/types/article";
import { InfiniteBookMarkType } from "@/types/bookmark";
import { PostType } from "@/types/post";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Fragment } from "react";

const BookMark = () => {
    const { data, isError, isLoading, isFetchingNextPage, refetch, isRefetching, fetchNextPage, hasNextPage } = useInfiniteQuery(
        {
            queryKey: ['bookmark'],
            queryFn: getBookmarkItems,
            getNextPageParam: (lastPage) => lastPage?.page < lastPage?.pages_count ? lastPage?.page + 1 : undefined,
        })
    const bookmark = data as InfiniteBookMarkType

    return (
        <FeedLayout>
            <Meta title="Bookmarks" desc="View your bookmarked content weather it be an article, post or a poem." />
            <section className="mt-4 flex flex-col">
                {isError ?
                    <DataError />
                    :
                    isLoading ?
                        <DataLoading />
                        :
                        bookmark?.pages?.[0]?.results?.length === 0 ?
                            <NoData message="You haven't added anything to your bookmark" />
                            :
                            bookmark?.pages?.map(page =>
                                page?.results?.map((resource) => {
                                    return (
                                        <Fragment>
                                            {resource?.content_type_name === "article" ?
                                                <ArticleData className="bg-transparent" article={resource?.content_data as ArticleType} key={resource?.id} />
                                                :
                                                resource?.content_type_name === "post" ?
                                                    <PostData post={resource?.content_data as PostType} key={resource?.id} />
                                                    :
                                                    null
                                            }
                                        </Fragment>
                                    )
                                }))

                }
                <LoadMoreHider page={bookmark?.pages?.[1] ? true : false} loading={isFetchingNextPage}>
                    <LoadMore fetchNextPage={fetchNextPage} hasNextPage={hasNextPage as boolean} isFetchingNextPage={isFetchingNextPage} />
                </LoadMoreHider>
            </section>
        </FeedLayout>
    );
}

export default BookMark;