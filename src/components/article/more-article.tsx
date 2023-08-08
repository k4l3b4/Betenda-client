import { ArticleType } from "@/types/article";
import Image from "next/image";
import convertTextToLinks from "@/components/convert-text-to-links/convert-text-to-links";
import Link from "next/link";
import { RelativeTime } from "../time/Time";

const MoreArticle = ({ article }: { article: ArticleType }) => {
    return (
        <Link className="norm-link flex gap-x-2" href={`/article/${article?.slug}`}>
            {
                article?.image ?
                    <Image className="w-20 h-20 object-cover rounded-md border" src={article?.image} alt={article?.title} width="300" height="300" />
                    :
                    null
            }
            <div>
                <div>
                    <p className="text-sm txt-1">{convertTextToLinks(article?.title)}</p>
                    <p className="text-xs txt-2 opacity-60">{convertTextToLinks(article?.desc)}</p>
                </div>
                <div>
                    <div className="flex flex-row justify-between mt-1">
                        <p className="text-sm">By: {`${article?.authors?.[0]?.first_name} ${article?.authors?.[0]?.last_name}`}</p>
                        <p className="text-xs opacity-50">{RelativeTime(article?.published_date)}</p>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default MoreArticle;