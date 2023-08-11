import { createComment, createReply } from '@/api/requests/comment/requests';
import { CommentType, InfiniteCommentsType } from '@/types/comment';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { createContext, useContext, useState, useRef, useEffect } from 'react';


interface ReplyContextValue {
    username: string | null,
    commentId: number | null,
    commentInput: string,
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    handleReplyToComment: (comment: CommentType) => void,
    handleSaveComment: () => void;
    handleTopParent: (parent: number) => void,
    onSuccess?: (data: any) => void,
    commenting: boolean,
    replying: boolean,
    commentError: boolean,
    replyError: boolean,
    inputError: string,
    setInputError: React.Dispatch<React.SetStateAction<string>>,
}

const ReplyContext = createContext<ReplyContextValue | undefined>(undefined);

const ReplyProvider = ({ children, resource_type, resource_id }: { children: React.ReactNode, resource_type: string, resource_id: number }) => {
    const [username, setUsername] = useState<string | null>(null);
    const [commentId, setCommentId] = useState<number | null>(null);
    const [commentInput, setCommentInput] = useState<string>('');
    const [topParentId, setTopParentId] = useState<number | null>(null);
    const [inputError, setInputError] = useState<string>("")
    console.log(topParentId)
    const queryClient = useQueryClient()

    const { mutate: comment, isLoading: commenting, isError: commentError } = useMutation({
        mutationFn: createComment,
        onSuccess: (data) => {
            setUsername(null);
            setCommentId(null);
            setCommentInput('');
            const currentData = queryClient.getQueryData<InfiniteCommentsType>(['comments']);

            if (currentData) {
                const updatedResults = [
                    data?.data,
                    ...(currentData.pages[0]?.results || []),
                ];
                console.log("updated data:", updatedResults)
                queryClient.setQueryData<InfiniteCommentsType>(['comments'], {
                    pages: [
                        {
                            total_items: currentData.pages[0]?.total_items,
                            page: currentData.pages[0]?.page,
                            page_size: currentData.pages[0]?.page_size,
                            results: updatedResults,
                        },
                        ...currentData.pages.slice(1),
                    ],
                    pageParams: currentData.pageParams,
                });
            }
            // handle optimistic update
        }
    })

    const { mutate: reply, isLoading: replying, isError: replyError } = useMutation({
        mutationFn: createReply,
        onSuccess: (data) => {
            setUsername(null);
            setCommentId(null);
            setCommentInput('');
            const currentData = queryClient.getQueryData<InfiniteCommentsType>(['replies', topParentId]);
            if (currentData) {
                console.log("current data:", currentData)
                // Add the new notification to the first page
                const updatedResults = [
                    data?.data, // getting this from the onSuccess handler in the useMutation hook
                    ...(currentData.pages[0]?.results || []),
                ];
                console.log("updated data:", updatedResults)
                // Update the query data with the new notification added to the first page
                queryClient.setQueryData<InfiniteCommentsType>(['replies', topParentId], {
                    pages: [
                        {
                            total_items: currentData.pages[0]?.total_items, // Preserve the total_items value
                            page: currentData.pages[0]?.page, // Preserve the page value
                            page_size: currentData.pages[0]?.page_size, // Preserve the page_size value
                            results: updatedResults, // Update the property name to "results"
                        },
                        ...currentData.pages.slice(1),
                    ],
                    pageParams: currentData.pageParams,
                });
            }
        }
    })

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Add an event listener to the "input" event to handle clearing the input field
        const handleInput = (event: Event) => {
            const inputElement = event.target as HTMLInputElement;
            const inputText = inputElement.value;
            if (inputText === '' && username && commentId !== null) {
                setUsername(null);
                setCommentId(null);
                setCommentInput('');
            }
        };

        const inputElement = inputRef.current;
        if (inputElement) {
            inputElement.addEventListener('input', handleInput);
        }

        return () => {
            if (inputElement) {
                inputElement.removeEventListener('input', handleInput);
            }
        };
    }, [username, commentId]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputText = event.target.value;

        if (inputText.startsWith('replying to: @')) {
            setCommentInput(inputText);
        } else {
            // If the input doesn't start with 'replying to:', clear the 'replying to' data
            setUsername(null);
            setCommentId(null);
            setCommentInput(inputText);
        }
    };

    const handleReplyToComment = (comment: CommentType) => {
        setUsername(comment?.user?.user_name);
        setCommentId(comment?.id);
        setCommentInput(`replying to: @${comment?.user?.user_name} `);
    };

    const handleSaveComment = () => {
        if (commentInput) {
            let commentText = commentInput;
            if (username && commentId !== null) {
                const regex = new RegExp(`^replying to: @${username} `);
                commentText = commentText.replace(regex, '').trim();
                if (commentText) {
                    reply({ resource_type: resource_type, resource_id: resource_id, parent: commentId as number, values: { comment: commentText } })
                } else {
                    setInputError("We don't save empty comments.")
                }
                console.log(`Replying to comment ${commentId} with text: ${commentInput} on parent ${topParentId}`);
            } else {
                comment({ resource_type: resource_type, resource_id: resource_id, values: { comment: commentText } })
                console.log(`Creating new comment with text: ${commentInput}`);
            }
        }
    };


    const handleTopParent = (parent: number) => {
        setTopParentId(parent)
    }

    const value: ReplyContextValue = {
        username,
        commentId,
        commentInput,
        inputError,
        setInputError,
        handleInputChange,
        handleReplyToComment,
        handleSaveComment,
        handleTopParent,
        commenting,
        replying,
        commentError,
        replyError,
    };

    return (
        <ReplyContext.Provider value={value}>
            {children}
        </ReplyContext.Provider>
    );
};

const useReplyContext = (): ReplyContextValue => {
    const context = useContext(ReplyContext);
    if (!context) {
        throw new Error('useReplyContext must be used within a ReplyProvider');
    }
    return context;
};

export { ReplyProvider, useReplyContext };