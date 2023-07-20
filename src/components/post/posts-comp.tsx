import PostData from "@/components/post/post-data";
import { InfinitePostsType } from "@/types/post";
import { Button } from "../ui/button";

type PostCompType = {
    loading: boolean,
    error: boolean,
    refetch: () => void,
    refetching: boolean,
    data: InfinitePostsType
}


const PostsComp: React.FC<PostCompType> = ({ loading, error, refetch, refetching, data }) => {
    const posts = data?.pages
    return (
        <>
            {
                loading ?
                    <>
                        Loading
                    </>
                    :
                    error ? (
                        <div className="flex flex-col justify-center items-center mt-3">
                            Error
                            <Button onClick={refetch}>{refetching ? "Retrying" : "Retry"}</Button>
                        </div>
                    )
                        :
                        posts[0]?.results?.length === 0 ? (
                            "no data"
                        )
                            :
                            posts?.map(page =>
                                page?.results?.map((post) => {
                                    return (
                                        <PostData post={post} key={post?.id} />
                                    )
                                }))
            }
        </>
    );
}

export default PostsComp;