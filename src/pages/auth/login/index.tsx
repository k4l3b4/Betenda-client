"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import Meta from "@/components/meta/meta"
import { useUserContext } from "@/context/user-context"
import Link from "next/link"

const formSchema = z.object({
    email: z.string({ required_error: "Email is required", }),
    password: z.string({ required_error: "Password is required", }),
})

const LoginForm = () => {
    const { LoginUser, LoginLoading } = useUserContext()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })
    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
        LoginUser(values)
    }
    return (
        <>
            <Meta title="Login to your existing account" />
            <div className="flex h-screen w-screen justify-center items-center px-1">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex justify-center max-w-[500px] bg-foreground px-2 py-10 w-full rounded-md border">
                        <div className="max-w-md space-y-8">

                            <h1 className="text-4xl font-semibold">Login</h1>
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="Email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="shadcn" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div>
                                <Link className="text-sm" href="/auth/register">Forgot Password?</Link>
                                <p className="text-sm">Don&apos;t have an account, <Link href="/auth/register">create an account</Link></p>
                            </div>
                            <Button disabled={LoginLoading} type="submit">{LoginLoading ? "Submitting" : "Submit"}</Button>
                        </div>
                    </form>
                </Form>
            </div>
        </>
    )
}

export default LoginForm