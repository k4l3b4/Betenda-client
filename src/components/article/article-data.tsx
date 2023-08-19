import HeadLessDialog from "@/components/dialog/dialog";
import ProfileHoverCard from "@/components/profile-hover-card/profile-hover-card";
import Report from "@/components/report/report";
import { RelativeTime } from "@/components/time/Time";
import TippyTool from "@/components/ui-utils/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useUserContext } from "@/context/user-context";
import useBookMark from "@/hooks/use-bookmark-hook";
import { useDeleteArticle } from "@/hooks/use-delete-resource";
import { cn, formatNumberWithSuffix } from "@/lib/utils";
import { ArticleType, InfiniteArticlesType } from "@/types/article";
import { useQueryClient } from "@tanstack/react-query";
import { BookmarkIcon, MoreHorizontalIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const ArticleData = ({ article, className }: { article: ArticleType, className?: string }) => {
    const { User } = useUserContext()
    const queryClient = useQueryClient()
    const [bookmarked, setBookmarked] = useState<boolean>(article?.bookmarked ? true : false)
    const [modalOpen, setModalOpen] = useState(false)
    const onBookMarkError = () => {
        setBookmarked(!bookmarked)
    }

    const { addtobookmark, isLoading: addingToBookMark } = useBookMark({ onError: onBookMarkError })

    const handleAddToBookmark = () => {
        if (addingToBookMark) {
            return;
        }

        setBookmarked(!bookmarked)
        addtobookmark({ data: { resource_id: article?.id, resource_type: "article" } })
    }



    const onDeleteSuccess = (deletedArticleId: number) => {
        queryClient.setQueryData<InfiniteArticlesType | undefined>(['articles'], (oldData) => {
            if (!oldData) return undefined;

            const updatedPages = oldData.pages.map(page => {
                const updatedResults = page.results.filter(article => article.id !== deletedArticleId);
                return {
                    ...page,
                    results: updatedResults,
                };
            });

            return {
                pages: updatedPages,
                pageParams: oldData.pageParams,
            };
        });
    };

    const { mutate: deleteArticle, isLoading: isDeletingArticle } = useDeleteArticle({ onSuccess: () => onDeleteSuccess(article?.id) })

    const HandleDelete = (event: any) => {
        event.stopPropagation()
        deleteArticle({ id: article?.id })
    }


    function closeModal() {
        setModalOpen(false)
    }

    function openModal() {
        setModalOpen(true)
    }


    return (
        <div className={cn('flex flex-col justify-start bg-foreground p-2 rounded-md gap-x-2', isDeletingArticle ? "opacity-50" : "", className)}>
            <div className="flex flex-row items-start gap-x-2 w-full relative" id="user">
                <Avatar className="w-12 h-12 hidden 2xxs:block">
                    {article?.authors?.[0]?.profile_avatar ?
                        <AvatarImage src={article?.authors?.[0]?.profile_avatar} alt={article?.authors?.[0]?.user_name} />
                        :
                        null
                    }
                    <AvatarFallback>{`${article?.authors?.[0]?.first_name?.substring(0, 1)}${article?.authors?.[0]?.last_name?.substring(0, 1)}`}</AvatarFallback>
                </Avatar>
                <div className="w-full flex items-center justify-between gap-x-2">
                    <div>
                        <ProfileHoverCard user={article?.authors?.[0]}>
                            <Link onClick={(event) => event.stopPropagation()} href={`/${article?.authors?.[0]?.user_name}`} className="flex no-underline items-center z-50 space-x-2 px-1 transition-colors delay-100 duration-200 ease-in-out hover:bg-accent rounded-xl">
                                <p className="font-medium line-clamp-1">{`${article?.authors?.[0]?.first_name} ${article?.authors?.[0]?.last_name}`}</p>
                                <p className="text-xs text-muted-foreground line-clamp-1">{`@${article?.authors?.[0]?.user_name}`}</p>
                            </Link>
                        </ProfileHoverCard>
                        <p className="text-xs text-muted-foreground line-clamp-1 px-1">{RelativeTime(article?.published_date)}</p>
                    </div>
                    <div onClick={(event) => event.stopPropagation()} className="flex items-start gap-x-3 justify-end -mt-3">
                        <div className="relative group opacity-80">
                            <TippyTool text={bookmarked ? "Bookmarked!" : "Bookmark"}>
                                <button onClick={handleAddToBookmark} className="w-8 h-8 rounded-full group-hover:bg-cyan-500/20 flex items-center justify-center">
                                    <BookmarkIcon className={cn("h-[1.2em] w-[1.2em] group-hover:text-cyan-600", bookmarked ? "text-cyan-600 fill-cyan-600" : "")} />
                                </button>
                            </TippyTool>
                        </div>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button className="w-10 h-8" variant="ghost" size="icon">
                                    <MoreHorizontalIcon />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-52" align="end">
                                {/* report */}
                                <Report resource_id={article?.id} resource_type="post">
                                    <DialogTrigger asChild>
                                        <Button className="w-full text-start flex !justify-start" onClick={(event) => event.stopPropagation()} variant="ghost">Report</Button>
                                    </DialogTrigger>
                                </Report>
                                {/* report */}
                                {User?.id === article?.authors?.[0]?.id ?
                                    <>
                                        <Link href={`/dashboard/article/${article?.slug}`} className={buttonVariants({ variant: "ghost", className: "norm-link w-full text-start flex !justify-start" })} onClick={(event) => event.stopPropagation()}>Edit</Link>
                                        <Button className="w-full text-start flex !justify-start" onClick={openModal} variant="ghost">Delete</Button>
                                    </>
                                    :
                                    null
                                }
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
            </div>
            <Link href={`article/${article?.slug}`} className="norm-link flex flex-col xxs:flex-row items-start gap-x-2 mt-3">
                <>
                    {
                        article?.image ?
                            <Image className="w-full h-40 2xs:h-52 xxs:w-32 xxs:h-32 object-cover rounded-md" src={article?.image} alt={article?.title} width="600" height="600" />
                            :
                            null
                    }
                </>
                <div className="h-fit flex flex-col justify-between">
                    <div>
                        <h3 className="line-clamp-2 text-lg xsm:text-xl sm:text-2xl sm:font-bold">{article?.title}</h3>
                        <p className="line-clamp-3 opacity-70 text-sm xsm:text-base">{article?.desc}</p>
                    </div>
                </div>
            </Link>
            {article?.reactions?.reaction_count && article?.reactions?.reaction_count?.length > 0 &&
                <div className="p-1 mt-1">
                    {article?.reactions?.reaction_count.slice(0, 5)?.sort((a, b) => b.count - a.count).map((react) => {
                        return (
                            <span className="space-x-1 w-fit text-xl flex flex-row items-center text-center" key={react?.reaction}>
                                {react?.reaction}
                                <p className="text-xs font-medium">{formatNumberWithSuffix(react?.count)}</p>
                            </span>
                        )
                    })}
                </div>
            }
            <HeadLessDialog title="Warning!" isOpen={modalOpen} onClose={closeModal} message="Are you sure you want to delete this article?, know that this change is permanent!" primaryButtonLabel="Yes, delete it" onPrimaryButtonClick={(event) => HandleDelete(event)} secondaryButtonLabel="No, Nevermind" onSecondaryButtonClick={closeModal} />
        </div>
    );
}

export default ArticleData;