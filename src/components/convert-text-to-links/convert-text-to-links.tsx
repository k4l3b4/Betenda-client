import Link from 'next/link';
import React from 'react';

function convertTextToLinks(text: string): React.ReactNode[] {
    const parts: React.ReactNode[] = [];
    const wordRegex = /\S+/g;
    let lastIndex = 0;

    const processLink = (link: string, isHashtag: boolean, isMention: boolean) => {
        const linkElement = isHashtag ? (
            <Link onClick={(event) => event.stopPropagation()} href={`/hashtag/${link.substring(1)}`} key={lastIndex}>
                {`${link}`}
            </Link>
        ) : isMention ? (
            <Link onClick={(event) => event.stopPropagation()} href={`${link.substring(1)}`} key={lastIndex}>
                {`${link}`}
            </Link>
        ) : (
            <a onClick={(event) => event.stopPropagation()} href={`/redirect?url=${getProperUrl(link)}`} target="_blank" rel="noopener noreferrer" key={lastIndex}>
                {link}
            </a>
        );
        parts.push(linkElement);
    };

    const getProperUrl = (url: string): string => {
        // Add "https://" if the URL doesn't start with "http://" or "https://"
        if (!url.match(/^(https?:\/\/)/i)) {
            return `https://${url}`;
        }
        return url;
    };

    let match;
    while ((match = wordRegex.exec(text)) !== null) {
        const beforeText = text?.slice(lastIndex, match.index);
        const word = match[0];
        const isHashtag = word?.match(/^#(\w+)(?!\.\w+)/) ? true : false;
        const isMention = word?.match(/^@([\w\u1200-\u137F\u1369-\u137C.]+)(?!\.\w+)/) ? true : false;
        const isLink = word?.match(
            /(?:(?:https?|ftp):\/\/)?(?!localhost\b)(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?|(?:\d{1,3}\.){3}\d{1,3})(?::\d+)?(?:\/?\S*)?/i
        );

        if (beforeText) {
            parts.push(beforeText);
        }

        if (isHashtag || isMention || isLink) {
            processLink(word, isHashtag, isMention);
        } else {
            parts.push(word);
        }

        lastIndex = match.index + word.length;
    }

    return parts;
}

export default convertTextToLinks;
