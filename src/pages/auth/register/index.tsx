"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import Meta from "@/components/meta/meta"

const formSchema = z.object({
    first_name: z.string({ required_error: "First name is required" }),

    last_name: z.string({ required_error: "Last name is required" }),
    user_name: z.string().min(4, {
        message: "Minimum of 4 characters allowed.",
    }),
    sex: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    birth_date: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    email: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    password: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    password2: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    terms: z.boolean(),
})

const RegisterForm = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            user_name: "",
            sex: "",
            birth_date: "",
            email: "",
            terms: false,
        },
    })
    function onSubmit(values: z.infer<typeof formSchema>) {
        // 
    }
    return (
        <>
            <Meta title="Create an account with your invitation code" />
            <div className="flex h-screen w-screen justify-center items-center">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="px-4 py-10 space-y-8 w-full max-w-md rounded border">
                        <h1 className="text-4xl font-semibold">Create an account</h1>
                        <div className="w-full flex flex-row gap-x-2 items-center">
                            <FormField
                                control={form.control}
                                name="first_name"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>First name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="First name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="last_name"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Last name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Last name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="user_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="shadcn" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is your public display name.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Register</Button>
                    </form>
                </Form>
            </div>
        </>
    )
}

export default RegisterForm