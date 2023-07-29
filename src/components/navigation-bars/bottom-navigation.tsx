import { BellIcon, HomeIcon, PlusIcon, SearchIcon, UserIcon } from "lucide-react";
import Link from "next/link";

const BottomNavigation = () => {
    return (
        <div className="h-12 p-1 sticky bottom-0 grid grid-cols-5 items-center gap-x-2 inset-x-0 bg-foreground border-t">
            <Link href="/" className="no-underline flex flex-col items-center">
                <HomeIcon size={25} />
                <p className="text-[10px] no-underline">Home</p>
            </Link>
            <Link href="/" className="no-underline flex flex-col items-center">
                <SearchIcon size={25} />
                <p className="text-[10px] no-underline">Search</p>
            </Link>
            <Link href="/contributions" className="flex flex-col items-center bg-gray-300/30 rounded-md px-2 py-1">
                <PlusIcon size={30} />
            </Link>
            <Link href="/notifications" className="no-underline flex flex-col items-center">
                <BellIcon size={25} />
                <p className="text-[10px] no-underline">Notifications</p>
            </Link>
            <Link href="/profile" className="no-underline flex flex-col items-center">
                <UserIcon size={25} />
                <p className="text-[10px] no-underline">Profile</p>
            </Link>
        </div>
    );
}

export default BottomNavigation;