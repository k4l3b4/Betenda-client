import { cn } from "@/lib/utils";
import { InfiniteArticlesType } from "@/types/article";
import ArticleData from "@/components/article/article-data";
import dynamic from "next/dynamic";
const DataError = dynamic(() => import('@/components/app-ui-states/data-error'), {
    loading: () => <div className="w-full h-full flex items-center justify-center"><p className="font-medium opacity-70">Loading...</p></div>,
})
const DataLoading = dynamic(() => import('@/components/app-ui-states/data-loading'), {
    loading: () => <div className="w-full h-full flex items-center justify-center"><p className="font-medium opacity-70">Loading...</p></div>,
})
const NoData = dynamic(() => import('@/components/app-ui-states/no-data'), {
    loading: () => <div className="w-full h-full flex items-center justify-center"><p className="font-medium opacity-70">Loading...</p></div>,
})

type ArticleCompType = {
    loading: boolean,
    error: boolean,
    refetch: () => void,
    refetching: boolean,
    classNames?: {
        article?: string,
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
                                        <ArticleData className={cn('w-full max-w-[650px] my-2', classNames?.article)} article={article} key={article?.id} />
                                    )
                                }))
            }
        </>
    );
}

export default ArticlesComp;