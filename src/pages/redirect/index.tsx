import Meta from "@/components/meta/meta";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";

const Redirect = () => {
    const router = useRouter()
    const { url } = router.query as ParsedUrlQuery
    const typedUrl = url as string
    return (
        <div className="h-screen w-screen flex items-center justify-center px-2">
            <Meta title="You are leaving betenda" />
            <Card className="flex flex-col items-center gap-y-4 w-full max-w-[600px] h-60 justify-around py-4 px-2">
                <div>
                    <h3>Do you want to open this link??</h3>
                    <p className="text-red-500">{typedUrl}</p>
                </div>
                <div className="flex items-center gap-x-4">
                    <a href={typedUrl} rel="noopener noreferrer" className={buttonVariants({ variant: "default" })}>Yes, i do</a>
                </div>
            </Card>
        </div>
    );
}

export default Redirect;