import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const RouteLoader = () => {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const handleStart = () => setLoading(true);
        const handleComplete = () => setLoading(false);
        router.events.on('routeChangeStart', handleStart);
        router.events.on('routeChangeComplete', handleComplete);
        router.events.on('routeChangeError', handleComplete);

        return () => {
            router.events.off('routeChangeStart', handleStart);
            router.events.off('routeChangeComplete', handleComplete);
            router.events.off('routeChangeError', handleComplete);
        };
    }, [router.events]);

    return loading ? (
        <div className='fixed z-[999] top-0 h-auto rounded inset-x-0 w-full'>
            <LinearProgress color="inherit" />
        </div>
    ) :
        null
}

export default RouteLoader