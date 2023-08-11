'use client'
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { formatNumberWithSuffix } from "@/lib/utils";
import { UserType } from "@/types/global";
import { Separator } from "@radix-ui/react-separator";
import { CalendarDaysIcon, StarIcon } from "lucide-react";
import { DateAndMonth } from "@/components/time/Time";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

const ProfileHoverCard = ({ user, children }: { user: UserType, children: React.ReactElement }) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);
    return (
        <HoverCard>
            <HoverCardTrigger asChild>
                {children}
            </HoverCardTrigger>
            {!isClient ?
                null
                :
                createPortal( //Thanks to ben awad
                    <HoverCardContent className="w-80 z-[999]">
                        <div className="">
                            <div className="flex flex-col justify-between space-y-4">
                                <div className="flex items-center justify-between">
                                    <Avatar className="w-12 h-12">
                                        {user?.profile_avatar ?
                                            <AvatarImage src={user?.profile_avatar} alt={user?.user_name} />
                                            :
                                            null
                                        }
                                        <AvatarFallback>{`${user?.first_name?.substr(0, 1)}${user?.last_name?.substr(0, 1)}`}</AvatarFallback>
                                    </Avatar>
                                </div>
                                <div className="space-y-1">
                                    <div>
                                        <h4 className="text-sm font-semibold">{`${user?.first_name} ${user?.last_name}`}</h4>
                                        <p className="text-xs text-muted-foreground">{`@${user?.user_name}`}</p>
                                    </div>
                                    <p className="text-sm">
                                        {user?.bio ?? "No bio, Please nag this user into creating a bio for his account."}
                                    </p>
                                    <div>
                                        <div className="flex items-center pt-2">
                                            <CalendarDaysIcon className="mr-2 h-4 w-4 opacity-70" />{" "}
                                            <span className="text-xs text-muted-foreground">
                                                Joined {DateAndMonth(user?.joined_date)}
                                            </span>
                                        </div>
                                        <div className="flex items-center pt-2">
                                            <StarIcon className="mr-2 h-4 w-4 opacity-70" />{" "}
                                            <span className="text-xs text-muted-foreground">
                                                The {user?.id} user to join betenda
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full mt-4 px-6 h-8 flex items-center justify-between">
                                <div className="text-center">
                                    <p className="font-bold text-xl">{formatNumberWithSuffix(user?.following_count)}</p>
                                    <p className="font-medium text-xs opacity-70">Following</p>
                                </div>
                                <Separator orientation="vertical" />
                                <div className="text-center">
                                    <p className="font-bold text-xl">{formatNumberWithSuffix(user?.followers_count)}</p>
                                    <p className="font-medium text-xs opacity-70">Followers</p>
                                </div>
                            </div>
                        </div>
                    </HoverCardContent>,
                    document.querySelector("#__next")!
                )}
        </HoverCard>
    );
}

export default ProfileHoverCard;