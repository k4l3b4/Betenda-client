import DataError from "@/components/app-ui-states/data-error";
import DataLoading from "@/components/app-ui-states/data-loading";
import NoData from "@/components/app-ui-states/no-data";
import PoemData from '@/components/poem/poem-data';
import { cn } from "@/lib/utils";
import { InfinitePoemType } from "@/types/contributions";

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
    data: InfinitePoemType
}

const PoemsComp: React.FC<ArticleCompType> = ({ loading, error, refetch, refetching, data, classNames }) => {
    const poem = data?.pages
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
                        poem[0]?.results?.length === 0 ? (
                            <NoData className={classNames?.noData} message="Looks like there are no poems yet" />
                        )
                            :
                            poem?.map(page =>
                                page?.results?.map((poem) => {
                                    return (
                                        <PoemData className={cn('hover-anim w-[650px]', classNames?.post)} poem={poem} key={poem?.id} />
                                    )
                                }))
            }
        </>
    );
}

export default PoemsComp;