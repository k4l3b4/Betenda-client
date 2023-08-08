import MetaTypes from '@/types/meta';
import Head from 'next/head';
import { FC } from 'react';

const Meta: FC<MetaTypes> = ({ title, desc, image, robots, url, tags, author, published_date, edited_date, type = "Website" }) => {
    const commonTitle = title ? `${title} - Betenda` : "Betenda"
    const commonDesc = desc ?? "Betenda is a private community of ethiopian gurage speakers to discuss about any and everything related to the gurage language and community"

    return (
        <Head>
            <title>{commonTitle}</title>
            <meta name="description" content={commonDesc} />

            {/* Og tags */}
            <meta property="og:title" content={commonTitle} />
            <meta property="og:description" content={commonDesc} />
            <meta property="og:url" content={`${url ?? 'https://betenda.app'}`} />
            <meta property="og:site_name" content="Betenda" />
            <meta property="og:image" content={`${image ?? 'https://betenda.app/icons/preview_image.png'}`} />
            <meta property="og:type" content={type} />
            {type === "Article" ? <meta name="robots" content={robots ? robots : "index, follow"} /> : null}

            {/* Article tags */}
            {published_date ? <meta property="article:published_time" content={published_date} /> : null}
            {edited_date ? <meta property="article:modified_time" content={edited_date} /> : null}
            {author ? <meta property="article:author" content={author} /> : null}
            {tags ? <meta property="article:tag" content={tags} /> : null}

            {/* Twitter tags */}
            <meta name="twitter:title" content={commonTitle} />
            <meta name="twitter:description" content={commonDesc} />
            <meta name="twitter:image" content={`${image ?? 'https://betenda.app/icons/preview_image.png'}`} />
            <meta name="twitter:card" content="summary_large_image" />
            <link rel="canonical" href={`${url ?? 'https://betenda.app'}`} />

            {/* Icons tags */}
            <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
            {/* <link rel="manifest" href="/site.webmanifest" /> */}
        </Head>
    );
};

export default Meta;