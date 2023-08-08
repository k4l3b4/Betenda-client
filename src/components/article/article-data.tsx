import { cn, formatNumberWithSuffix } from "@/lib/utils";
import { ArticleType } from "@/types/article";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import ProfileHoverCard from "../profile-hover-card/profile-hover-card";
import Link from "next/link";
import { Button } from "../ui/button";
import { MoreHorizontalIcon } from "lucide-react";
import { RelativeTime } from "../time/Time";
import Report from "@/components/report/report";

const ArticleData = ({ article, className }: { article: ArticleType, className?: string }) => {
    return (
        <div className={cn('flex flex-col justify-start bg-foreground p-2 rounded-md gap-x-2', className)}>
            <div className="flex items-center gap-x-2 relative" id="user">
                <Avatar className="w-8 h-8">
                    {article?.authors[0]?.profile_avatar ?
                        <AvatarImage src={article?.authors[0]?.profile_avatar} alt={article?.authors[0]?.user_name} />
                        :
                        null
                    }
                    <AvatarFallback>{`${article?.authors[0]?.first_name?.substring(0, 1)}${article?.authors[0]?.last_name?.substring(0, 1)}`}</AvatarFallback>
                </Avatar>
                <div className="flex items-baseline gap-x-2">
                    <div className="flex items-start justify-between">
                        <div className="z-50">
                            <ProfileHoverCard user={article?.authors[0]}>
                                <Link onClick={(event) => event.stopPropagation()} href={`/${article?.authors[0]?.user_name}`} className="font-medium no-underline hover:underline">{`${article?.authors[0]?.first_name} ${article?.authors[0]?.last_name}`}</Link>
                            </ProfileHoverCard>
                            <p className="text-xs text-muted-foreground">{`@${article?.authors[0]?.user_name}`}</p>
                        </div>
                        <Report resource_id={article?.id} resource_type="article">
                            <Button onClick={(event) => event.stopPropagation()} className="w-10 h-5 absolute right-1 top-1" variant="ghost" size="icon">
                                <MoreHorizontalIcon />
                            </Button>
                        </Report>
                    </div>
                    <span className="text-xs">•</span>
                    <p className="text-xs text-muted-foreground">{RelativeTime(article?.published_date)}</p>
                </div>
            </div>
            <div className="flex items-start gap-x-2 mt-3">
                <>
                    {
                        article?.image ?
                            <Image className="w-32 h-32 object-cover rounded-md" src={article?.image} alt={article?.title} width="600" height="600" />
                            :
                            null
                    }
                </>
                <div className="h-full flex flex-col justify-between">
                    <div>
                        <h3 className="line-clamp-2">{article?.title}</h3>
                        <p className="line-clamp-3 opacity-70">{article?.desc}</p>
                    </div>
                    <div>
                        {article?.reactions?.reaction_count && article?.reactions?.reaction_count?.length > 0 &&
                            article?.reactions?.reaction_count.slice(0, 5)?.sort((a, b) => b.count - a.count).map((react) => {
                                return (
                                    <span className="space-x-1 w-fit text-xl flex flex-row items-center text-center" key={react?.reaction}>
                                        {react?.reaction}
                                        <p className="text-xs font-medium">{formatNumberWithSuffix(react?.count)}</p>
                                    </span>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ArticleData;