import { getArticleBySlug } from "@/api/requests/article/requests";
import FeedLayout from "@/components/layout/feed-layout";
import ProfileHoverCard from "@/components/profile-hover-card/profile-hover-card";
import { RelativeTime } from "@/components/time/Time";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArticleType } from "@/types/article";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { motion } from 'framer-motion'
import { cn, formatNumberWithSuffix, getCookieValue } from "@/lib/utils";
import Meta from "@/components/meta/meta";
import { GetServerSideProps } from "next";
import { InView } from "react-intersection-observer";
import Comments from "@/components/comments/comments";
import { ReplyProvider } from "@/context/reply-context";
import ReactComponent from "@/components/reactions/react-component";
import { ReactionsType } from "@/types/global";
import { useEffect, useState } from "react";
import useReactHook from "@/hooks/use-react-hook";
import { ReactType } from "@/api/requests/reactions/requests";
import { handleNewReaction, handleReactionDelete, handleReactionUpdate } from "@/lib/reaction-utils";
import Report from "@/components/report/report";
import { Button, buttonVariants } from "@/components/ui/button";
import { BookmarkIcon, MoreHorizontalIcon } from "lucide-react";
import TippyTool from "@/components/ui-utils/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DialogTrigger } from "@/components/ui/dialog";
import { useUserContext } from "@/context/user-context";
import useBookMark from "@/hooks/use-bookmark-hook";
import { useGetArticle } from "@/hooks/utils";

const Article = () => {
    const { User } = useUserContext()
    const router = useRouter()
    const { slug } = router.query as ParsedUrlQuery
    const cleanSlug = slug as string
    const { data, isLoading, isError } = useGetArticle({ slug: cleanSlug })
    const article = data?.data as ArticleType
    const [reactions, setReactions] = useState<ReactionsType>({
        user_reacted_with: null,
        reaction_count: [],
    });
    const [reactionsSnapShot, setReactionsSnapShot] = useState<ReactionsType>({
        user_reacted_with: null,
        reaction_count: [],
    });

    const [bookmarked, setBookmarked] = useState<boolean>(article?.bookmarked ? true : false)

    const onError = () => {
        setReactions(reactionsSnapShot)
    }

    const { mutate, isLoading: reacting } = useReactHook(onError)

    useEffect(() => {
        if (article) {
            setReactions(article?.reactions)
        }
    }, [article])

    const handleReaction = ({ event, data }: { event: any, data: ReactType }) => {
        setReactionsSnapShot(reactions);
        event?.stopPropagation();
        if (reacting) {
            // make the button inactive while the mutation is ongoing
            return;
        }
        // handle the UI update immediately before the API request.
        if (!reactions.user_reacted_with) {
            handleNewReaction({ reactions, setReactions, data });
        } else if (reactions.user_reacted_with === data.reaction) {
            handleReactionDelete({ reactions, setReactions });
        } else {
            handleReactionUpdate({ reactions, setReactions, data });
        }
        // Fire the use mutation hook
        mutate(data)
    };


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

    return (
        <FeedLayout trending="unmount">
            <Meta title={article?.title} desc={article?.desc} url={`https://betenda.com/article/${article?.slug}`} published_date={article?.published_date} author={`${article?.authors[0]?.first_name} ${article?.authors[0]?.last_name}`} />
            <div className="w-full flex flex-col items-center pb-8">
                <article className="w-full flex justify-center p-1">
                    <div className="mt-4 max-w-[750px] w-full">
                        <header>
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
                                    <div className="flex items-start gap-x-3 justify-end -mt-3">
                                        <div className="relative group opacity-80">
                                            <TippyTool text={bookmarked ? "Bookmarked!" : "Bookmark"}>
                                                <button onClick={handleAddToBookmark} className="w-8 h-8 rounded-full group-hover:bg-cyan-500/20 flex items-center justify-center">
                                                    <BookmarkIcon className={cn("h-[1.2em] w-[1.2em] group-hover:text-cyan-600", bookmarked ? "text-cyan-600 fill-cyan-600" : "")} />
                                                </button>
                                            </TippyTool>
                                        </div>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button onClick={(event) => event.stopPropagation()} className="w-10 h-8" variant="ghost" size="icon">
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
                                                    </>
                                                    :
                                                    null
                                                }
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>
                            </div>
                            <h1 className="mt-2 text-xl sm:text-3xl md:text-5xl">{article?.title}</h1>
                        </header>
                        <figure>
                            {article?.image &&
                                <Image className="w-full object-cover h-full rounded-md mt-2 max-h-[300px]" src={article?.image} width="800" height="500" alt={article?.title} />
                            }
                        </figure>
                        <section className="flex flex-row gap-2 flex-wrap items-center my-2" id="reactions">
                            <ReactComponent onIconSelect={(event, icon) => handleReaction({ event: event, data: { resource_type: "article", resource_id: article?.id, reaction: icon } })} />
                            {reactions?.reaction_count && reactions?.reaction_count?.length > 0 &&
                                reactions?.reaction_count?.map((react) => {
                                    return (
                                        <span className={cn(reactions?.user_reacted_with === react?.reaction ? 'bg-foreground' : '', `space-x-1 w-fit text-xl flex flex-row items-center text-center px-2 py-0.5 rounded-md border`)} key={react?.reaction}>
                                            <motion.button
                                                onClick={(event) => handleReaction({ event: event, data: { resource_type: "article", resource_id: article?.id, reaction: react?.reaction } })}
                                                whileHover={{ scale: 1.2 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                {react?.reaction}
                                            </motion.button>
                                            <p className="text-xs font-medium">{formatNumberWithSuffix(react?.count)}</p>
                                        </span>
                                    )
                                })
                            }
                        </section>
                        <div className="article">
                            <div className="body rounded-md p-2 my-4" dangerouslySetInnerHTML={{ __html: article?.body }} />
                        </div>
                    </div>
                </article>
                <InView as="div" className="max-w-[750px] w-full" triggerOnce={true} threshold={0} rootMargin="-100px 0px 0px 0px">
                    <ReplyProvider resource_type="article" resource_id={article?.id}>
                        <Comments />
                    </ReplyProvider>
                </InView>
            </div>
        </FeedLayout>
    );
}

export default Article;


export const getServerSideProps: GetServerSideProps = async (context) => {
    const { req } = context;
    const { slug } = context.params as ParsedUrlQuery

    const sessionId = getCookieValue(req, 'sessionid')

    const queryClient = new QueryClient()
    await queryClient.prefetchQuery({ queryKey: ['get_article_by_slug', slug], queryFn: () => getArticleBySlug({ slug: slug as string, sessionId: sessionId }) })
    return {
        props: {
            dehydratedState: dehydrate(queryClient),
        },
    }
}