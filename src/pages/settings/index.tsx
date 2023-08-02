import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { updateProfile } from "@/api/requests/user/requests";
import SettingsLayout from "@/components/layout/settings-layout";
import Meta from "@/components/meta/meta";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import FilePreview from "@/components/file-preview/file-preview";
import { Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import SelectListbox from "@/components/select/select";
import { useUserContext } from "@/context/user-context";
import Image from "next/image";

const MAX_COVER_SIZE = 10000000;
const MAX_AVATAR_SIZE = 3000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];

const FormSchema = z.object({
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    user_name: z.string().optional(),
    birth_date: z.string().optional(),
    bio: z.string().optional(),
    email: z.string().email("Invalid email").or(z.literal('')),
    profile_avatar: z.any().optional()
        .refine((file) => {
            if (file !== undefined && file !== null && file !== "") {
                return ACCEPTED_IMAGE_TYPES.includes(file.type);
            }
            return true;
        }, "Image is not supported.")
        .refine((file) => {
            if (file !== undefined && file !== null && file !== "") {
                return file.size <= MAX_AVATAR_SIZE;
            }
            return true;
        }, "The max image size at the moment is 3MB"),
    profile_cover: z.any().optional()
        .refine((file) => {
            if (file !== undefined && file !== null && file !== "") {
                return ACCEPTED_IMAGE_TYPES.includes(file.type);
            }
            return true;
        }, "Image is not supported.")
        .refine((file) => {
            if (file !== undefined && file !== null && file !== "") {
                return file.size <= MAX_COVER_SIZE;
            }
            return true;
        }, "The max image size at the moment is 5MB"),

})

