import PostData from "@/components/post/post-data";
import { cn } from "@/lib/utils";
import { InfinitePostsType } from "@/types/post";
import dynamic from "next/dynamic";
const DataError = dynamic(() => import('@/components/app-ui-states/data-error'), {
    loading: () => <div className="w-full h-full flex items-center justify-center"><p className="font-medium opacity-70">Loading...</p></div>,
})
const DataLoading = dynamic(() => import('@/components/app-ui-states/data-loading'), {
    loading: () => <div className="w-full h-full flex items-center justify-center"><p className="font-medium opacity-70">Loading...</p></div>,
})
const NoData = dynamic(() => import('@/components/app-ui-states/no-data'), {
    loading: () => <div className="w-full h-full flex items-center justify-center"><p className="font-medium opacity-70">Loading...</p></div>,
})
type PostCompType = {
    loading: boolean,
    error: boolean,
    refetch: () => void,
    refetching: boolean,
    threadable?: boolean
    parent_slug?: string,
    classNames?: {
        post?: {
            container?: string;
            profile?: string;
            content?: string;
            contentTxt?: string;
            contentMedia?: string;
            actions?: string;
        },
        loading?: string,
        error?: string,
        noData?: string,
    }
    noData?: {
        message?: string,
        icon?: boolean | React.ReactElement,
    },
    data: InfinitePostsType
}

const PostsComp: React.FC<PostCompType> = ({ loading, error, refetch, refetching, data, classNames, noData, threadable, parent_slug }) => {
    const posts = data?.pages
    return (
        <>
            {
                loading ?
                    <DataLoading className={cn(classNames?.loading, "mt-4")} />
                    :
                    error ? (
                        <DataError className={classNames?.error} refetch={refetch} refetching={refetching} />
                    )
                        :
                        posts[0]?.results?.length === 0 ? (
                            <NoData className={classNames?.noData} icon={noData?.icon} message={noData?.message ?? "Looks like there are no posts yet"} />
                        )
                            :
                            posts?.map(page =>
                                page?.results?.map((post) => {
                                    return (
                                        <PostData
                                            classNames={{
                                                container: classNames?.post?.container,
                                                content: classNames?.post?.content,
                                                contentTxt: classNames?.post?.contentTxt,
                                                contentMedia: classNames?.post?.contentMedia,
                                                profile: classNames?.post?.profile,
                                                actions: classNames?.post?.actions,
                                            }}
                                            threadable={threadable}
                                            parent_slug={parent_slug}
                                            post={post}
                                            key={post?.id} />
                                    )
                                }))
            }
        </>
    );
}

export default PostsComp;