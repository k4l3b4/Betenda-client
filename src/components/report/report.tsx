import { CreateReportType } from "@/types/report";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { reportResource } from "@/api/requests/report/requests";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useToast } from "../ui/use-toast";
import { SubmitHandler, useForm } from "react-hook-form";
import { Form, FormMessage } from "../ui/form";


const violationTypes: CreateReportType[] = [
    {
        report_type: "Harassment or Bullying",
        report: "Reports related to users engaging in offensive, threatening, or demeaning behavior towards others.",
    },
    {
        report_type: "Hate Speech or Discrimination",
        report: "Reports related to content promoting racism, sexism, or any form of discrimination(in the context of our societal norms) against individuals or groups.",
    },
    {
        report_type: "Inappropriate Content",
        report: "Reports concerning explicit or adult content, violence, or any material that violates the app's content guidelines.",
    },
    {
        report_type: "Spam or Scams",
        report: "Reports for users or content that engage in spamming, phishing, or fraudulent activities.",
    },
    {
        report_type: "Impersonation or Fake Accounts",
        report: "Reports for users creating fake accounts or pretending to be someone else.",
    },
    {
        report_type: "Privacy Violations",
        report: "Reports related to the unauthorized sharing of personal information or content without consent.",
    },
]

const Report = ({ resource_id, resource_type, children }: { resource_type: string, resource_id: number, children: React.ReactNode }) => {
    const { toast } = useToast()
    const [step, setStep] = useState<1 | 2>(1)
    const [open, setOpen] = useState(false);
    const { mutate } = useMutation({
        mutationFn: reportResource,
        onSuccess: () => {
            toast({
                title: "Report submitted",
                description: "As always we appreciate your help in making Betenda a safer place",
            })
        },
        onError: () => {
            toast({
                title: "Report failed",
                description: `Failed to report this ${resource_type}`,
            })
        }
    })

    const handleMutation = (violation: CreateReportType) => {
        mutate({ values: violation, resource_id: resource_id, resource_type: resource_type, })
        setOpen(false)
    }

    const { register, handleSubmit, watch, formState: { errors, isValid }, } = useForm<CreateReportType>({})

    const onSubmit: SubmitHandler<CreateReportType> = (data) => console.log(data)

    const handleDialogClose = () => {
        if (isValid) {
            setOpen(false)
            setTimeout(() => {
                if (step === 2) {
                    setStep(1)
                }
            }, 300);
        }
    }

    return (
        <div>
            <Dialog open={open} onOpenChange={setOpen}>
                {children}
                <DialogContent className="h-auto max-w-[98%] md:max-w-[750px] px-2 sm:px-6 overflow-y-auto bg-foreground">
                    <div className="flex items-center justify-center p-2">
                        <div className="max-w-[650px] w-full h-auto z-[999] p-4 rounded-md bg-foreground">
                            {
                                step === 1 ? (
                                    <>
                                        <div className="w-full flex flex-col gap-y-2">
                                            {violationTypes?.map((violation) => {
                                                return (
                                                    <Button className="w-full text-start h-fit flex items-center justify-between rounded-md p-2 gap-x-2" onClick={() => handleMutation(violation)} variant="ghost" key={violation.report_type}>
                                                        <div className="w-full">
                                                            <h2>{violation.report_type}</h2>
                                                            <p className="opacity-70">{violation?.report}</p>
                                                        </div>
                                                        <ArrowRightIcon size={25} />
                                                    </Button>
                                                )
                                            })}
                                            <Button className="w-full text-start flex h-fit items-center justify-between rounded-md p-2 gap-x-2" onClick={() => setStep(2)} variant="ghost">
                                                <div>
                                                    <h2>Other violation</h2>
                                                    <p className="opacity-70">Any other violation you believe that this resource is committing</p>
                                                </div>
                                                <ArrowRightIcon size={25} />
                                            </Button>
                                        </div>
                                    </>
                                )
                                    :
                                    (
                                        <div className="space-y-4 relative">
                                            <Button onClick={() => setStep(1)} variant="ghost" className="absolute -top-14 -left-14"><ArrowLeftIcon /> back</Button>
                                            <h2>Tell us more</h2>
                                            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                                                <div>
                                                    <Label htmlFor="report_type">Violation type</Label>
                                                    <Input {...register("report_type", { required: true })} name="report_type" className="bg-foreground" type="text" placeholder={`What type of violation did this ${resource_type} commit`} />
                                                    {errors?.report_type && <span className="text-xs text-red-500">Report type is required</span>}
                                                </div>
                                                <div>
                                                    <Label htmlFor="report">Additional information<span className="text-xs opacity-70">{`(Optional)`}</span></Label>
                                                    <Textarea {...register("report")} name="report" className="bg-foreground" placeholder={`Optionally describe how/where and in what way this ${resource_type} committed the violation`} />
                                                </div>
                                                <Button type="submit" onClick={handleDialogClose} className="">Submit report</Button>
                                            </form>
                                        </div>
                                    )
                            }
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div >
    );
}

export default Report;