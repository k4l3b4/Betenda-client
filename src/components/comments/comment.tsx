'use client'
import { ReactType } from "@/api/requests/reactions/requests";
import Replies from "@/components/comments/replies";
import { RelativeTime } from "@/components/time/Time";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useReplyContext } from "@/context/reply-context";
import useReactHook from "@/hooks/use-react-hook";
import { cn, formatNumberWithSuffix } from "@/lib/utils";
import { CommentType } from "@/types/comment";
import { motion } from 'framer-motion';
import { Heart, MoreHorizontalIcon } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import Report from "@/components/report/report";

const Comment = ({ comment, resource_type, resource_id, inputRef }: { comment: CommentType, resource_type: string, resource_id: number, inputRef: React.RefObject<HTMLInputElement>;}) => {
    const { handleReplyToComment, handleTopParent } = useReplyContext()
    const [reactionCount, setReactionCount] = useState<number>(comment?.reactions?.reaction_count[0]?.count ?? 0);
    const [reacted, setReacted] = useState<boolean>(comment?.reactions?.user_reacted_with ? true : false)
    const [openReply, setOpenReply] = useState(false)

    const onError = () => {
        if (reacted) {
            setReactionCount((prev) => prev - 1);
        }
        setReacted((prevReacted) => !prevReacted);
    }

    const { mutate, isLoading: isReacting } = useReactHook(onError)

    const handleReplyOpen = () => {
        setOpenReply(!openReply)
    }

    const HandleReplyFire = ({ parent, comment }: { parent: number, comment: CommentType }) => {
        handleReplyToComment(comment)
        handleTopParent(parent)
        if (inputRef?.current) {
            inputRef?.current.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
            inputRef?.current.focus();
        }
    }

    const handleReaction = ({ event, data }: { event: any, data: ReactType }) => {
        event?.stopPropagation();
        if (isReacting) {
            // make the button inactive while the mutation is ongoing
            return;
        }

        // If the user hasn't reacted before, increment the count immediately before the API request.
        if (!reacted) {
            setReactionCount((prev) => prev + 1);
        } else {
            setReactionCount((prev) => prev - 1);
        }
        // Toggle the reacted state.
        setReacted((prevReacted) => !prevReacted);
        // Call the mutate function to trigger the API request.
        mutate(data);
    };

    return (
        <>
            <div className="relative" id="comment #" aria-label={`comment: #${comment?.id}`}>
                <div className="flex flex-row items-start ml-2">
                    <Avatar className="w-12 h-12 mt-1">
                        {comment?.user?.profile_avatar && <AvatarImage src={comment?.user?.profile_avatar} alt={`@${comment?.user?.user_name}`} />}
                        <AvatarFallback>{comment?.user?.first_name?.substring(0, 1) + comment?.user?.last_name?.substring(0, 1)}</AvatarFallback>
                    </Avatar>
                    <div className="w-full ml-2 flex flex-col items-start">
                        <div className="relative h-fit w-full flex justify-between">
                            <div className="h-fit flex items-start gap-x-2">
                                <Link className="norm-link text-sm opacity-90 font-medium" href={`/${comment?.user?.user_name}`}>
                                    <p className="opacity-70">{`${comment?.user?.first_name} ${comment?.user?.last_name ?? ''}`}</p>
                                </Link>
                                {comment?.reply_to &&
                                    <>
                                        <p>to</p>
                                        <Link href={`/${comment?.reply_to}`} className="norm-link p-0.5 px-1 bg-foreground rounded-md text-white font-medium text-sm">{`@${comment?.reply_to}`}</Link>
                                    </>
                                }
                            </div>
                            <Report resource_id={comment?.id} resource_type="comment">
                                <Button onClick={(event) => event.stopPropagation()} className="w-10 h-5 absolute right-1 top-1" variant="ghost" size="icon">
                                    <MoreHorizontalIcon />
                                </Button>
                            </Report>
                        </div>
                        <div className="text-sm" id="comment-id h-fit">
                            {comment?.comment}
                        </div>
                    </div>
                </div>
                <div className="ml-[70px] mt-2 flex flex-row items-center gap-x-5">
                    <div className="space-x-1 w-fit flex flex-row items-center text-center">
                        <motion.button
                            onClick={(event) => handleReaction({ event: event, data: { resource_type: "comment", resource_id: comment?.id } })}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Heart fill={reacted ? "#DB2776" : "transparent"} className={cn("h-5 w-5", reacted ? "text-pink-600" : "")} />
                        </motion.button>
                        <p className="text-xs font-medium">{formatNumberWithSuffix(reactionCount)}</p>
                    </div>
                    <Button onClick={() => HandleReplyFire({ parent: comment?.parent ?? comment?.id, comment: comment })} className="h-6 px-4" size="sm" variant="ghost">Reply</Button>
                    <p className="text-xs text-muted-foreground">{RelativeTime(comment?.created_at)}</p>
                </div>
            </div>
            {comment?.reply_count > 0 && <button className="ml-[72px] mt-2 opacity-70 text-sm" onClick={handleReplyOpen}>{openReply ? `Hide replies` : `View replies(${comment?.reply_count})`}</button>}
            {(openReply && comment?.reply_count > 0) &&
                <section className="ml-16">
                    <Replies inputRef={inputRef} resource_type={resource_type} resource_id={resource_id} parent_id={comment?.id} />
                </section>
            }
        </>
    );
}

export default Comment;