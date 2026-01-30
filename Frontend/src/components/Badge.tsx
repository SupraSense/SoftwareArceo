import React from 'react';
import type { BadgeProps } from '../types/theme';

/**
 * Componente Badge reutilizable para mostrar estados
 * Basado en el prototipo del sistema de gestión
 */
const Badge: React.FC<BadgeProps> = ({
    variant = 'available',
    children,
    className = '',
}) => {
    const baseClasses = 'badge';

    const variantClasses = {
        'available': 'badge-available',
        'in-service': 'badge-in-service',
        'on-leave': 'badge-on-leave',
        'inactive': 'badge-inactive',
    };

    const dotColors = {
        'available': 'bg-green-600',
        'in-service': 'bg-blue-600',
        'on-leave': 'bg-yellow-600',
        'inactive': 'bg-gray-600',
    };

    const combinedClasses = [
        baseClasses,
        variantClasses[variant],
        className,
    ].join(' ');

    return (
        <span className={combinedClasses}>
            <span className={`w-2 h-2 ${dotColors[variant]} rounded-full mr-2`}></span>
            {children}
        </span>
    );
};

export default Badge;
