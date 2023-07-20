import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, Share2, MessageCircle, CalendarDays, Star } from "lucide-react"
import { PostType } from "@/types/post";
import Image from "next/image";
import { RelativeTime } from "@/components/time/Time";
import Link from "next/link";
import { guessMedia } from "@/lib/utils";
import { DialogContent, DialogTrigger } from "../ui/dialog";
import { Dialog } from "@radix-ui/react-dialog";
import CreatePost from "./create-post";
import convertTextToLinks from "../convert-text-to-links/convert-text-to-links";
import ReplyPost from "./reply-post";
import ProfileHoverCard from "../profile-hover-card/profile-hover-card";


const PostData = ({ post }: { post: PostType }) => {
    return (
        <div className="relative w-full max-w-[650px] rounded-md p-4 my-2 bg-foreground">
            <div className="relative">
                {post?.thread?.length > 0 ?
                    <span className="rounded-full absolute w-[3px] h-full left-5 top-12 bg-gray-400/50" />
                    :
                    null
                }
                <div className="flex items-center gap-x-2" id="user">
                    <Avatar>
                        {post?.user?.profile_avatar ?
                            <AvatarImage src={post?.user?.profile_avatar} alt={post?.user?.user_name} />
                            :
                            null
                        }
                        <AvatarFallback>{`${post?.user?.first_name?.substr(0, 1)}${post?.user?.last_name?.substr(0, 1)}`}</AvatarFallback>
                    </Avatar>
                    <div className="flex items-baseline gap-x-2">
                        <div>
                            <ProfileHoverCard user={post?.user}>
                                <Link href={`/${post?.user?.user_name}`} className="font-medium no-underline">{`${post?.user?.first_name} ${post?.user?.last_name}`}</Link>
                            </ProfileHoverCard>
                            <p className="text-xs text-muted-foreground">{`@${post?.user?.user_name}`}</p>
                        </div>
                        <span className="text-xs">•</span>
                        <p className="text-xs text-muted-foreground">{RelativeTime(post?.created_at)}</p>
                    </div>
                </div>
                <div className="ml-10 max-w-full p-2 text-sm" id="post">
                    <p className="text-base mb-1 link">{convertTextToLinks(post?.content as string)}</p>
                    {post?.media ?
                        guessMedia(post?.media) === "img" ?
                            <Image className="w-full max-w-full object-cover h-auto rounded-md" src={post?.media} width="500" height="800" alt={post?.content ?? ""} />
                            :
                            guessMedia(post?.media) === "vid" ?
                                <video controls className="w-full max-w-full object-cover h-auto rounded-md" src={post?.media}></video>
                                :
                                null
                        :
                        null
                    }
                </div>
            </div>
            <section id="actions" className="w-full flex flex-row justify-around">
                <div className="flex flex-row items-center text-center">
                    <Button className="space-x-1 w-fit" variant={null} size="icon">
                        <Heart className="h-5 w-5" />
                        <p className="text-xs font-medium">{post?.reactions?.reaction_count[0]?.count ?? "9.5K"}</p>
                    </Button>
                </div>
                <div className="flex flex-row items-center text-center">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="space-x-1 w-fit" variant={null} size="icon">
                                <MessageCircle className="h-5 w-5" />
                                <p className="text-xs font-medium">{post?.reactions?.reaction_count[0]?.count ?? "2.9K"}</p>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="w-full max-w-[700px] bg-foreground">
                            <CreatePost placeholder="Reply to your hearts content" parent_id={post?.id} />
                        </DialogContent>
                    </Dialog>
                </div>
                <div>
                    <Button variant={null} size="icon">
                        <Share2 className="h-5 w-5" />
                    </Button>
                </div>
            </section>
            <section id="thread">
                {post?.thread?.length > 0 ?
                    post?.thread?.slice(0, 2)?.map((post, index) => {
                        const showLine = index === 0 && post?.thread?.length > 1;
                        return (
                            <section className="relative" key={post?.id}>
                                {showLine ?
                                    <span className="rounded-full absolute w-[3px] h-[80%] left-5 top-16 bg-gray-400/50" />
                                    :
                                    null
                                }
                                <ReplyPost post={post} parent_id={post?.id} />
                            </section>
                        )
                    })
                    :
                    null
                }
            </section>
        </div>
    );
}

export default PostData;