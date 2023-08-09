import DataError from "@/components/app-ui-states/data-error";
import DataLoading from "@/components/app-ui-states/data-loading";
import NoData from "@/components/app-ui-states/no-data";
import PostData from "@/components/post/post-data";
import { cn } from "@/lib/utils";
import { InfinitePostsType } from "@/types/post";

type PostCompType = {
    loading: boolean,
    error: boolean,
    refetch: () => void,
    refetching: boolean,
    classNames?: {
        post?: string,
        loading?: string,
        error?: string,
        noData?: string,
    }
    data: InfinitePostsType
}

const PostsComp: React.FC<PostCompType> = ({ loading, error, refetch, refetching, data, classNames }) => {
    const posts = data?.pages
    return (
        <>
            {
                loading ?
                    <DataLoading className={classNames?.loading} />
                    :
                    error ? (
                        <DataError className={classNames?.error} refetch={refetch} refetching={refetching} />
                    )
                        :
                        posts[0]?.results?.length === 0 ? (
                            <NoData className={classNames?.noData} message="Looks like there are no posts yet" />
                        )
                            :
                            posts?.map(page =>
                                page?.results?.map((post) => {
                                    return (
                                        <PostData className={cn(`${(post?.parent || classNames?.post) ? '' : 'hover-anim'}`, classNames?.post)} post={post} key={post?.id} />
                                    )
                                }))
            }
        </>
    );
}

export default PostsComp;