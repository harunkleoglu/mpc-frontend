import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
    src: string;
    alt: string;
    width: number;
    height: number;
    className?: string;
    fallback?: React.ReactNode;
}

export function OptimizedImage({ 
    src, 
    alt, 
    width, 
    height, 
    className = '', 
    fallback 
}: OptimizedImageProps) {
    const [imageError, setImageError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    if (imageError) {
        return fallback || (
            <div className={`${className} bg-gray-200 flex items-center justify-center`}>
                <span className="text-gray-500 text-sm">No Image</span>
            </div>
        );
    }

    return (
        <div className="relative">
            {isLoading && (
                <div className={`${className} bg-gray-200 animate-pulse flex items-center justify-center absolute inset-0`}>
                    <span className="text-gray-400 text-sm">Loading...</span>
                </div>
            )}
            <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                className={className}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                    console.warn('Failed to load image:', src);
                    setImageError(true);
                    setIsLoading(false);
                }}
                style={{ display: isLoading ? 'none' : 'block' }}
            />
        </div>
    );
}