"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Mic, Paperclip } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUserContext } from "@/context/user-context";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "@/components/ui/use-toast"
import { Input } from "../ui/input"
import { useRef, useState } from "react"
import FilePreview from "@/components/file-preview/file-preview"
import { createPost } from "@/api/requests/post/requests"
import { uploadProgress } from "@/lib/utils"

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


const CreatePost: React.FC = () => {
  const queryClient = useQueryClient()
  const { User } = useUserContext()
  const { mutate, isLoading, isError } = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
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
    mutate({ values: data })
  }


  return (
    <Card className="flex w-[550px] flex-col gap-y-4 p-2" id="create-post">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Avatar className="mb-3">
            <AvatarImage src={User?.profile_avatar} alt={`@${User?.user_name}`} />
            <AvatarFallback>{`${User?.first_name?.substr(0, 1)}${User?.last_name?.substr(0, 1)}`}</AvatarFallback>
          </Avatar>
          <div>
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormMessage />
                  <FormControl>
                    <Textarea
                      className="max-h-44 border-none text-lg placeholder:opacity-50 focus:ring-0 focus-visible:ring-0"
                      placeholder={`Hello ${User?.first_name}, anything new happened?, anything on your mind?`}
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
              </div>
              <Button disabled={isLoading} type="submit" className="px-6">{isLoading ? `Posting... ${progress ? `${progress}%` : ""}` : "Post"}</Button>
            </div>
          </div>
        </form>
      </Form>
    </Card>
  );
}

export default CreatePost;