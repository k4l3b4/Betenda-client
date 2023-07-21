import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useContributionContext } from "@/context/contrib-context";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
    source_language: z.string().nonempty({ message: "Source language required" }),
    word: z.string().nonempty({ message: "Source word required" }),
    target_language: z.string().nonempty({ message: "Target language required" }),
    translation: z.string().nonempty({ message: "Word translation required" }),
    synonym: z.string().optional(),
    antonym: z.string().optional(),
})

const RegisterWord = () => {
    const { sourceLanguages, targetLanguages, isLoading, isError, refetch } = useContributionContext()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            word: "",
            translation: "",
            source_language: "",
            target_language: "",
            synonym: "",
            antonym: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
    }



    return (
        <div className="w-full">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="px-4 py-10 space-y-8 w-full rounded border">
                    <h1 className="text-4xl font-semibold">Contribute a word!</h1>
                    <div className="flex flex-row items-center justify-between gap-x-2">
                        <FormField
                            control={form.control}
                            name="source_language"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Source language</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select the source language" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Languages</SelectLabel>
                                                {sourceLanguages?.map((lang) => {
                                                    return (
                                                        <SelectItem key={lang?.id} value={lang?.id}>{lang?.language}</SelectItem>
                                                    )
                                                })}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
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
                    <div className="flex flex-row items-center gap-x-2">
                        {/* <FormField
                            control={form.control}
                            name="target_language"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Target Language</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select the target language" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {targetLanguages?.map(lang =>
                                                <SelectItem onSelect={(value) => console.log(value)} key={lang?.id} value={lang?.id}>{lang?.language}</SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                    <FormDescription>
                                        The target language/dialect, ቸሃ, ክስታኔ, ምሁር...
                                    </FormDescription>
                                </FormItem>
                            )}
                        /> */}
                        <FormField
                            control={form.control}
                            name="target_language"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Target Language</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a verified email to display" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Languages</SelectLabel>
                                                <SelectItem value="apple">Apple</SelectItem>
                                                <SelectItem value="banana">Banana</SelectItem>
                                                <SelectItem value="blueberry">Blueberry</SelectItem>
                                                <SelectItem value="grapes">Grapes</SelectItem>
                                                <SelectItem value="pineapple">Pineapple</SelectItem>
                                                {/* {
                                                    targetLanguages?.map((lang) => {
                                                        return (
                                                            <SelectItem key={lang?.id} value={lang?.id}>{lang?.language}</SelectItem>
                                                        )
                                                    })
                                                } */}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
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
                    <div className="flex flex-row items-center gap-x-2">
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
                    </div>
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </div>
    );
}

export default RegisterWord;