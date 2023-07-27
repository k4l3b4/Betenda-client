import PostData from "@/components/post/post-data";
import { InfinitePostsType } from "@/types/post";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import CircularProgress from "@mui/material/CircularProgress";

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
                    <div className={cn("flex flex-col justify-center items-center mt-5",
                        classNames?.loading
                    )}>
                        <CircularProgress color="inherit" thickness={4} size="2.3rem" />
                    </div>
                    :
                    error ? (
                        <div className={cn("flex flex-col justify-center items-center mt-3",
                            classNames?.error
                        )}>
                            Error
                            <Button onClick={refetch}>{refetching ? "Retrying" : "Retry"}</Button>
                        </div>
                    )
                        :
                        posts[0]?.results?.length === 0 ? (
                            <div className={cn("flex flex-col justify-center space-y-4 items-center mt-3 opacity-60",
                                classNames?.noData
                            )}>
                                <h1 className="rotate-45 font-bold text-8xl">{`:(`}</h1>
                                <h2>Looks like there are no replies</h2>
                                <h2>Maybe you can be the first!</h2>
                            </div>
                        )
                            :
                            posts?.map(page =>
                                page?.results?.map((post) => {
                                    return (
                                        <PostData className={cn(`${post?.parent ? '' : 'hover-anim'}`, 'w-[650px]', classNames?.post)} post={post} key={post?.id} />
                                    )
                                }))
            }
        </>
    );
}

export default PostsComp;