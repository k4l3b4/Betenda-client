import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import CircularProgress from "@mui/material/CircularProgress";
import { FrownIcon, GhostIcon } from "lucide-react";
import ArticleData from "./article-data";
import { InfiniteArticlesType } from "@/types/article";

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
                    <div className={cn("flex flex-col justify-center items-center mt-5",
                        classNames?.loading
                    )}>
                        <CircularProgress color="inherit" thickness={4} size="2.3rem" />
                    </div>
                    :
                    error ? (
                        <div className={cn("flex flex-col justify-center items-center mt-3",
                            classNames?.error
                        )}>
                            <div className="opacity-60 mb-4 flex flex-col items-center">
                                <GhostIcon size={120} strokeWidth={1.3} />
                                <h3>An unexpected Error occurred</h3>
                            </div>
                            <Button onClick={refetch}>{refetching ? "Retrying" : "Retry"}</Button>
                        </div>
                    )
                        :
                        article[0]?.results?.length === 0 ? (
                            <div className={cn("flex flex-col justify-center space-y-4 items-center mt-3 opacity-60",
                                classNames?.noData
                            )}>
                                <FrownIcon size={120} strokeWidth={1.3} />
                                <h3>Looks like there are no replies</h3>
                                <h4>Maybe you can be the first!</h4>
                            </div>
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