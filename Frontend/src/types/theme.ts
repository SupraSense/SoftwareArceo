/**
 * Tipos personalizados para el tema de Tailwind CSS
 * Estos tipos ayudan con el autocompletado en TypeScript
 */

export type PrimaryColor =
    | 'primary-50'
    | 'primary-100'
    | 'primary-200'
    | 'primary-300'
    | 'primary-400'
    | 'primary-500'
    | 'primary-600'
    | 'primary-700'
    | 'primary-800'
    | 'primary-900'
    | 'primary-950';

export type StatusColor =
    | 'status-available'
    | 'status-inService'
    | 'status-onLeave'
    | 'status-inactive';

export type SurfaceColor =
    | 'surface'
    | 'surface-secondary'
    | 'surface-tertiary';

export type TextColor =
    | 'text-primary'
    | 'text-secondary'
    | 'text-tertiary';

export type BorderColor =
    | 'border-light'
    | 'border'
    | 'border-dark';

export type ButtonVariant =
    | 'btn-primary'
    | 'btn-secondary'
    | 'btn-ghost';

export type BadgeVariant =
    | 'badge-available'
    | 'badge-in-service'
    | 'badge-on-leave'
    | 'badge-inactive';

/**
 * Props comunes para componentes con variantes de estilo
 */
export interface StyledComponentProps {
    className?: string;
}

export interface ButtonProps extends StyledComponentProps {
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    onClick?: () => void;
    children: React.ReactNode;
}

export interface BadgeProps extends StyledComponentProps {
    variant?: 'available' | 'in-service' | 'on-leave' | 'inactive';
    children: React.ReactNode;
}

export interface CardProps extends StyledComponentProps {
    hover?: boolean;
    children: React.ReactNode;
}
