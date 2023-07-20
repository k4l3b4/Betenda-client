import Link from 'next/link';
import React from 'react';

function convertTextToLinks(text: string): React.ReactNode[] {
    const hashtagRegex = /#(\w+)(?!\.\w+)/g;
    const mentionRegex = /@(\w+)(?!\.\w+)/g;
    const linkRegex = /(?:(?:https?|ftp):\/\/)?(?!localhost\b)(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?|(?:\d{1,3}\.){3}\d{1,3})(?::\d+)?(?:\/?\S*)?/gi;

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    text.replace(hashtagRegex, (match, hashtag, index) => {
        const beforeText = text.slice(lastIndex, index);
        const link = (
            <Link href={`/hashtag/${hashtag}`} key={index}>
                {`#${hashtag}`}
            </Link>
        );
        parts.push(beforeText, link);
        lastIndex = index + match.length;
        return match;
    });

    text.replace(mentionRegex, (match, mention, index) => {
        const beforeText = text.slice(lastIndex, index);
        const link = (
            <Link href={`/user/${mention}`} key={index}>
                {`@${mention}`}
            </Link>
        );
        parts.push(beforeText, link);
        lastIndex = index + match.length;
        return match;
    });

    text.replace(linkRegex, (match, index) => {
        const beforeText = text.slice(lastIndex, index);
        const url = match.startsWith('http') ? match : `http://${match}`;
        const link = (
          <a href={url} target="_blank" rel="noopener noreferrer" key={index}>
            {match}
          </a>
        );
        parts.push(beforeText, link);
        lastIndex = index + match.length;
        return match;
      });

    const remainingText = text.slice(lastIndex);
    parts.push(remainingText);

    return parts;
}

export default convertTextToLinks