import { getTrendingArticles } from "@/api/requests/article/requests";
import DataError from "@/components/app-ui-states/data-error";
import DataLoading from "@/components/app-ui-states/data-loading";
import NoData from "@/components/app-ui-states/no-data";
import MoreArticle from "@/components/article/more-article";
import SearchComp from "@/components/search/search";
import { ThemeToggle } from "@/components/theme-toggle";
import TippyTool from "@/components/ui-utils/tooltip";
import { PaginatedArticleType } from "@/types/article";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, BugIcon } from "lucide-react";
import Link from "next/link";

const Trending = () => {
    const { data, isError, isLoading, refetch, isRefetching } = useQuery({ queryKey: ['trending-articles'], queryFn: getTrendingArticles })
    const articles = data as PaginatedArticleType

    return (
        <aside suppressHydrationWarning className="flex flex-col justify-between rounded-md w-full max-w-[400px] sticky left-0 top-0 h-screen p-2">
            <div>
                <div className="w-full bg-accent rounded-md p-2 my-2 pt-5">
                    <h2>Search</h2>
                    <div className="w-full my-4">
                        <SearchComp classNames={{ container: "w-full", input: "h-12 border-none focus:outline-none !ring-0 rounded-full text-lg pl-8" }} redirect="search" />
                    </div>
                </div>
                <div className="w-full bg-accent rounded-md p-2 my-4">
                    <h2>Trending articles</h2>
                    <div className="w-full mt-4">
                        <div className="flex flex-col gap-2">
                            <div>
                                {isError ?
                                    <DataError refetch={refetch} refetching={isRefetching} />
                                    :
                                    isLoading ?
                                        <DataLoading />
                                        :
                                        articles?.results?.length === 0 ?
                                            <NoData message="No Articles published yet" />
                                            :
                                            articles?.results?.map((article) => {
                                                return (
                                                    <MoreArticle key={article?.id} article={article} />
                                                )
                                            })}
                            </div>
                            <Link className="mt-2 text-xs flex items-base w-fit" href="/articles">All articles <ArrowRight size={16} /></Link>
                        </div>
                    </div>
                </div>
            </div>
            {/* feel free to edit this section how ere you'd like */}
            <div className="w-full rounded-md p-2 my-4">
                <div className="flex items-center gap-3 py-2">
                    <TippyTool asChild={true} text="Toggle theme">
                        <div className="flex items-center">
                            <ThemeToggle />
                        </div>
                    </TippyTool>
                    <TippyTool asChild={false} text="Report a bug">
                        <Link href="https://github.com/k4l3b4/" target="_blank" rel="noopener noreferrer">
                            <BugIcon />
                        </Link>
                    </TippyTool>
                </div>
                <div className="flex gap-2 text-xs opacity-60 py-1">
                    <span className="opacity-60">Client version:</span> {process.env.NEXT_PUBLIC_CLIENT_VERSION}
                </div>
                <div className="flex items-center gap-x-2 text-xs">
                    <Link href="/privacy" className="opacity-60 hover:opacity-100" >Privacy</Link>
                    <span className="opacity-50">|</span>
                    <Link href="/terms" className="opacity-60 hover:opacity-100" >Terms</Link>
                    <span className="opacity-50">|</span>
                    <Link href="/github" className="opacity-60 hover:opacity-100" >Github</Link>
                </div>
                <div className="text-xs my-2">
                    {/* I would like the attribution but if for any reason this is a problem for you feel free to strip it */}
                    <span className="opacity-50">Authored by</span>{" "}
                    <Link target="_blank" rel="noopener noreferrer" href="https://github.com/k4l3b4/" className="opacity-60 hover:opacity-100">k4l3b4</Link>
                </div>
                <div className="text-xs mt-2">
                    <span className="opacity-50">By the</span>{" "}
                    <Link target="_blank" rel="noopener noreferrer" href="https://yeguragegoye.com/" className="opacity-60 hover:opacity-100">Goye</Link>{" "}
                    <span className="opacity-50">community</span>
                </div>
                <div className="text-xs mt-2">
                    <p>Copyright© 2023 Betenda.</p>
                </div>
            </div>
        </aside>
    );
}

export default Trending;