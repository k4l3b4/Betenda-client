import TippyTool from "@/components/ui-utils/tooltip";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { InfinitePostsType } from "@/types/post";
import { useQueryClient } from "@tanstack/react-query";
import { BellIcon, FeatherIcon, HomeIcon, PlusIcon, SearchIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import CreatePost from "@/components/post/create-post";
import Hider from "@/components/comp-hider/hider";
import { useUserContext } from "@/context/user-context";


const BottomNavigation = () => {
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
    return (
        <div className="h-12 z-[999] p-1 sticky bottom-0 grid grid-cols-5 items-center justify-center gap-x-2 inset-x-0 bg-foreground border-t">
            <Hider routes={['/contribute', '/contribute/',]}>
                <div className="fixed bottom-14 right-1">
                    <Dialog>
                        <TippyTool asChild text="Create post">
                            <DialogTrigger onClick={(event) => event?.stopPropagation()} className="left-0 w-12 h-12 rounded-full border bg-foreground shadow flex items-center justify-center">
                                <PlusIcon strokeWidth={1.5} className="h-[2em] w-[2em]" />
                            </DialogTrigger>
                        </TippyTool>
                        <DialogContent className="w-full flex justify-center rounded-md max-w-[700px] bg-foreground px-1">
                            <CreatePost onSuccess={(data) => onMutationSuccess(data)} placeholder="Create a new post" />
                        </DialogContent>
                    </Dialog>
                </div>
            </Hider>
            <Link href="/" className="no-underline flex flex-col items-center">
                <HomeIcon size={25} strokeWidth={1.5} />
                <p className="text-[10px] no-underline">Home</p>
            </Link>
            <Link href="/" className="no-underline flex flex-col items-center">
                <SearchIcon size={25} strokeWidth={1.5} />
                <p className="text-[10px] no-underline">Search</p>
            </Link>
            <div className="flex flex-col items-center">
                <Link href="/contribute" className="bg-background max-w-[60px] rounded-md px-2 py-1">
                    <FeatherIcon size={28} strokeWidth={1.5} />
                </Link>
            </div>
            <Link href="/notifications" className="no-underline flex flex-col items-center relative">
                {User?.unread_count! > 0 &&
                    <span className="z-50 rounded-full text-[11px] font-medium absolute h-4 w-4 bg-red-500 flex items-center justify-center ring ring-background left-5 text-white">{User?.unread_count}</span>
                }
                <BellIcon size={25} strokeWidth={1.5} />
                <p className="text-[10px] no-underline">Notifications</p>
            </Link>
            <Link href="/profile" className="no-underline flex flex-col items-center">
                <UserIcon size={25} strokeWidth={1.5} />
                <p className="text-[10px] no-underline">Profile</p>
            </Link>
        </div >
    );
}

export default BottomNavigation;