import GetFromStorage from '@/components/get-from-local/get-from-local';
import { useEffect, useRef, useState } from 'react';

interface WebSocketOptions<E> {
    onOpen?: (event: E) => void;
    onClose?: (event: E) => void;
    onError?: (event: E) => void;
    onMessage?: (event: E) => void;
}

interface WebSocketHookResult<T, E> {
    data: T | null;
    error: Error | null;
}

const useWebSocket = <T, E>(endpoint: string, options?: WebSocketOptions<E>): WebSocketHookResult<T, E> => {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const socketRef = useRef<WebSocket | null>(null);
    const [retryInterval, setRetryInterval] = useState<number | null>(null);
    const DEFAULT_RETRY_INTERVAL = 2000;
    const MAX_RETRY_INTERVAL = 16000; // Maximum retry interval in milliseconds
    const retryAttempts = useRef<number>(0);
    const auth = GetFromStorage('access')

    const connectWebSocket = () => {
        const socket = new WebSocket(`ws://localhost:8000/ws/${endpoint}${auth ? `?token=${auth}` : ''}`);

        const { onOpen, onClose, onError, onMessage } = options || {};

        socket.addEventListener('open', (event) => {
            console.info('WebSocket connection established');
            if (onOpen) {
                onOpen(event as E);
            }
            retryAttempts.current = 0;
        });

        socket.addEventListener('message', (event) => {
            const receivedData: T | any = JSON.parse(event.data);
            setData(receivedData);
            if (onMessage) {
                onMessage(event as E);
            }
        });

        socket.addEventListener('close', (event) => {
            console.info('WebSocket connection closed');
            if (onClose) {
                onClose(event as E);
            }
            retryAttempts.current++;
            const retryInterval = Math.min(DEFAULT_RETRY_INTERVAL * 2 ** retryAttempts.current, MAX_RETRY_INTERVAL);
            setRetryInterval(retryInterval);
        });

        socket.addEventListener('error', (event) => {
            const errorEvent = event as ErrorEvent;
            const error = new Error(errorEvent.error);
            setError(error);
            if (onError) {
                onError(event as E);
            }
            setRetryInterval(DEFAULT_RETRY_INTERVAL);
        });

        socketRef.current = socket;
        return socket;
    }



    useEffect(() => {
        const socket = connectWebSocket();
        console.info("Connecting to websocket")
        return () => {
            if (socket) {
                socket.close();
            }
        };
    }, [endpoint, options]); // not including connectWebSocket wont actually do anything even tho eslint is complaining 

    useEffect(() => {
        // Reconnect when retryInterval changes and is not null.
        if (retryInterval !== null) {
            const timerId = setTimeout(() => {
                setRetryInterval(null);
                connectWebSocket();
                console.info("Retrying to connect to websocket")
            }, retryInterval);

            return () => clearTimeout(timerId);
        }
    }, [retryInterval]); // not including connectWebSocket wont actually do anything even tho eslint is complaining

    return { data, error };
};

export default useWebSocket;
