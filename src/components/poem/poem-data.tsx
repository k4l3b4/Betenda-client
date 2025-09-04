import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import ProfileHoverCard from "../profile-hover-card/profile-hover-card";
import Link from "next/link";
import { Button } from "../ui/button";
import { MoreHorizontalIcon } from "lucide-react";
import { RelativeTime } from "../time/Time";
import Report from "@/components/report/report";
import { PoemType } from "@/types/contributions";

const PoemData = ({ poem, className }: { poem: PoemType, className?: string }) => {
    return (
        <div className={cn('flex flex-col justify-start bg-foreground p-2 rounded-md gap-x-2', className)}>
            <div className="flex items-center gap-x-2 relative" id="user">
                <Avatar className="w-8 h-8">
                    {poem?.user?.profile_avatar ?
                        <AvatarImage src={poem?.user?.profile_avatar} alt={poem?.user?.user_name} />
                        :
                        null
                    }
                    <AvatarFallback>{`${poem?.user?.first_name?.substring(0, 1)}${poem?.user?.last_name?.substring(0, 1)}`}</AvatarFallback>
                </Avatar>
                <div className="flex items-baseline gap-x-2">
                    <div className="flex items-start justify-between">
                        <div className="z-50">
                            <ProfileHoverCard user={poem?.user}>
                                <Link onClick={(event) => event.stopPropagation()} href={`/${poem?.user?.user_name}`} className="font-medium no-underline hover:underline">{`${poem?.user?.first_name} ${poem?.user?.last_name}`}</Link>
                            </ProfileHoverCard>
                            <p className="text-xs text-muted-foreground">{`@${poem?.user?.user_name}`}</p>
                        </div>
                        <Report resource_id={poem?.id} resource_type="poem">
                            <Button onClick={(event) => event.stopPropagation()} className="w-10 h-5 absolute right-1 top-1" variant="ghost" size="icon">
                                <MoreHorizontalIcon />
                            </Button>
                        </Report>
                    </div>
                    <span className="text-xs">•</span>
                    <p className="text-xs text-muted-foreground">{RelativeTime(poem?.created_at)}</p>
                </div>
            </div>
            <div className="flex items-start gap-x-2 mt-3">
                <div className="h-full flex flex-col justify-between">
                    <div>
                        <h3 className="line-clamp-3">{poem?.poem}</h3>
                    </div>
                    <div>
                        Reactions
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PoemData;