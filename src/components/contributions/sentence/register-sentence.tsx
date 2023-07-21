import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";

const formSchema = z.object({
    source_language: z.string().nonempty({ message: "First name is required" }),
    sentence: z.string().nonempty({ message: "First name is required" }),
    target_language: z.string().nonempty({ message: "First name is required" }),
    translation: z.string().nonempty({ message: "First name is required" }),
})

const RegisterSentence = () => {
    const { mutate, isLoading } = useMutation({})

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
    }
    return (
        <div className="w-full">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="px-4 py-10 space-y-8 w-full rounded border">
                    <h1 className="text-4xl font-semibold">Contribute a sentence!</h1>
                    <div className="flex flex-row items-center gap-x-2">
                        <FormField
                            control={form.control}
                            name="source_language"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Source Language</FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder="English" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        The source language, English, Amharic...
                                    </FormDescription>
                                    <FormMessage />
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
                    <div className="flex flex-row items-center gap-x-2">
                        <FormField
                            control={form.control}
                            name="target_language"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Target Language</FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder="ቸሃ" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        The target language/dialect, ቸሃ, ክስታኔ, ምሁር...
                                    </FormDescription>
                                    <FormMessage />
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
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </div>
    );
}

export default RegisterSentence;