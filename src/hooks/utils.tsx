import { getArticleBySlug } from "@/api/requests/article/requests"
import { useQuery } from "@tanstack/react-query"

export const useGetArticle = ({ slug }: { slug: string }) => {
    const { data, isLoading, isError, refetch, isRefetching } = useQuery(
        {
            queryKey: ['get_article_by_slug', slug],
            queryFn: () => getArticleBySlug({ slug: slug }),
            enabled: slug ? true : false
        }
    )

    return { data, isLoading, isError, refetch, isRefetching }
}