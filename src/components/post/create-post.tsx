"use client"
import { createPost } from "@/api/requests/post/requests"
import FilePreview from "@/components/file-preview/file-preview"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useUserContext } from "@/context/user-context"
import { cn, uploadProgress } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { Mic, Paperclip, SmilePlus } from "lucide-react"
import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

const MAX_FILE_SIZE = 50000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif",
  "video/mp4", "video/mkv",
];

const FormSchema = z.object({
  content: z.string()
    .max(300, {
      message: "Content can't be longer than 300 characters",
    }),
  media: z
    .any()
    .optional()
    .refine((file) => {
      if (file !== undefined && file !== null && file !== "") {
        return file.size <= MAX_FILE_SIZE;
      }
      return true;
    }, "The max file size at the moment is 50MB")
    .refine((file) => {
      if (file !== undefined && file !== null && file !== "") {
        return ACCEPTED_IMAGE_TYPES.includes(file.type);
      }
      return true;
    }, "File type is not supported."),
}).superRefine((data, ctx) => {
  if (!data.content && !data.media) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["content"],
      message: "Write some text or upload a media file to post",
    });
  }
})


type CreatePostCompType = {
  placeholder?: string,
  parent_id?: number,
  className?: string,
  onSuccess?: (data: any) => void,
  onError?: (error: any) => void,
  key?: string
}

const CreatePost: React.FC<CreatePostCompType> = ({ placeholder = "Anything new happened?, anything on your mind?", className, onSuccess, onError, parent_id = undefined, key }) => {
  const { User } = useUserContext()
  const { mutate, isLoading, isError } = useMutation({
    mutationFn: createPost,
    onSuccess: (data) => {
      form.reset()
      setSelectedFile(null);
      setPreviewUrl('');
      if (onSuccess) {
        onSuccess(data); // Call the onSuccess prop if it's provided
      }
    },
    onError: (err) => {
      console.error(err);
      if (onError) {
        onError(err); // Call the onError prop if it's provided
      }
    }
  })
  const progress = uploadProgress['create-post'];
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    mode: "onChange",
    resolver: zodResolver(FormSchema),
    defaultValues: {
      content: "",
      media: ""
    }
  })

  const handleValidate = (value: React.ChangeEvent<HTMLInputElement>) => {
    if (value?.target?.files) {
      form.setValue("media", value?.target?.files?.[0]);
    }
    form.trigger('media')
  }

  const handleChooseFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDelete = () => {
    setSelectedFile(null);
    form.setValue("media", "");
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
    if (file && !form.formState?.errors?.media) {
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
    mutate({ values: data, parent: parent_id })
  }

  return (
    <div className={cn("flex w-full min-w-[350px] max-w-[650px] flex-col gap-y-4 my-4 rounded-md bg-foreground", className)} id="create-post">
      <Form {...form}>
        <form className="flex flex-col gap-3 w-full items-start" onSubmit={form.handleSubmit(onSubmit)}>
          <Avatar className="mt-1 mr-2 h-12 w-12">
            <AvatarImage src={User?.profile_avatar} alt={`@${User?.user_name}`} />
            <AvatarFallback>{`${User?.first_name?.substr(0, 1)}${User?.last_name?.substr(0, 1)}`}</AvatarFallback>
          </Avatar>
          <div className="w-full">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormMessage />
                  <FormControl>
                    <Textarea
                      className="max-h-44 !border-0 focus-visible:!ring-0 text-lg placeholder:opacity-50 focus:!ring-0"
                      placeholder={placeholder}
                      {...field}
                    />

                  </FormControl>
                </FormItem>
              )}
            />
            <div>
              <FormField
                control={form.control}
                name="media"
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
              {selectedFile && (
                <>
                  <FilePreview file={selectedFile} previewUrl={previewUrl} onDelete={handleDelete} onSwap={handleSwap} />
                </>
              )}
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div>
                <Button onClick={handleChooseFile} type="button" variant={null} size="icon">
                  <Paperclip className="h-5 w-5" />
                </Button>

                <Button type="button" variant={null} size="icon">
                  <Mic className="h-5 w-5" />
                </Button>
                <Button type="button" variant={null} size="icon">
                  <SmilePlus className="h-5 w-5" />
                </Button>
              </div>
              <Button onClick={(event) => event?.stopPropagation()} disabled={isLoading} type="submit" className="px-6">{isLoading ? `Posting... ${progress ? `${progress}%` : ""}` : "Post"}</Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default CreatePost;