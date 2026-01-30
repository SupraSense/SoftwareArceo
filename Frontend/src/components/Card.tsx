import React from 'react';
import type { CardProps } from '../types/theme';

/**
 * Componente Card reutilizable
 * Contenedor con estilos predefinidos basados en el tema
 */
const Card: React.FC<CardProps> = ({
    hover = false,
    children,
    className = '',
}) => {
    const baseClasses = 'card';
    const hoverClasses = hover ? 'card-hover' : '';

    const combinedClasses = [
        baseClasses,
        hoverClasses,
        className,
    ].join(' ');

    return (
        <div className={combinedClasses}>
            {children}
        </div>
    );
};

export default Card;
