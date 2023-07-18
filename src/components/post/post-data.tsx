import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, Share2, MessageCircle, CalendarDays, Star } from "lucide-react"
import { PostType } from "@/types/post";
import Image from "next/image";
import { DateAndMonth, RelativeTime } from "@/components/time/Time";
import Linkify from "linkify-react";
import Link from "next/link";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import { guessMedia } from "@/lib/utils";

const renderLink = ({ attributes, content }: { attributes: any, content: string }) => {
    const { href, ...props } = attributes;
    return <Link href={href} {...props}>{content}</Link>;
};

const link_options = {
    formatHref: {
        mention: (href: string) => "http://localhost:3000/" + href,
        hashtag: (href: string) => "http://localhost:3000/tag/" + href.substr(1),
    },
    render: {
        hashtag: renderLink,
        mention: renderLink,
    },
}

const PostData = ({ post }: { post: PostType }) => {
    return (
        <div className="w-[550px] p-2">
            <div>
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
                            <HoverCard>
                                <HoverCardTrigger className="no-underline">
                                    <Link href={`/${post?.user?.user_name}`} className="font-medium no-underline">{`${post?.user?.first_name} ${post?.user?.last_name}`}</Link>
                                </HoverCardTrigger>
                                <HoverCardContent className="w-80">
                                    <div className="flex justify-between space-x-4">
                                        <Avatar>
                                            {post?.user?.profile_avatar ?
                                                <AvatarImage src={post?.user?.profile_avatar} alt={post?.user?.user_name} />
                                                :
                                                null
                                            }
                                            <AvatarFallback>{`${post?.user?.first_name?.substr(0, 1)}${post?.user?.last_name?.substr(0, 1)}`}</AvatarFallback>
                                        </Avatar>
                                        <div className="space-y-1">
                                            <div>
                                                <h4 className="text-sm font-semibold">{`${post?.user?.first_name} ${post?.user?.last_name}`}</h4>
                                                <p className="text-xs text-muted-foreground">{`@${post?.user?.user_name}`}</p>
                                            </div>
                                            <p className="text-sm">
                                                {post?.user?.bio ?? "No bio, Please nag this user into creating a bio for his account."}
                                            </p>
                                            <div>
                                                <div className="flex items-center pt-2">
                                                    <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
                                                    <span className="text-xs text-muted-foreground">
                                                        Joined {DateAndMonth(post?.user?.joined_date)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center pt-2">
                                                    <Star className="mr-2 h-4 w-4 opacity-70" />{" "}
                                                    <span className="text-xs text-muted-foreground">
                                                        The {post?.user?.id} user to join betenda
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </HoverCardContent>
                            </HoverCard>
                            <p className="text-xs text-muted-foreground">{`@${post?.user?.user_name}`}</p>
                        </div>
                        <span className="text-xs">•</span>
                        <p className="text-xs text-muted-foreground">{RelativeTime(post?.created_at)}</p>
                    </div>
                </div>
                <div className="p-2 text-sm" id="post">
                    <Linkify as="p" className="text-base mb-1"
                        options={link_options}>
                        {post?.content}
                    </Linkify>
                    {post?.media ?
                        guessMedia(post?.media) === "img" ?
                            <Image className="max-w-full object-cover h-auto rounded-md" src={post?.media} width="500" height="800" alt={post?.content ?? ""} />
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
            <section id="actions" className="flex flex-row justify-around">
                <div className="flex flex-row items-center text-center">
                    <Button variant={null} size="icon">
                        <Heart className="h-5 w-5" />
                    </Button>
                    <p className="text-xs font-medium">{post?.reactions?.reaction_count[0]?.count ?? 0}</p>
                </div>
                <div className="flex flex-row items-center text-center">
                    <Button variant={null} size="icon">
                        <MessageCircle className="h-5 w-5" />
                    </Button>
                    <p className="text-xs font-medium">13K</p>
                </div>
                <div>
                    <Button variant={null} size="icon">
                        <Share2 className="h-5 w-5" />
                    </Button>
                </div>
            </section>
        </div>
    );
}

export default PostData;