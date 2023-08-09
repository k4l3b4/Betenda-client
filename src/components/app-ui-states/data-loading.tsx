import { cn } from "@/lib/utils";
import { CircularProgress } from "@mui/material";

const DataLoading = ({ className }: { className?: string }) => {
    return (
        <div className={cn("flex flex-col items-center justify-center", className)}>
            <CircularProgress color="inherit" thickness={4} size="2.3rem" />
            <p className="opacity-70 text-sm mt-4">Loading...</p>
        </div>
    );
}

export default DataLoading;