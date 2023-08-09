import { FrownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const NoData = ({ className, icon = true, message, children }: { className?: string, icon?: boolean | React.ReactElement, message: string, children?: React.ReactNode }) => {
    return (
        <div className={cn("flex flex-col justify-center items-center mt-3", className)}>
            <div className="opacity-60 mb-4 flex flex-col items-center">

                {icon == true ?
                    <FrownIcon size={120} strokeWidth={1.3} />
                    :
                    icon ? icon
                        :
                        null
                }
                <h3>{message}</h3>
                {children}
            </div>
        </div>
    );
}

export default NoData;