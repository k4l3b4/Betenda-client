import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";

const formSchema = z.object({
    saying: z.string().nonempty({ message: "First name is required" }),
    language: z.string().nonempty({ message: "First name is required" }),
})

const RegisterSaying = () => {
    const { mutate, isLoading } = useMutation({})

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            saying: "",
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
                        name="saying"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Saying</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="A saying in guragigna" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="language"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Language</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="Good morning" {...field} />
                                </FormControl>
                                <FormMessage />
                                <FormDescription>
                                    The language the saying is written in
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

export default RegisterSaying;