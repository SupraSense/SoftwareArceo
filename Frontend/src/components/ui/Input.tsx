import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
    rightElement?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, error, icon, rightElement, className = '', ...props }) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-text-secondary dark:text-gray-300 mb-1">
                    {label}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-tertiary">
                        {icon}
                    </div>
                )}
                <input
                    className={`
            w-full rounded-lg border border-border bg-surface text-text-primary 
            dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-500 
            focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow
            placeholder:text-text-tertiary
            ${icon ? 'pl-10' : 'pl-4'}
            ${rightElement ? 'pr-10' : 'pr-4'}
            ${error ? 'border-red-500 focus:ring-red-200' : ''}
            ${className}
            py-2
          `}
                    {...props}
                />
                {rightElement && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-tertiary">
                        {rightElement}
                    </div>
                )}
            </div>
            {error && <p className="mt-1 text-sm text-red-500 text-left">{error}</p>}
        </div>
    );
};
