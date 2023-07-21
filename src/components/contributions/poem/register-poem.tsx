import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
    poem: z.string().nonempty({ message: "The poem is required" }),
    recording: z.any().optional(),
    language: z.string().nonempty({ message: "The language is required" }),
})

const RegisterPoem = () => {
    const { mutate, isLoading } = useMutation({})

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            poem: "",
            recording: "",
            language: "",
        },
    })
    function onSubmit(values: z.infer<typeof formSchema>) {
    }
    return (
        <div className="w-full">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="px-4 py-10 space-y-8 w-full rounded border">
                    <h1 className="text-4xl font-semibold">Contribute a sentence!</h1>
                    <FormField
                        control={form.control}
                        name="poem"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Saying</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="English" {...field} />
                                </FormControl>
                                <FormMessage />
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

                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </div>
    );
}

export default RegisterPoem;