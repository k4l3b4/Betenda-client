import { getPostBySlug } from "@/api/requests/post/requests";
import { getCookieValue } from "@/lib/utils";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";

const Poem = () => {
    return (
        <div>
            Enter
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { req } = context;
    const { slug } = context.params as ParsedUrlQuery


    // Get the value of the 'sessionId' cookie
    const sessionId = getCookieValue(req, 'sessionid')

    const queryClient = new QueryClient()
    await queryClient.prefetchQuery({ queryKey: ['get_post', slug], queryFn: () => getPostBySlug({ slug: slug as string, sessionId: sessionId }) })
    return {
        props: {
            dehydratedState: dehydrate(queryClient),
        },
    }
}

export default Poem;
