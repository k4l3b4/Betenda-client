"use client"
import { updateArticle } from '@/api/requests/article/requests'
import { getAuthors } from '@/api/requests/user/requests'
import Meta from '@/components/meta/meta'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ToastAction } from '@/components/ui/toast'
import { useToast } from '@/components/ui/use-toast'
import { useUserContext } from '@/context/user-context'
import { useGetArticle } from '@/hooks/utils'
import { debounce } from '@/lib/utils'
import { ArticleType } from '@/types/article'
import { Switch } from '@headlessui/react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from '@tanstack/react-query'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Controller, useForm } from "react-hook-form"
import { ReactTags } from 'react-tag-autocomplete'
import * as z from "zod"

const FilePreview = dynamic(() => import('@/components/file-preview/file-preview'), {
    loading: () => <div className="w-full h-full flex items-center justify-center"><p className="font-medium opacity-70">Loading...</p></div>,
})

const Editor = dynamic(() => import('@/components/text-editor/text-editor'), {
    loading: () => <div className="w-full h-full flex items-center justify-center"><p className="font-medium opacity-70">Loading...</p></div>,
})

type Authors = {
    value: number;
    label: string;
}

type AuthorsType = {
    id: number,
    user_name: string,
    first_name: string,
    last_name: string
}


const MAX_FILE_SIZE = 500000;
const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif",
];

export const FormSchema = z.object({
    title: z.string()
        .max(100, {
            message: "The title can't be longer than 100 characters",
        }).nonempty({ message: "Required" }),
    desc: z.string()
        .max(150, {
            message: "The description can't be longer than 150 characters",
        }).nonempty({ message: "Required" }),
    body: z.string().nonempty("You can't leave the main part empty"),
    image: z.any().optional().refine((file) => {
        if (file !== undefined && file !== null && file !== "") {
            return file.size <= MAX_FILE_SIZE;
        }
        return true;
    }, "The max file size at the moment is 5MB")
        .refine((file) => {
            if (file !== undefined && file !== null && file !== "") {
                return ACCEPTED_IMAGE_TYPES.includes(file.type);
            }
            return true;
        }, "File type is not supported."),
    authors: z.string(),
    status: z.string(),
    featured: z.boolean(),
})

