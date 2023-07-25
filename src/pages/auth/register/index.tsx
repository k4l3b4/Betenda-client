"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { useRouter } from "next/router"
import Link from "next/link"
import { useMutation } from "@tanstack/react-query"
import Meta from "@/components/meta/meta"
import { registerUser } from "@/api/requests/auth/requests"
import { AxiosError } from "axios"
import { renderErrors } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

const formSchema = z.object({
  first_name: z.string().nonempty({ message: "First name is required" }),
  user_name: z.string().nonempty({ message: "Last name is required" }),
  email: z.string()
    .nonempty({ message: "Email is required" })
    .email("Invalid email"),
  password: z.string().min(8, {
    message: "Minimum of 8 characters allowed.",
  }),
  password2: z.string(),
  code: z.string().length(15, {
    message: "Invalid invitation code.",
  }),
}).refine((data) => data.password === data.password2, {
  path: ["password2"],
  message: "Passwords don't match",
});

const FirstForm = () => {
  const { toast } = useToast()
  const { mutate, isLoading } = useMutation({
    mutationFn: registerUser,
    onError: (error: AxiosError) => {
      console.log(error)
      if (!error?.response) {
        if (error?.code === "ERR_BAD_REQUEST") {
          toast({
            variant: "destructive",
            title: "Oops",
            description: "Malformed syntax or invalid request message framing"
          })
        } else if (error?.code === "ERR_CONNECTION_TIMED_OUT ") {
          toast({
            variant: "destructive",
            title: "Oops",
            description: "Connection timed out"
          })
        }
      }
      else if (error?.response) {
        toast({
          variant: "destructive",
          title: "Oops",
          description: <div dangerouslySetInnerHTML={{ __html: renderErrors(error?.response?.data) }} />
        })
      } else {
        toast({
          variant: "destructive",
          title: "Oops",
          description: "An error occurred"
        })
      }
    }
  })
  const router = useRouter()
  const { invitation_code } = router.query
  const codeParam = invitation_code as string

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      user_name: "",
      code: "",
      email: "",
      password: "",
      password2: "",
    },
  })

  // set the query params value in the field to avoid confusion
  useEffect(() => {
    if (codeParam && codeParam !== "") {
      form.resetField("code", { defaultValue: codeParam ?? "" })
    }
  }, [form, codeParam])

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { code, ...formData } = values;
    mutate({ values: formData, invitation_code: code })
  }

  return (
    <>
      <Meta title="Create an account with your invitation code" />
      <div className="flex h-screen w-full max-w-screen justify-center items-center px-1">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="bg-foreground px-4 py-10 space-y-8 w-full max-w-md rounded border">
            <h1 className="text-4xl font-semibold">Create an account</h1>
            <div className="w-full flex flex-row gap-x-2 items-center">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="ኬሮድ" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="user_name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>User name</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="user.name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="example@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full flex flex-row gap-x-2 items-center">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password2"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Confirm password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Confirm password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invitation code</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Invitation code" {...field} />
                  </FormControl>
                  <FormDescription>
                    Registration without an invite is not allowed
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <p className="text-sm">Already have an account, <Link href="/auth/login">login</Link>.</p>
            </div>
            <Button className="space-x-1" type="submit">
              {isLoading ?
                "Wait..."
                :
                "Register"
              }
            </Button>
          </form>
        </Form>
      </div>
    </>
  )
}

export default FirstForm