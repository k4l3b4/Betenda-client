import { registerWord } from "@/api/requests/contributions/word/requests";
import SelectListbox from "@/components/select/select";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useContributionContext } from "@/context/contrib-context";
import { renderErrors } from "@/lib/utils";
import { DataType } from "@/types/global";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
    source_language: z.string().nonempty({ message: "Source language required" }),
    word: z.string().nonempty({ message: "Source word required" }),
    target_language: z.string().nonempty({ message: "Target language required" }),
    translation: z.string().nonempty({ message: "Word translation required" }),
    // synonym: z.any().optional(),
    // antonym: z.any().optional(),
})

const RegisterWord = () => {
    const { toast } = useToast()
    const { sourceLabelValuePairs, targetLabelValuePairs, isLoading, isError, refetch } = useContributionContext()
    const [source, setSource] = useState<DataType | null>(null)
    const [target, setTarget] = useState<DataType | null>(null)


    const { mutate, isLoading: registering, isError: error } = useMutation({
        mutationFn: registerWord,
        onSuccess: () => {
            toast({
                title: "Wo hoo",
                description: "Amazing!, thank you for your contribution.",
            })
        },
        onError: (error: AxiosError) => {
            console.log(error);
            if (!error?.response) {
                if (error?.code === "ERR_BAD_REQUEST") {
                    toast({
                        variant: "destructive",
                        title: "Oops",
                        description: "Malformed syntax or invalid request message framing"
                    });
                } else if (error?.code === "ERR_CONNECTION_TIMED_OUT") {
                    toast({
                        variant: "destructive",
                        title: "Oops",
                        description: "Connection timed out"
                    });
                }
            } else if (error?.response) {
                toast({
                    variant: "destructive",
                    title: "Oops",
                    description: (
                        <div dangerouslySetInnerHTML={{ __html: renderErrors(error?.response?.data) }} />
                    )
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "Oops",
                    description: "An error occurred"
                });
            }
        }
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            word: "",
            translation: "",
            source_language: "",
            target_language: "",
            // synonym: [],
            // antonym: [],
        },
    })

    const handleSourceSelect = (value: DataType) => {
        setSource(value)
        form.setValue('source_language', `${value?.value}`)
    }

    const handleTargetSelect = (value: DataType) => {
        setTarget(value)
        form.setValue('target_language', `${value?.value}`)
    }


    function onSubmit(values: z.infer<typeof formSchema>) {
        mutate(values)
    }


    return (
        <div className="w-full">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="px-4 py-10 space-y-8 w-full rounded border">
                    <h1 className="text-4xl font-semibold">Contribute a word!</h1>
                    <div className="flex flex-col justify-center xsm:flex-row xsm:items-center gap-2">
                        <FormField
                            control={form.control}
                            name="source_language"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Source language</FormLabel>
                                    <FormControl>
                                        <SelectListbox loading={isLoading} data={sourceLabelValuePairs} placeholder="Select the source language" selected={source} setSelected={(value) => handleSourceSelect(value)} />
                                    </FormControl>
                                    <FormMessage />
                                    <FormDescription>
                                        The source language
                                    </FormDescription>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="word"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Word</FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder="house" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    <FormDescription>
                                        The word in the source language
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
                                        <SelectListbox loading={isLoading} data={targetLabelValuePairs} placeholder="Select the source language" selected={target} setSelected={(value) => handleTargetSelect(value)} />
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
                                        <Input type="text" placeholder="ጌ" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        The translation in the target language
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    {/* <div className="flex flex-col justify-center xsm:flex-row xsm:items-center gap-2">
                        <FormField
                            control={form.control}
                            name="synonym"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Synonyms</FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder="Start typing..." {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Synonyms of the word
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="antonym"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Antonyms</FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder="Start typing..." {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Antonyms of the word
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div> */}
                    <Button type="submit">{registering ? "Submitting.." : "Submit"}</Button>
                </form>
            </Form>
        </div>
    );
}

export default RegisterWord;