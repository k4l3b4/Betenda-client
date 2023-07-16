import { useState } from 'react';

type Fetcher<T> = () => Promise<T>;

interface FetcherResult<T> {
    data: T | null;
    isLoading: boolean;
    error: string | null;
    isError: boolean;
    fetchData: () => void;
}

const useFetcher = <T>(fetcher: Fetcher<T>): FetcherResult<T> => {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | any | null>(null);

    const fetchData = async (): Promise<void> => {
        try {
            setIsLoading(true);
            const response = await fetcher();
            setData(response);
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    };

    const isError = error !== null;

    return { data, isLoading, error, isError, fetchData };
};

export default useFetcher;