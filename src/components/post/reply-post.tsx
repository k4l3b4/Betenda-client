import { PostType } from "@/types/post";
import PostData from "./post-data";

const ReplyPost = ({ post }: { post: PostType }) => {
    return (
        <PostData post={post} key={post?.id} />
    );
}

export default ReplyPost