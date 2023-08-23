import { cn } from "@/lib/utils";
import { RoadMapType } from "@/types/roadmap";
import { DateAndMonth } from "../time/Time";

const RoadMapData = ({ goal, className }: { goal: RoadMapType, className?: string }) => {

    return (
        <div className={cn(
            "flex justify-center h-full pattern w-full min-w-[350px] p-4 pb-0",
            className,
        )}>
            <div className="max-w-2xl mt-32 space-y-12">
                <div className="relative">
                    <div className="w-[2px] h-36 bg-black dark:bg-white absolute -top-32 -left-8" />
                    <div className="w-6 h-0.5 bg-black dark:bg-white absolute top-4 -left-8" />
                    <h2>{goal?.goal_name}</h2>
                    <h4 className="opacity-60">{goal?.goal_desc}</h4>
                    <div className="flex gap-x-5 absolute -bottom-8">
                        <p className="font-medium opacity-60">{DateAndMonth(goal?.goal_set)}</p>
                        <p className="font-medium opacity-80">{DateAndMonth(goal?.goal_due)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RoadMapData;