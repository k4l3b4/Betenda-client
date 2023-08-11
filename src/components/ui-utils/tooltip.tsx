import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const TippyTool = ({ children, text, asChild = true, sideOffset }: { children: React.ReactElement, text: string, asChild?: boolean, sideOffset?: number }) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild={asChild}>
                    {children}
                </TooltipTrigger>
                <TooltipContent sideOffset={sideOffset}>
                    <p>{text}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

export default TippyTool;