const UpdateArticle = () => {
    const { toast } = useToast()
    const [loading, setLoading] = useState<boolean>(true)
    const [data, setData] = useState<AuthorsType[]>([])
    const [suggestion, setSuggestion] = useState<Authors[]>([])
    const { User } = useUserContext()
    const router = useRouter()
    const { slug } = router.query as ParsedUrlQuery
    const cleanSlug = slug as string
    const { data: articleData, isLoading: articleLoading, isError: articleError } = useGetArticle({ slug: cleanSlug })
    const article = articleData?.data as ArticleType


    const onInput = useCallback(
        debounce(async (value) => {
            try {
                const suggestions = await getAuthors(value)
                setData(suggestions?.results)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }, 400),
        [loading]
    )


    const transformedData = data?.map((data) => {
        return {
            value: data.id,
            label: `${data.first_name} ${data.last_name}: (ID: ${data?.id}, USERNAME: ${data?.user_name})`,
        };
    });
    useEffect(() => {
        setSuggestion(transformedData)
    }, [data])

    const { mutate, isLoading, isError } = useMutation({
        mutationFn: updateArticle,
        onSuccess: (data) => {
            form.reset()
            setSelectedFile(null);
            setPreviewUrl('');
            toast({
                title: "THe article has been successfully updated",
                description: "You can go to check it out now!",
                action: (
                    <ToastAction onClick={() => router.push(`/article/${data?.data?.slug}`)} altText="Goto the updated article">Go to article</ToastAction>
                ),
            })
        },
        onError: (err) => {
            console.error(err);
        }
    })
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [authors, setAuthors] = useState<Authors[]>([]);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const form = useForm<z.infer<typeof FormSchema>>({
        mode: "onChange",
        resolver: zodResolver(FormSchema),
        defaultValues: {
            title: "",
            desc: "",
            body: "",
            image: "",
            authors: "",
            status: "DRAFT",
            featured: false,
        }
    })

    useEffect(() => {
        form.setValue("title", article?.title);
        form.setValue("desc", article?.desc);
        form.setValue("body", article?.body);
        form.setValue("status", article?.status);
        form.setValue("featured", article?.featured);
    }, [article])

    const handleValidate = (value: React.ChangeEvent<HTMLInputElement>) => {
        if (value?.target?.files) {
            form.setValue("image", value?.target?.files?.[0]);
        }
        form.trigger('image')
    }

    const handleChooseFile = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleDelete = () => {
        setSelectedFile(null);
        form.setValue("image", "");
        setPreviewUrl('');
    };

    const handleSwap = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
            fileInputRef.current.click();
        }
    };

    const handleFileInputClick = (event: React.MouseEvent<HTMLInputElement>) => {
        // Reset the value of the file input to allow selecting the same file again
        event.currentTarget.value = '';
    };

    const handleFileInputBlur = () => {
        // Clear the selected file if the file input loses focus without a new file selected
        if (!fileInputRef.current?.files?.length) {
            setSelectedFile(null);
            setPreviewUrl('');
        }
    };


    const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event?.target?.files?.[0];
        if (file && !form.formState?.errors?.image) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewUrl('');
        }
    };

    function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log(data)
        mutate({ values: data, id: article?.id })
    }


    useEffect(() => {
        const tagValues = authors.map((author) => author.value).join(','); // Convert to a comma-separated string
        form.setValue('authors', tagValues);
    }, [authors, form]);

    const onAuthorAdd = useCallback((newTag: Authors) => {
        setAuthors([...authors, newTag])
    },
        [authors]
    )

    const onAuthorDelete = useCallback((tagIndex: number) => {
        setAuthors(authors.filter((_, i) => i !== tagIndex))
    },
        [authors]
    )


    return (
        <div className='flex w-full justify-center'>
            <Meta title={`Editing ${article?.title ?? "loading..."}`} />
            <Form {...form}>
                <form className="p-2 my-3 w-full rounded-md border max-w-[900px] bg-foreground" onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex flex-col w-full gap-2">
                        <h3 className="line-clamp-1 text-lg sm:text-2xl">Editing {article?.title ?? "loading..."}</h3>
                        <div className="flex flex-row gap-x-2">
                            <Button className="w-fit" onClick={() => router.back()} variant="default">Go back</Button>
                            <Button className="w-fit" onClick={() => router.replace('/')} variant="secondary">Go home</Button>
                        </div>
                    </div>
                    <div className="mt-3">
                        <p className="text-sm"><strong>NOTE:</strong> images will be capped at a max height of 300px when published</p>
                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            type="file"
                                            hidden
                                            accept="image/*, video/*"
                                            ref={fileInputRef}
                                            onChangeCapture={(value) => handleValidate(value as React.ChangeEvent<HTMLInputElement>)}
                                            onChange={handleFileInputChange}
                                            onClick={handleFileInputClick}
                                            onBlur={handleFileInputBlur}
                                            style={{ display: 'none' }}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-base" />
                                </FormItem>
                            )}
                        />
                        {selectedFile ? (
                            <>
                                <FilePreview imageClass="h-full min-h-[272px]" videoClass="h-full max-h-[272px]" file={selectedFile} previewUrl={previewUrl} onDelete={handleDelete} onSwap={handleSwap} />
                            </>
                        ) :
                            <button type="button" onClick={handleChooseFile} className="relative h-[272px] rounded-md z-30 w-full hover:cursor-pointer border-[3px] border-dashed border-black dark:border-white">
                                {article?.image && <Image className="w-full object-cover h-full rounded-md" src={article?.image} width="700" height="400" alt="" />}
                                <span className="absolute inset-0 flex justify-center items-center bg-gray-300/20 rounded-md">
                                    <h2 className="p-4 bg-gray-300/40 rounded-md">Update the cover image</h2>
                                </span>
                            </button>
                        }
                    </div>
                    <div className="w-full flex flex-col mt-4 gap-2 items-start xsm:flex-row">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input className="w-full" type="text" placeholder="A short attention grasping title is recommended" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="desc"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea autoFocus className="bg-background w-full max-h-[200px]" placeholder="A longer description about the topic" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="body"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Body</FormLabel>
                                <FormControl>
                                    <Editor classNames={{ container: "article", editor: "body" }} form={form} article={article} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Controller
                        name="authors"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Contributors</FormLabel>
                                <FormControl>
                                    <ReactTags
                                        {...field}
                                        noOptionsText={loading && suggestion?.length === 0 ? "Loading..." : "No authors found"}
                                        selected={authors}
                                        onInput={onInput}
                                        suggestions={suggestion}
                                        onAdd={(value) => onAuthorAdd(value as Authors)}
                                        onDelete={onAuthorDelete}
                                        placeholderText="Add contributors"
                                        labelText="Add contributors"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="w-full flex flex-col mt-4 gap-2 items-end xxs:flex-row">
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Status</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Article status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="DRAFT">Draft</SelectItem>
                                            <SelectItem value="PUBLISHED">Publishable</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="featured"
                            render={({ field }) => (
                                <FormItem className="w-full flex flex-row items-start justify-between rounded-lg bg-background border px-4 py-1.5">
                                    <FormLabel className="text-base">
                                        Featured
                                    </FormLabel>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onChange={field.onChange}
                                            className={`${field.value ? 'bg-foreground' : 'bg-gray-300/50 dark:bg-gray-500/50'}
          relative inline-flex h-[22px] w-[42px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
                                        >
                                            <span className="sr-only">Use setting</span>
                                            <span
                                                aria-hidden="true"
                                                className={`${field.value ? 'translate-x-5' : 'translate-x-0'}
            pointer-events-none inline-block h-[18px] w-[18px] transform bg-black dark:bg-white rounded-full shadow-lg ring-0 transition duration-200 ease-in-out`}
                                            />
                                        </Switch>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="p-10">
                        <Button disabled={(article ? false : true || isLoading)} type="submit" className="px-10 mt-5 w-full">{isLoading ? "Publishing" : "Publish"}</Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default UpdateArticle