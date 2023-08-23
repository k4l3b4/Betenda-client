import { getGoal } from "@/api/requests/roadmap/requests";
import Meta from "@/components/meta/meta";
import RoadMapComp from "@/components/roadmap/goals-comp";
import { getCookieValue } from "@/lib/utils";
import { InfiniteRoadMapsType } from "@/types/roadmap";
import { QueryClient, dehydrate, useInfiniteQuery } from "@tanstack/react-query";
import { GetServerSideProps } from "next";

const RoadMap = () => {
    const { data, isError, isLoading, isFetchingNextPage, refetch, isRefetching, fetchNextPage, hasNextPage } = useInfiniteQuery({ queryKey: ['goals'], queryFn: getGoal, getNextPageParam: (lastPage) => lastPage?.data?.page < lastPage?.data?.pages_count ? lastPage?.data?.page + 1 : undefined, })
    const roadmap = data as InfiniteRoadMapsType

    return (
        <div>
            <Meta title="Betenda goals" />
            <RoadMapComp data={roadmap} error={isError} loading={isLoading} refetch={refetch} refetching={isRefetching} />
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { req } = context;
    const sessionId = getCookieValue(req, 'sessionid')

    const queryClient = new QueryClient()
    await queryClient.prefetchInfiniteQuery({ queryKey: ['goals'], queryFn: () => getGoal({ pageParam: 1, sessionId: sessionId }) })
    return {
        props: {
            dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
        },
    }
}


export default RoadMap;