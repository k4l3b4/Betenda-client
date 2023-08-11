"use client"
import { createArticle } from '@/api/requests/article/requests'
import { getAuthors } from '@/api/requests/user/requests'
import FilePreview from '@/components/file-preview/file-preview'
import Meta from '@/components/meta/meta'
import Editor from '@/components/text-editor/text-editor'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useUserContext } from '@/context/user-context'
import { debounce } from '@/lib/utils'
import { Switch } from '@headlessui/react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery } from '@tanstack/react-query'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Controller, useForm } from "react-hook-form"
import { ReactTags } from 'react-tag-autocomplete'
import * as z from "zod"

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

const CreateArticle = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<AuthorsType[]>([])
  const [suggestion, setSuggestion] = useState<Authors[]>([])

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


  const { User } = useUserContext()
  const { mutate, isLoading, isError } = useMutation({
    mutationFn: createArticle,
    onSuccess: (data) => {
      form.reset()
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
    mutate({ values: data })
  }


  React.useEffect(() => {
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
      <Meta title="Write an article" />
      <Form {...form}>
        <form className="p-2 my-3 w-full rounded-md border max-w-[900px] bg-foreground" onSubmit={form.handleSubmit(onSubmit)}>
          <h2>Lets publish an article!</h2>
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
                <FilePreview imageClass="h-full min-h-[272px]" videoClass="h-full min-h-[272px]" file={selectedFile} previewUrl={previewUrl} onDelete={handleDelete} onSwap={handleSwap} />
              </>
            ) :
              <button type="button" onClick={handleChooseFile} className="min-h-[272px] rounded-md z-30 w-full h-full hover:cursor-pointer border-[3px] border-dashed border-indigo-600">
                <h3 className="font-bold text-3xl">Upload an article cover photo</h3>
              </button>}
          </div>
          <div className="w-full flex flex-col mt-4 gap-2 items-start xxs:flex-row">
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
                  <Editor form={form} />
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
                    suggestions={suggestion} // Add suggestions if needed
                    onAdd={onAuthorAdd} // i know what to expect so i'm just going to ignore the error
                    onDelete={onAuthorDelete}
                    placeholder="Add contributors"
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
            <Button disabled={isLoading} type="submit" className="px-10 mt-5 w-full">{isLoading ? "Publishing" : "Publish"}</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default CreateArticle