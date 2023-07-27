import { registerPoem } from "@/api/requests/contributions/poem/requests";
import SelectListbox from "@/components/select/select";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useContributionContext } from "@/context/contrib-context";
import { DataType } from "@/types/global";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
    poem: z.string().nonempty({ message: "The poem is required" }),
    recording: z.any().optional(),
    language: z.string().nonempty({ message: "The language is required" }),
})

const RegisterPoem = () => {
    const { toast } = useToast()
    const { targetLabelValuePairs, isLoading, isError, refetch } = useContributionContext()
    const [target, setTarget] = useState<DataType | null>(null)
    const { mutate, isLoading: registering, isError: error } = useMutation({
        mutationFn: registerPoem,
        onSuccess: () => {
            toast({
                title: "Wo hoo",
                description: "Amazing!, thank you for your contribution.",
            })
        }
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            poem: "",
            recording: "",
            language: "",
        },
    })
    function onSubmit(values: z.infer<typeof formSchema>) {
        mutate(values)
    }


    const handleTargetSelect = (value: DataType) => {
        setTarget(value)
        form.setValue('language', `${value?.value}`)
    }

    return (
        <div className="w-full">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="px-4 py-10 space-y-8 w-full rounded border">
                    <h1 className="text-4xl font-semibold">Contribute a poem!</h1>
                    <FormField
                        control={form.control}
                        name="poem"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Poem</FormLabel>
                                <FormControl>
                                    <Textarea className="max-h-[500px] bg-background" placeholder="Good morning" {...field} />
                                </FormControl>
                                <FormMessage />
                                <FormDescription>
                                    The language the poem is written in
                                </FormDescription>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="recording"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Recording</FormLabel>
                                <FormControl>
                                    <Input type="file" accept="audio/*" {...field} />
                                </FormControl>
                                <FormMessage />
                                <FormDescription>
                                    The poem in an optional audio recording
                                </FormDescription>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="language"
                        render={() => (
                            <FormItem className="w-full">
                                <FormLabel>Target Language</FormLabel>
                                <FormControl>
                                    <SelectListbox loading={isLoading} data={targetLabelValuePairs} placeholder="Select the language" selected={target} setSelected={(value) => handleTargetSelect(value)} />
                                </FormControl>
                                <FormMessage />
                                <FormDescription>
                                    The target language
                                </FormDescription>
                            </FormItem>
                        )}
                    />
                    <Button type="submit">{registering ? "Submitting..." : "Submit"}</Button>                </form>
            </Form>
        </div>
    );
}

export default RegisterPoem;