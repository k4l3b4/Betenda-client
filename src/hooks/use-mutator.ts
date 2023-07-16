import { useState, useCallback } from 'react';

type Mutation<T> = (data: T) => Promise<void>;

interface MutationResult<T> {
    isLoading: boolean;
    error: string | null;
    isError: boolean;
    mutate: (data: T) => Promise<void>;
}

const useMutation = <T>(mutation: Mutation<T>): MutationResult<T> => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | any | null>(null);
    const [isError, setIsError] = useState(false);

    const mutate = useCallback(
        async (data: T): Promise<void> => {
            try {
                setIsLoading(true);
                await mutation(data);
            } catch (error) {
                setIsError(true);
                setError(error);
            } finally {
                setIsLoading(false);
            }
        },
        [mutation]
    );

    return { isLoading, error, isError, mutate };
};

export default useMutation;