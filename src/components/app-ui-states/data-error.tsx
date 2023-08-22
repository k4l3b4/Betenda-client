import { GhostIcon } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const DataError = ({ className, refetch, refetching, icon = true, message }: { className?: string, refetch?: () => void, refetching?: boolean, icon?: boolean | React.ReactElement, message?: string }) => {
    return (
        <div className={cn("flex flex-col justify-center items-center mt-3", className)}>
            <div className="opacity-60 mb-4 flex flex-col items-center">

                {icon == true ?
                    <GhostIcon size={120} strokeWidth={1.3} />
                    :
                    icon ? icon
                        :
                        null
                }

                <h3>{message ? message : 'An unexpected Error occurred'}</h3>
            </div>
            <Button disabled={refetching} onClick={refetch}>{refetching ? "Retrying" : "Retry"}</Button>
        </div>
    );
}

export default DataError;