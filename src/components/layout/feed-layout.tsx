import Trending from "@/components/trending/trending";
import Sidebar from "@/components/sidebar/sidebar";

const FeedLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="relative flex w-full flex-row justify-around px-2 gap-x-2 min-h-screen">
            <Sidebar />
            {children}
            <Trending />
        </div>
    );
}

export default FeedLayout;