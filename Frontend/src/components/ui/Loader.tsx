import React from 'react';
import { RingLoader } from 'react-spinners';

interface LoaderProps {
    loading?: boolean;
    size?: number | string;
    color?: string;
    message?: string;
    className?: string;
}

export const Loader: React.FC<LoaderProps> = ({
    loading = true,
    size = 60,
    color = "#3b82f6", // blue-500 equivalent
    message = "Cargando...",
    className = ""
}) => {
    if (!loading) return null;

    return (
        <div className={`flex flex-col items-center justify-center p-8 space-y-6 ${className}`}>
            <RingLoader
                color={color}
                size={size}
                loading={loading}
                speedMultiplier={1.2}
            />
            {message && (
                <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse">
                    {message}
                </p>
            )}
        </div>
    );
};