const Settings = () => {
    const { User } = useUserContext()
    const queryClient = useQueryClient()
    const { toast } = useToast()
    const { mutate, isLoading } = useMutation({
        mutationFn: updateProfile,
        onSuccess: () => {
            queryClient.invalidateQueries(['get_user'])
            form.reset()
            toast({
                title: "Nice",
                description: "You have successfully updated your profile",
            })
        }
    })
    const form = useForm<z.infer<typeof FormSchema>>({
        reValidateMode: "onChange",
        resolver: zodResolver(FormSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            profile_avatar: "",
            profile_cover: "",
            user_name: "",
            email: "",
        },
    })
    const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
    const [selectedCover, setSelectedCover] = useState<File | null>(null);
    const [previewAvatarUrl, setPreviewAvatarUrl] = useState<string>('');
    const [previewCoverUrl, setPreviewCoverUrl] = useState<string>('');
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);

    const handleChooseFile = (type: string) => {
        if (type === "AVATAR") {
            if (avatarInputRef.current) {
                avatarInputRef.current.click();
            }
        }
        else if (type === "COVER") {
            if (coverInputRef.current) {
                coverInputRef.current.click();
            }
        }
    };


    const handleValidate = (value: React.ChangeEvent<HTMLInputElement>, type: string) => {
        if (type === "AVATAR") {
            if (value?.target?.files) {
                form.setValue("profile_avatar", value?.target?.files?.[0]);
            }
            form.trigger('profile_avatar')
        } else if (type === "COVER") {
            if (value?.target?.files) {
                form.setValue("profile_cover", value?.target?.files?.[0]);
            }
            form.trigger('profile_cover')
        }
    }

    const handleDelete = (type: string) => {
        if (type === "AVATAR") {
            setSelectedAvatar(null);
            form.setValue("profile_avatar", "");
            setPreviewAvatarUrl('');
        } else if (type === "COVER") {
            setSelectedCover(null);
            form.setValue("profile_cover", "");
            setPreviewCoverUrl('');
        }
    };

    const handleSwap = (type: string) => {
        if (type === "AVATAR") {
            if (avatarInputRef.current) {
                avatarInputRef.current.value = '';
                avatarInputRef.current.click();
            }
        }
        else if (type === "COVER") {
            if (coverInputRef.current) {
                coverInputRef.current.click();
            }
        }
    };

    const handleFileInputClick = (event: React.MouseEvent<HTMLInputElement>) => {
        // Reset the value of the file input to allow selecting the same file again
        event.currentTarget.value = '';
    };

    const handleFileInputBlur = (type: string) => {
        // Clear the selected file if the file input loses focus without a new file selected
        if (type === "AVATAR") {
            if (!avatarInputRef.current?.files?.length) {
                setSelectedAvatar(null);
                setPreviewAvatarUrl('');
            }
        } else if (type === "COVER") {
            if (!coverInputRef.current?.files?.length) {
                setSelectedCover(null);
                setPreviewCoverUrl('');
            }
        }
    };


    const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
        const file = event?.target?.files?.[0];
        if (type === "AVATAR") {
            if (file && form.formState?.errors?.profile_avatar === undefined) {
                setSelectedAvatar(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreviewAvatarUrl(reader.result as string);
                };
                reader.readAsDataURL(file);
            } else {
                setPreviewAvatarUrl('');
                setSelectedAvatar(null);
                form.setValue("profile_avatar", '');
            }
        } else if (type === "COVER") {
            if (file && form.formState?.errors?.profile_cover === undefined) {
                setSelectedCover(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreviewCoverUrl(reader.result as string);
                };
                reader.readAsDataURL(file);
            } else {
                setPreviewCoverUrl('');
                setSelectedCover(null);
                form.setValue("profile_cover", "");
            }
        }
    };



    function onSubmit(values: z.infer<typeof FormSchema>) {
        mutate(values)
    }


    return (
        <SettingsLayout>
            <Meta title="Settings" />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="px-4 py-2 w-full max-w-md rounded">
                    <FormField
                        control={form.control}
                        name="profile_avatar"
                        render={() => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        ref={avatarInputRef}
                                        onChange={(event) => { handleFileInputChange(event, "AVATAR"); handleValidate(event, "AVATAR") }}
                                        onClick={handleFileInputClick}
                                        onBlur={() => handleFileInputBlur("AVATAR")}
                                        style={{ display: 'none' }}
                                    />
                                </FormControl>
                                <FormMessage className="text-base" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="profile_cover"
                        render={() => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        ref={coverInputRef}
                                        onChange={(event) => { handleFileInputChange(event, "COVER"); handleValidate(event, "COVER") }}
                                        onClick={handleFileInputClick}
                                        onBlur={() => handleFileInputBlur("COVER")}
                                        style={{ display: 'none' }}
                                    />
                                </FormControl>
                                <FormMessage className="text-base" />
                            </FormItem>
                        )}
                    />
                    <div className="relative bg-foreground w-[650px] h-72 rounded-md">
                        <div className="w-full h-full">
                            {previewCoverUrl ? (
                                <>
                                    <FilePreview imageClass="h-full max-h-[272px]" videoClass="h-full max-h-[272px]" file={selectedCover} previewUrl={previewCoverUrl} onDelete={() => handleDelete("COVER")} onSwap={() => handleSwap("COVER")} />
                                </>
                            ) :
                                <button type="button" onClick={() => handleChooseFile("COVER")} className="relative rounded-md z-30 w-full h-full hover:cursor-pointer border-[3px] border-dashed border-indigo-600">
                                    {User?.profile_cover && <Image className="w-full object-cover h-full rounded-md" src={User?.profile_cover} width="700" height="400" alt="" />}
                                    <span className="absolute inset-0 flex justify-center items-center bg-gray-300/20 rounded-md">
                                        <h2 className="p-4 bg-gray-300/40 rounded-md">Upload a cover photo</h2>
                                    </span>
                                </button>
                            }

                        </div>
                        <div className="relative">
                            <div className="absolute -top-24 left-4 h-32 w-32 z-50 rounded-md ring-4 bg-background ring-foreground">
                                {previewAvatarUrl ? (
                                    <>
                                        <FilePreview imageClass="h-full max-h-[128px]" videoClass="h-full max-h-[128px]" file={selectedAvatar} previewUrl={previewAvatarUrl} onDelete={() => handleDelete("AVATAR")} onSwap={() => handleSwap("AVATAR")} />
                                    </>
                                ) :
                                    <button type="button" onClick={() => handleChooseFile("AVATAR")} className="flex justify-center items-center rounded-md z-30 w-full h-full hover:cursor-pointer border-[3px] border-dashed border-cyan-600">
                                        {User?.profile_avatar && <Image className="w-full object-cover h-full rounded-md" src={User?.profile_avatar} width="700" height="400" alt="" />}
                                        <span className="absolute inset-0 flex justify-center items-center p-4 bg-gray-300/20">
                                            <ImageIcon className="p-2 bg-gray-300/50 rounded-md" size={40} />
                                        </span>
                                    </button>
                                }
                            </div>
                        </div>
                    </div>
                    <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                            <FormItem className="w-[650px] mt-14">
                                <FormLabel>You bio</FormLabel>
                                <FormControl>
                                    <Textarea autoFocus className="bg-background w-full max-h-[200px]" placeholder="A little about your self" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="w-[650px] flex flex-row mt-4 gap-x-2 items-center">
                        <FormField
                            control={form.control}
                            name="first_name"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>First name</FormLabel>
                                    <FormControl>
                                        <Input className="w-full" type="text" placeholder="ኬሮድ" {...field} />
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
                                        <Input className="w-full" type="text" placeholder="ንማኒ" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="w-[650px] flex flex-row mt-4 gap-x-2 items-center">
                        <FormField
                            control={form.control}
                            name="birth_date"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Birth date</FormLabel>
                                    <FormControl>
                                        <Input className="w-full" type="date" placeholder="Your birth date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>


                    <div className="w-[650px] mt-4 flex flex-row gap-x-2 items-start">
                        <FormField
                            control={form.control}
                            name="user_name"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>User name</FormLabel>
                                    <FormControl>
                                        <Input className="w-full" type="text" placeholder="user.name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input className="w-full" type="email" placeholder="example@gmail.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={isLoading} type="submit" className="px-10 mt-5">{isLoading ? "Updating" : "Update profile"}</Button>
                </form>
            </Form>
        </SettingsLayout>
    );
}

export default Settings;