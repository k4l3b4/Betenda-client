import { useUserContext } from "@/context/user-context";
import { cn } from "@/lib/utils";
import { InfinitePostsType } from "@/types/post";
import { useQueryClient } from "@tanstack/react-query";
import { BellIcon, BookmarkIcon, CompassIcon, FeatherIcon, GithubIcon, HelpingHandIcon, HomeIcon, NewspaperIcon, PlusIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import CreatePost from "../post/create-post";

const Sidebar = () => {
    const { User } = useUserContext()
    const queryClient = useQueryClient()

    const onMutationSuccess = (data: any) => {
        const currentData = queryClient.getQueryData<InfinitePostsType>(['posts']);

        if (currentData) {
            const updatedResults = [
                data?.data,
                ...(currentData.pages[0]?.results || []),
            ];
            queryClient.setQueryData<InfinitePostsType>(['posts'], {
                pages: [
                    {
                        total_items: currentData.pages[0]?.total_items,
                        page: currentData.pages[0]?.page,
                        page_size: currentData.pages[0]?.page_size,
                        results: updatedResults,
                    },
                    ...currentData.pages.slice(1),
                ],
                pageParams: currentData.pageParams,
            });
        }
    }
    // const queryClient = useQueryClient()
    // const { data: top_accounts } = useQuery({ queryKey: ['top_accounts'], queryFn: getTopAccounts })
    // const { data: mutual_friends } = useQuery({ queryKey: ['mutual_friends'], queryFn: getMutualFriends })

    // const onSuccess = (newData: any, isArray = false) => {
    //     updateQueryData(queryClient, ['top_accounts'], newData, isArray);
    // };

    // const { follow, isLoading: following } = useFollowUser(null, (newData) => {
    //     onSuccess(newData, true);
    // });

    // const { unFollow, isLoading: unFollowing } = useUnFollowUser(null, (newData) => {
    //     onSuccess(newData, true); // Set to true if the new data is an array
    // });

    // const { accept, isLoading: accepting } = useAcceptFollowRequest(null, (newData) => {
    //     onSuccess(newData, true); // Set to true if the new data is an array
    // });

    const className = buttonVariants({ variant: "ghost", className: "norm-link font-normal !justify-start xsm:w-fit sbr:w-full xsm:!px-2 sbr:px-4 gap-x-4" })

    return (
        <aside suppressHydrationWarning className="rounded-md w-full xsm:max-w-fit sbr:max-w-[250px] sticky left-0 top-4 h-[calc(100vh-10vh)] px-1 xsm:bg-foreground sbr:bg-transparent">
            <nav className="rounded-md  xsm:py-4 xsm:p-0 sbr:p-4 flex flex-col xsm:items-center sbr:items-start justify-between h-full">
                <div>
                    <h3 className="flex items-center xsm:px-2 sbr:px-4">B<span className="xsm:hidden sbr:block">etenda</span></h3>
                </div>
                <div className="space-y-6 flex flex-col xsm:items-center sbr:items-start xsm:w-fit sbr:w-full">
                    <Link href="/" className={className}>
                        <HomeIcon size={25} strokeWidth={1.5} />
                        <p className="text-lg xsm:hidden sbr:block">Home</p>
                    </Link>
                    <Link href="/notifications" className={cn(className, "relative")}>
                        <BellIcon size={25} strokeWidth={1.5} />
                        {User?.unread_count! > 0 &&
                            <span className="z-50 rounded-full text-[11px] font-medium absolute h-4 w-4 bg-red-500 flex items-center justify-center ring ring-background top-0.5 left-1 text-white">{User?.unread_count}</span>
                        }
                        <p className="text-lg xsm:hidden sbr:block">Notifications</p>
                    </Link>
                    <Link href="#explore" className={cn(className, 'cursor-default opacity-60')} >
                        <CompassIcon size={25} strokeWidth={1.5} />
                        <p className="text-lg xsm:hidden sbr:block">Explore</p>
                    </Link>
                    <Link href="/articles" className={className} >
                        <NewspaperIcon size={25} strokeWidth={1.5} />
                        <p className="text-lg xsm:hidden sbr:block">Articles</p>
                    </Link>
                    <Link href="/bookmark" className={className} >
                        <BookmarkIcon size={25} strokeWidth={1.5} />
                        <p className="text-lg xsm:hidden sbr:block">BookMark</p>
                    </Link>
                    <Link href="/donate" className={className} >
                        <HelpingHandIcon size={25} strokeWidth={1.5} />
                        <p className="text-lg xsm:hidden sbr:block">Support</p>
                    </Link>
                    <Link href="https://github.com/k4l3b4/betenda" target="_blank" rel="nofollow noreferer" className={className} >
                        <GithubIcon size={25} strokeWidth={1.5} />
                        <p className="text-lg xsm:hidden sbr:block">Github</p>
                    </Link>
                    <Link href="/profile" className={className} >
                        <UserIcon strokeWidth={1.5} size={25} />
                        <p className="text-lg xsm:hidden sbr:block">Account</p>
                    </Link>
                    <Dialog>
                        <DialogTrigger className={className}>
                            <PlusIcon strokeWidth={1.5} size={25} />
                            <p className="text-lg xsm:hidden sbr:block">Compose</p>
                        </DialogTrigger>
                        <DialogContent className="w-full flex justify-center rounded-md max-w-[700px] bg-foreground px-1">
                            <CreatePost onSuccess={(data) => onMutationSuccess(data)} placeholder="Create a new post" />
                        </DialogContent>
                    </Dialog>
                </div>
                <Link href="/contribute" className={className} >
                    <FeatherIcon size={25} strokeWidth={1.5} />
                    <p className="text-lg xsm:hidden sbr:block">Contribute</p>
                </Link>
            </nav>
        </aside>
    );
}

export default Sidebar;