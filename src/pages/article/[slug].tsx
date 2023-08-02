import { getArticleBySlug } from "@/api/requests/article/requests";
import FeedLayout from "@/components/layout/feed-layout";
import ProfileHoverCard from "@/components/profile-hover-card/profile-hover-card";
import { RelativeTime } from "@/components/time/Time";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArticleType } from "@/types/article";
import { QueryClient, dehydrate, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { motion } from 'framer-motion'
import { formatNumberWithSuffix, getCookieValue } from "@/lib/utils";
import Meta from "@/components/meta/meta";
import { GetServerSideProps } from "next";
import { InView } from "react-intersection-observer";
import Comments from "@/components/comments/comments";
import { ReplyProvider } from "@/context/reply-context";

const Article = () => {
    const router = useRouter()
    const { slug } = router.query as ParsedUrlQuery
    const cleanSlug = slug as string
    const { data } = useQuery({ queryKey: ['get_article_by_slug', cleanSlug], queryFn: () => getArticleBySlug({ slug: cleanSlug }), enabled: cleanSlug ? true : false })
    const article = data?.data as ArticleType

    return (
        <FeedLayout trending="unmount">
            <Meta title={article?.title} desc={article?.desc} url={`https://betenda.com/article/${article?.slug}`} published_date={article?.published_date} author={`${article?.authors[0]?.first_name} ${article?.authors[0]?.last_name}`} />
            <div className="w-full flex flex-col items-center">
                <article className="w-full flex justify-center p-1">
                    <div className="mt-4 max-w-[750px] w-full">
                        <header>

                            <div className="flex items-center gap-x-2 mb-2" id="user">
                                <Avatar>
                                    {article?.authors[0]?.profile_avatar ?
                                        <AvatarImage src={article?.authors[0]?.profile_avatar} alt={article?.authors[0]?.user_name} />
                                        :
                                        null
                                    }
                                    <AvatarFallback>{`${article?.authors[0]?.first_name?.substr(0, 1)}${article?.authors[0]?.last_name?.substr(0, 1)}`}</AvatarFallback>
                                </Avatar>
                                <div className="flex items-baseline gap-x-2">
                                    <div>
                                        <ProfileHoverCard user={article?.authors[0]}>
                                            <Link href={`/${article?.authors[0]?.user_name}`} className="font-medium no-underline hover:underline">{`${article?.authors[0]?.first_name} ${article?.authors[0]?.last_name}`}</Link>
                                        </ProfileHoverCard>
                                        <p className="text-xs text-muted-foreground">{`@${article?.authors[0]?.user_name}`}</p>
                                    </div>
                                    <span className="text-xs">•</span>
                                    <p className="text-xs text-muted-foreground">{RelativeTime(article?.published_date)}</p>
                                </div>
                            </div>
                            <h1>{article?.title}</h1>
                        </header>
                        <figure>
                            {article?.image &&
                                <Image className="w-full object-cover h-full rounded-md my-2 max-h-[300px]" src={article?.image} width="800" height="500" alt={article?.title} />
                            }
                        </figure>
                        <section id="reactions">
                            {article?.reactions?.reaction_count?.length > 0 &&
                                article?.reactions?.reaction_count?.map(react => (
                                    <span className="space-x-1 w-fit flex flex-row items-center text-center" key={react?.reaction}>
                                        <motion.button
                                            // onClick={(event) => handleReaction({ event: event, data: { resource: "post", id: post?.id } })}
                                            whileHover={{ scale: 1.2 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            {react?.reaction}
                                        </motion.button>
                                        <p className="text-xs font-medium">{formatNumberWithSuffix(react?.count)}</p>
                                    </span>
                                ))
                            }
                        </section>
                        <div className="article">
                            <div className="body rounded-md p-2 my-4" dangerouslySetInnerHTML={{ __html: article?.body }} />
                        </div>
                    </div>
                </article>
                <InView as="div" className="max-w-[750px] w-full" triggerOnce={true} threshold={0} rootMargin="-100px 0px 0px 0px">
                    <ReplyProvider resource_type="article" resource_id={article?.id}>
                        <Comments resource_type="article" resource_id={article?.id} />
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
            dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
        },
    }
}