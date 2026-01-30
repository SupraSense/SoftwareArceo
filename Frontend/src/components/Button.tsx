import React from 'react';
import type { ButtonProps } from '../types/theme';

/**
 * Componente Button reutilizable con variantes predefinidas
 * Basado en el tema de Tailwind CSS personalizado
 */
const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    disabled = false,
    onClick,
    children,
    className = '',
}) => {
    const baseClasses = 'btn';

    const variantClasses = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        ghost: 'btn-ghost',
    };

    const sizeClasses = {
        sm: 'text-sm px-3 py-1.5',
        md: 'text-base px-4 py-2',
        lg: 'text-lg px-6 py-3',
    };

    const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

    const combinedClasses = [
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        disabledClasses,
        className,
    ].join(' ');

    return (
        <button
            className={combinedClasses}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;
