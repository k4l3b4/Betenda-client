import { deleteArticleRequest } from "@/api/requests/article/requests";
import { deleteCommentRequest } from "@/api/requests/comment/requests";
import { deletePostRequest } from "@/api/requests/post/requests";
import { InfiniteCommentsType } from "@/types/comment";
import { InfinitePostsType } from "@/types/post";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type UseDeletePost = {
    onSuccess: {
        deletedPostId: number,
        parent?: number | null,
        parent_slug?: string
    },
    onError?: () => void,
    onReplyDelete?: () => void,
}

type UseDeleteArticle = {
    onSuccess?: (data: any) => void,
    onError?: () => void,
}

type UseDeleteResource = {
    onSuccess?: (data: any) => void,
    onError?: () => void,
    commentDeleted: {
        deletedCommentId: number,
        parentId?: number,
        resource_id: number
    }
}


export const useDeletePost = ({ onSuccess, onError, onReplyDelete }: UseDeletePost) => {
    const queryClient = useQueryClient()
    const onDeleteSuccess = (deletedPostId: number, parent?: number | null, parent_slug?: string) => {
        if (parent_slug) {
            queryClient.setQueryData<InfinitePostsType | undefined>(['get_replies', parent_slug], (oldData) => {
                if (!oldData) return undefined;
                const updatedPages = oldData.pages.map(page => {
                    const updatedResults = page.results.filter(post => post.id !== deletedPostId);
                    return {
                        ...page,
                        results: updatedResults,
                    };
                });

                return {
                    pages: updatedPages,
                    pageParams: oldData.pageParams,
                };
            });
        }
        queryClient.setQueryData<InfinitePostsType | undefined>(['posts'], (oldData) => {
            if (!oldData) return undefined;
            // Find the post with the deleted ID
            if (parent !== null) {
                const updatedPages = oldData.pages.map(page => {
                    const updatedResults = page.results.map(post => {
                        if (post?.id === parent) {
                            if (onReplyDelete) {
                                onReplyDelete()
                            }
                            const updatedThread = post.thread.filter(reply => reply.id !== deletedPostId);
                            return {
                                ...post,
                                thread: updatedThread,
                            };
                        }
                        return post;
                    });
                    return {
                        ...page,
                        results: updatedResults,
                    };
                });
                console.log('updatedPages:', updatedPages)
                return {
                    pages: updatedPages,
                    pageParams: oldData.pageParams,
                };
            }

            // If the post doesn't have a parent or the parent is null
            const updatedPages = oldData.pages.map(page => {
                const updatedResults = page.results.filter(post => post.id !== deletedPostId);
                return {
                    ...page,
                    results: updatedResults,
                };
            });

            return {
                pages: updatedPages,
                pageParams: oldData.pageParams,
            };
        });
    };

    const { mutate, isLoading } = useMutation({
        mutationFn: ({ id }: { id: number }) => deletePostRequest({ id }),
        onSuccess: (data) => {
            if (onSuccess) {
                onDeleteSuccess(onSuccess.deletedPostId, onSuccess.parent, onSuccess.parent_slug)
            }
        },
        onError: () => {
            if (onError) {
                onError();
            }
        }
    });

    return { mutate, isLoading };
};

export const useDeleteArticle = ({ onSuccess, onError }: UseDeleteArticle) => {
    const { mutate, isLoading } = useMutation({
        mutationFn: ({ id }: { id: number }) => deleteArticleRequest({ id }),
        onSuccess: (data) => {
            if (onSuccess) {
                onSuccess(data);
            }
        },
        onError: () => {
            if (onError) {
                onError();
            }
        }
    });

    return { mutate, isLoading };
};

export const useDeleteComment = ({ onSuccess, onError, commentDeleted }: UseDeleteResource) => {
    const queryClient = useQueryClient()
    const { mutate, isLoading } = useMutation({
        mutationFn: ({ id }: { id: number }) => deleteCommentRequest({ id }),
        onSuccess: (data) => {
            if (commentDeleted?.parentId) {
                queryClient.setQueryData<InfiniteCommentsType | undefined>(['replies', commentDeleted?.parentId], (oldData) => {
                    if (!oldData) return undefined;
                    const updatedPages = oldData.pages.map(page => {
                        const updatedResults = page.results.filter(comment => comment?.id !== commentDeleted?.deletedCommentId);
                        return {
                            ...page,
                            results: updatedResults,
                        };
                    });

                    return {
                        pages: updatedPages,
                        pageParams: oldData.pageParams,
                    };
                });
                queryClient.setQueryData<InfiniteCommentsType | undefined>(['comments', commentDeleted.resource_id], (oldData) => {
                    if (!oldData) return undefined;
                    const updatedPages = oldData.pages.map(page => {
                        const updatedResults = page.results.map(comment => {
                            if (comment.id === commentDeleted?.parentId) { // Replace 'specificCommentId' with the actual ID you're looking for
                                return {
                                    ...comment,
                                    reply_count: comment.reply_count - 1,
                                };
                            }
                            return comment;
                        });
                        return {
                            ...page,
                            results: updatedResults,
                        };
                    });

                    return {
                        pages: updatedPages,
                        pageParams: oldData.pageParams,
                    };
                });
            } else {
                queryClient.setQueryData<InfiniteCommentsType | undefined>(['comments', commentDeleted.resource_id], (oldData) => {
                    if (!oldData) return undefined;
                    const updatedPages = oldData.pages.map(page => {
                        const updatedResults = page.results.filter(comment => comment.id !== commentDeleted?.deletedCommentId);
                        return {
                            ...page,
                            total_items: oldData?.pages?.[0]?.total_items - 1,
                            results: updatedResults,
                        };
                    });

                    return {
                        pages: updatedPages,
                        pageParams: oldData.pageParams,
                    };
                });
            }
        },
        onError: () => {
            if (onError) {
                onError();
            }
        }
    });

    return { mutate, isLoading };
};