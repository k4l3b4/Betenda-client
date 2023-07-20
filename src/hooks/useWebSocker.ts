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
    const auth = GetFromStorage('access')
    useEffect(() => {
        socketRef.current = new WebSocket(`ws://localhost:8000/ws/${endpoint}${auth ? `&token=${auth}` : ''}`);

        const { onOpen, onClose, onError, onMessage } = options || {};

        socketRef.current.addEventListener('open', (event) => {
            console.info('WebSocket connection established');
            if (onOpen) {
                onOpen(event as E);
            }
        });

        socketRef.current.addEventListener('message', (event) => {
            const receivedData: T = JSON.parse(event.data);
            setData(receivedData);
            if (onMessage) {
                onMessage(event as E);
            }
        });

        socketRef.current.addEventListener('close', (event) => {
            console.info('WebSocket connection closed');
            if (onClose) {
                onClose(event as E);
            }
        });

        socketRef.current.addEventListener('error', (event) => {
            const errorEvent = event as ErrorEvent;
            const error = new Error(errorEvent.error);
            setError(error);
            if (onError) {
                onError(event as E);
            }
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, [endpoint, options]);

    return { data, error };
};

export default useWebSocket;
