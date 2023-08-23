import { Skeleton } from "@/components/ui/skeleton";

const PostLoading = ({ count }: { count?: number }) => {
    return (
        <div className="w-full min-w-[300px] max-w-[650px] rounded-md xsm:pl-4 pt-4 my-2 flex flex-col space-y-2">
            <div className="w-full flex items-center space-x-2">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="rounded h-4 w-[150px]" />
                    <Skeleton className="rounded h-2 w-[50px]" />
                </div>
            </div>
            <div className="space-y-1 w-full ml-12 max-w-full">
                <Skeleton className="rounded h-5 w-full" />
                <Skeleton className="rounded h-5 w-full" />
            </div>
        </div>
    );
}

export default PostLoading;