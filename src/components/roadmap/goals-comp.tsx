import RoadMapData from "@/components/roadmap/goal-data";
import { InfiniteRoadMapsType } from "@/types/roadmap";
import NoData from "@/components/app-ui-states/no-data";
import DataError from "@/components/app-ui-states/data-error";
import DataLoading from "@/components/app-ui-states/data-loading";

type RoadMapCompType = {
    loading: boolean,
    error: boolean,
    refetch: () => void,
    refetching: boolean,
    classNames?: {
        goals?: string,
        loading?: string,
        error?: string,
        noData?: string,
    }
    data: InfiniteRoadMapsType
}

const RoadMapComp: React.FC<RoadMapCompType> = ({ loading, error, refetch, refetching, data, classNames }) => {
    const goals = data?.pages
    return (
        <div>
            {
                loading ?
                    <DataLoading className={classNames?.loading} />
                    :
                    error ? (
                        <DataError className={classNames?.error} />
                    )
                        :
                        goals[0]?.results?.length === 0 ? (
                            <NoData className={classNames?.noData} message="Looks like there are no goals set yet" />
                        )
                            :
                            goals?.map(page =>
                                page?.results?.map((goal) => {
                                    return (
                                        <RoadMapData className={classNames?.goals} goal={goal} key={goal?.id} />
                                    )
                                }))
            }
        </div>
    );
}

export default RoadMapComp;