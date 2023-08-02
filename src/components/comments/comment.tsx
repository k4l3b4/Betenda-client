'use client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CommentType } from "@/types/comment";
import { Button } from "@/components/ui/button";
import { Heart, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { RelativeTime } from "@/components/time/Time";
import { cn, formatNumberWithSuffix } from "@/lib/utils";
import { motion } from 'framer-motion'
import { useReplyContext } from "@/context/reply-context";

const Comment = ({ comment }: { comment: CommentType }) => {
    const { handleReplyToComment, handleTopParent } = useReplyContext()

    const HandleReplyFire = ({ parent, comment }: { parent: number, comment: CommentType }) => {
        handleReplyToComment(comment)
        handleTopParent(parent)
    }
    return (
        <div className="relative" id="comment #" aria-label={`comment: #${comment?.id}`}>
            <div className="flex flex-row items-start ml-2">
                <Avatar className="w-12 h-12 mt-1">
                    {comment?.user?.profile_avatar && <AvatarImage src={comment?.user?.profile_avatar} alt={`@${comment?.user?.user_name}`} />}
                    <AvatarFallback>{comment?.user?.first_name?.substring(0, 1) + " " + comment?.user?.last_name?.substring(0, 1)}</AvatarFallback>
                </Avatar>
                <div className="w-full ml-2 flex flex-col items-start">
                    <div className="relative h-fit w-full flex justify-between">
                        <div className="h-fit flex items-baseline gap-x-2">
                            <Link className="norm-link text-sm opacity-90 font-medium" href={`/${comment?.user?.user_name}`}>
                                <p className="opacity-70">{`${comment?.user?.first_name} ${comment?.user?.last_name ?? ''}`}</p>
                            </Link>
                            {comment?.reply_to &&
                                <Link href={`/${comment?.reply_to}`} className="norm-link p-0.5 bg-muted-foreground rounded-md opacity-50 text-white font-medium text-sm">{`@${comment?.reply_to}`}</Link>}
                        </div>
                        <Button className="w-10 h-5 absolute right-1 top-1" variant="ghost" size="icon">
                            <MoreHorizontal />
                        </Button>
                    </div>
                    <div className="text-sm" id="comment-id h-fit">
                        {comment?.comment}
                    </div>
                </div>
            </div>
            <div className="ml-[70px] mt-2 flex flex-row items-center gap-x-5">
                <div className="space-x-1 w-fit flex flex-row items-center text-center">
                    <motion.button
                        // onClick={(event) => handleReaction({ event: event, data: { resource: "post", id: post?.id } })}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <Heart className={cn("h-5 w-5")} />
                    </motion.button>
                    <p className="text-xs font-medium">{formatNumberWithSuffix(comment?.reactions?.reaction_count?.[0]?.count as number)}</p>
                </div>
                <Button onClick={() => HandleReplyFire({ parent: comment?.parent ?? comment?.id, comment: comment })} className="h-6 px-4" size="sm" variant="ghost">Reply</Button>
                <p className="text-xs text-muted-foreground">{RelativeTime(comment?.created_at)}</p>
            </div>
        </div>
    );
}

export default Comment;