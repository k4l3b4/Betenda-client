import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
type LoadMoreType = {
    fetchNextPage: () => void,
    hasNextPage: boolean,
    isFetchingNextPage: boolean,
    rootMargin?: string
}


const LoadMore: React.FC<LoadMoreType> = ({ fetchNextPage, hasNextPage, isFetchingNextPage, rootMargin }) => {

    const { ref, inView } = useInView({
        initialInView: false,
        rootMargin: rootMargin ?? `0px 0px 300px 0px`
    })

    useEffect(() => {
        if (inView) {
            fetchNextPage()
        }
        console.log(inView)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inView])

    return (
        <div ref={ref} className="flex justify-center">
            <Button
                variant="secondary"
                className="justify-self-center my-5 disabled:cursor-not-allowed disabled:opacity-80 font-semibold px-5 py-2 rounded text-opacity-90"
                onClick={() => fetchNextPage()}
                disabled={!hasNextPage || isFetchingNextPage}
            >
                {isFetchingNextPage
                    ? 'Loading more...'
                    : hasNextPage
                        ? 'Load more'
                        : 'All caught up'}
            </Button>
        </div>
    );
}

export default LoadMore;