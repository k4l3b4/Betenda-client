import { registerSentence } from "@/api/requests/contributions/sentence/requests";
import SelectListbox from "@/components/select/select";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useContributionContext } from "@/context/contrib-context";
import { DataType } from "@/types/global";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
    source_language: z.string().nonempty({ message: "First name is required" }),
    sentence: z.string().nonempty({ message: "First name is required" }),
    target_language: z.string().nonempty({ message: "First name is required" }),
    translation: z.string().nonempty({ message: "First name is required" }),
})

const RegisterSentence = () => {
    const { toast } = useToast()
    const { sourceLabelValuePairs, targetLabelValuePairs, isLoading, isError, refetch } = useContributionContext()
    const [source, setSource] = useState<DataType | null>(null)
    const [target, setTarget] = useState<DataType | null>(null)


    const { mutate, isLoading: registering, isError: error } = useMutation({
        mutationFn: registerSentence,
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
            sentence: "",
            translation: "",
            source_language: "",
            target_language: "",
        },
    })
    function onSubmit(values: z.infer<typeof formSchema>) {
        mutate(values)
    }



    const handleSourceSelect = (value: DataType) => {
        setSource(value)
        form.setValue('source_language', `${value?.value}`)
    }

    const handleTargetSelect = (value: DataType) => {
        setTarget(value)
        form.setValue('target_language', `${value?.value}`)
    }


    return (
        <div className="w-full">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="px-4 py-10 space-y-8 w-full rounded border">
                    <h1 className="text-4xl font-semibold">Contribute a sentence!</h1>
                    <div className="flex flex-col justify-center xsm:flex-row xsm:items-center gap-2">
                        <FormField
                            control={form.control}
                            name="source_language"
                            render={() => (
                                <FormItem className="w-full">
                                    <FormLabel>Target Language</FormLabel>
                                    <FormControl>
                                        <SelectListbox loading={isLoading} data={sourceLabelValuePairs} placeholder="Select source the language" selected={source} setSelected={(value) => handleSourceSelect(value)} />
                                    </FormControl>
                                    <FormMessage />
                                    <FormDescription>
                                        The target language
                                    </FormDescription>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="sentence"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Sentence</FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder="Good morning" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    <FormDescription>
                                        The sentence in the source language
                                    </FormDescription>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex flex-col justify-center xsm:flex-row xsm:items-center gap-2">
                        <FormField
                            control={form.control}
                            name="target_language"
                            render={() => (
                                <FormItem className="w-full">
                                    <FormLabel>Target Language</FormLabel>
                                    <FormControl>
                                        <SelectListbox loading={isLoading} data={targetLabelValuePairs} placeholder="Select target the language" selected={target} setSelected={(value) => handleTargetSelect(value)} />
                                    </FormControl>
                                    <FormMessage />
                                    <FormDescription>
                                        The target language
                                    </FormDescription>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="translation"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Translation</FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder="ወሄም ዋሪም" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        The translation in the target language
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button type="submit">{registering ? "Submitting..." : "Submit"}</Button>
                </form>
            </Form>
        </div>
    );
}

export default RegisterSentence;