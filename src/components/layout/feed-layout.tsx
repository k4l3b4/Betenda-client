import Trending from "@/components/trending/trending";
import Sidebar from "@/components/sidebar/sidebar";
import { cn } from "@/lib/utils";
import useMediaQuery from "@mui/material/useMediaQuery";

type FeedLayoutType = {
    children: React.ReactNode,
    sideBar?: "mount" | "unmount",
    trending?: "mount" | "unmount",
    className?: string,
}

const FeedLayout: React.FC<FeedLayoutType> = ({ children, sideBar = "mount", trending = "mount", className }) => {
    const trendingMount = useMediaQuery('(min-width: 1097px)')
    const sidebarMount = useMediaQuery('(min-width: 851px)')


    return (
        <div className={cn("relative flex w-full flex-row justify-between px-2 gap-x-1 min-h-screen", className)}>
            {(sideBar === "mount" && sidebarMount) &&
                <Sidebar />
            }

            {children}

            {(trending === "mount" && trendingMount) &&
                <Trending />
            }
        </div>
    );
}

export default FeedLayout;