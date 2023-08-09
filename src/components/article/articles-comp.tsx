import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import CircularProgress from "@mui/material/CircularProgress";
import { FrownIcon, GhostIcon } from "lucide-react";
import ArticleData from "./article-data";
import { InfiniteArticlesType } from "@/types/article";
import DataLoading from "../app-ui-states/data-loading";
import DataError from "../app-ui-states/data-error";
import NoData from "../app-ui-states/no-data";

type ArticleCompType = {
    loading: boolean,
    error: boolean,
    refetch: () => void,
    refetching: boolean,
    classNames?: {
        post?: string,
        loading?: string,
        error?: string,
        noData?: string,
    }
    data: InfiniteArticlesType
}

const ArticlesComp: React.FC<ArticleCompType> = ({ loading, error, refetch, refetching, data, classNames }) => {
    const article = data?.pages
    return (
        <>
            {
                loading ?
                    <DataLoading className={classNames?.loading} />
                    :
                    error ? (
                        <DataError className={classNames?.error} />
                    )
                        :
                        article[0]?.results?.length === 0 ? (
                            <NoData className={classNames?.noData} message="Looks like there are no articles yet" />
                        )
                            :
                            article?.map(page =>
                                page?.results?.map((article) => {
                                    return (
                                        <ArticleData className={cn('hover-anim w-[650px]', classNames?.post)} article={article} key={article?.id} />
                                    )
                                }))
            }
        </>
    );
}

export default ArticlesComp;