import { registerLanguage } from "@/api/requests/contributions/requests"
import Meta from "@/components/meta/meta"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { renderErrors } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import * as z from "zod"

const formSchema = z.object({
    language: z.string().nonempty({ message: "The Language name is required" }),
    iso_code: z.string().nonempty({ message: "ISO code is required" }),
    glottolog_code: z.string()
        .nonempty({ message: "Glottolog code is required" }),
    language_type: z.string().nonempty({ message: "Language type is required" }),
});

const RegisterLanguages = () => {
    const router = useRouter()
    const { toast } = useToast()
    const { mutate, isLoading } = useMutation({
        mutationFn: registerLanguage,
        onSuccess: () => {
            toast({
                title: "Woo",
                description: "You have registered successfully",
                action: (
                    <ToastAction onClick={() => router.push(`/dashboard/languages`)} altText="Goto the languages list">Languages list</ToastAction>
                ),
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
            language: "",
            iso_code: "",
            glottolog_code: "",
            language_type: "SOURCE",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        mutate(values)
    }

    return (
        <>
            <Meta title="Register a language" />
            <div className="flex h-screen w-full max-w-screen justify-center items-center px-1">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex justify-center max-w-[550px] bg-foreground px-4 py-10 w-full rounded-md border">
                        <div className="max-w-md space-y-8">
                            <h1 className="text-4xl font-semibold">Register a language</h1>
                            <div className="w-full flex flex-col gap-y-2 items-center">
                                <FormField
                                    control={form.control}
                                    name="language"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>Language</FormLabel>
                                            <FormControl>
                                                <Input type="text" placeholder="Language" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="iso_code"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>ISO code</FormLabel>
                                            <FormControl>
                                                <Input type="text" placeholder="ISO code" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="glottolog_code"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>Glottlog code</FormLabel>
                                            <FormControl>
                                                <Input type="text" placeholder="Glottlog" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="language_type"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>Language type</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Language type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="SOURCE">Source</SelectItem>
                                                    <SelectItem value="TARGET">Target</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button disabled={isLoading} className="space-x-1" type="submit">
                                {isLoading ?
                                    "Wait..."
                                    :
                                    "Register"
                                }
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </>
    );
}

export default RegisterLanguages;