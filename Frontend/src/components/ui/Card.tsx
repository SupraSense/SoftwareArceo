import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    noPadding = false,
    ...props
}) => {
    return (
        <div
            className={`bg-white rounded-xl border border-gray-100 shadow-sm ${!noPadding ? 'p-6' : ''} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};
