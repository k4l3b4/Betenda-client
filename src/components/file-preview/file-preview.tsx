import { RefreshCw, Trash2 } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

interface FilePreviewProps {
    file: File;
    previewUrl: string;
    onDelete: () => void;
    onSwap: (file: File) => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file, previewUrl, onDelete, onSwap }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [loading, setLoading] = useState(false);

    const handleSwapClick = () => {
        onSwap(file);
    };

    const handleVideoLoadStart = () => {
        setLoading(true);
    };

    const handleVideoLoadEnd = () => {
        setLoading(false);
    };

    useEffect(() => {
        const videoElement = videoRef.current;
        const handleReadyStateChange = () => {
            if (videoElement) {
                const state = videoElement.readyState;
                console.log('Ready state:', state);
                // Perform additional actions based on the readyState
            }
        };
        if (videoElement) {
            videoElement.addEventListener('readystatechange', handleReadyStateChange);
        }

        // Cleanup the event listener when the component unmounts
        return () => {
            if (videoElement) {
                videoElement.removeEventListener('readystatechange', handleReadyStateChange);
            }
        };
    }, []);


    return (
        <div className='relative'>
            {loading ? (
                <div className='h-[244px] w-[264] flex justify-center items-center text-center'>
                    <p className='font-bold'>Loading...</p>
                </div>
            )
                :
                previewUrl ? (
                    <>
                        {file.type.startsWith('image/') ? (
                            <Image className='rounded-md object-cover max-h-[244px] max-w-[264]' src={previewUrl} alt="Preview" width="600" height="500" style={{ width: '100%', height: 'auto' }} />
                        ) : (
                            <video
                                className="rounded-md object-cover max-h-[244px] max-w-[264]"
                                ref={videoRef}
                                src={previewUrl}
                                controls
                                style={{ width: '100%' }}
                                onLoadedData={handleVideoLoadEnd}
                                onWaiting={handleVideoLoadStart}
                            />
                        )}
                    </>
                ) : (
                    <div className='h-[244px] w-[264] flex justify-center items-center'>
                        <p className='font-bold'>No preview for the selected file</p>
                    </div>
                )}
            <span className='absolute mb-20 inset-0 bg-gradient-to-b from-slate-700  via-transparent to-transparent rounded-md' />
            <Button className='absolute top-2 left-2' size="icon" variant="ghost" onClick={onDelete}><Trash2 /></Button>
            <Button className='absolute top-2 right-2' size="icon" variant="ghost" onClick={handleSwapClick}><RefreshCw /></Button>
        </div>
    );
};

export default FilePreview