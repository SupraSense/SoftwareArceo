import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, User, Mail, CreditCard, Shield, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { createUserSchema, type CreateUserFormData } from '../../schemasZod/userSchema';
import { USER_ROLES } from '../../types/user';
import { userService } from '../../services/userService';

interface UserFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateUserFormData) => Promise<boolean>;
    isLoading?: boolean;
}

type ValidationState = 'idle' | 'checking' | 'available' | 'unavailable';

export const UserForm: React.FC<UserFormProps> = ({
    isOpen,
    onClose,
    onSubmit,
    isLoading = false,
}) => {
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<CreateUserFormData>({
        resolver: zodResolver(createUserSchema),
        mode: 'onChange',
        defaultValues: {
            firstName: '',
            lastName: '',
            dni: '',
            email: '',
            role: undefined,
        },
    });

    const [emailValidation, setEmailValidation] = useState<ValidationState>('idle');
    const [emailMessage, setEmailMessage] = useState('');
    const [dniValidation, setDniValidation] = useState<ValidationState>('idle');
    const [dniMessage, setDniMessage] = useState('');

    const emailDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const dniDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const watchedEmail = watch('email');
    const watchedDni = watch('dni');

    // Real-time email uniqueness validation
    useEffect(() => {
        if (emailDebounceRef.current) clearTimeout(emailDebounceRef.current);

        if (!watchedEmail || errors.email) {
            setEmailValidation('idle');
            setEmailMessage('');
            return;
        }

        // Basic email format check before hitting API
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(watchedEmail)) {
            setEmailValidation('idle');
            return;
        }

        setEmailValidation('checking');
        emailDebounceRef.current = setTimeout(async () => {
            try {
                const result = await userService.checkEmailAvailability(watchedEmail);
                if (result.available) {
                    setEmailValidation('available');
                    setEmailMessage('Email disponible');
                } else {
                    setEmailValidation('unavailable');
                    setEmailMessage(result.message || 'Este email ya está registrado');
                }
            } catch {
                setEmailValidation('idle');
                setEmailMessage('');
            }
        }, 600);

        return () => {
            if (emailDebounceRef.current) clearTimeout(emailDebounceRef.current);
        };
    }, [watchedEmail, errors.email]);

    // Real-time DNI uniqueness validation
    useEffect(() => {
        if (dniDebounceRef.current) clearTimeout(dniDebounceRef.current);

        if (!watchedDni || errors.dni) {
            setDniValidation('idle');
            setDniMessage('');
            return;
        }

        // Verify DNI is numeric and has min length
        if (!/^\d{7,8}$/.test(watchedDni)) {
            setDniValidation('idle');
            return;
        }

        setDniValidation('checking');
        dniDebounceRef.current = setTimeout(async () => {
            try {
                const result = await userService.checkDniAvailability(watchedDni);
                if (result.available) {
                    setDniValidation('available');
                    setDniMessage('DNI disponible');
                } else {
                    setDniValidation('unavailable');
                    setDniMessage(result.message || 'Este DNI ya está registrado');
                }
            } catch {
                setDniValidation('idle');
                setDniMessage('');
            }
        }, 600);

        return () => {
            if (dniDebounceRef.current) clearTimeout(dniDebounceRef.current);
        };
    }, [watchedDni, errors.dni]);

    useEffect(() => {
        if (isOpen) {
            reset({
                firstName: '',
                lastName: '',
                dni: '',
                email: '',
                role: undefined,
            });
            setEmailValidation('idle');
            setEmailMessage('');
            setDniValidation('idle');
            setDniMessage('');
        }
    }, [isOpen, reset]);

    const handleFormSubmit = async (data: CreateUserFormData) => {
        // Block if unique validation failed
        if (emailValidation === 'unavailable' || dniValidation === 'unavailable') {
            return;
        }
        const success = await onSubmit(data);
        if (success) {
            onClose();
        }
    };

    const renderValidationIcon = (state: ValidationState) => {
        switch (state) {
            case 'checking':
                return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
            case 'available':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'unavailable':
                return <AlertCircle className="w-4 h-4 text-red-500" />;
            default:
                return null;
        }
    };

    const renderValidationMessage = (state: ValidationState, message: string) => {
        if (state === 'idle' || !message) return null;
        return (
            <p className={`mt-1 text-xs font-medium transition-all duration-200 ${state === 'available' ? 'text-green-600 dark:text-green-400' :
                state === 'unavailable' ? 'text-red-500 dark:text-red-400' :
                    'text-blue-500 dark:text-blue-400'
                }`}>
                {state === 'checking' ? 'Verificando disponibilidad...' : message}
            </p>
        );
    };

    if (!isOpen) return null;

    const isFormBlocked = emailValidation === 'unavailable' || dniValidation === 'unavailable';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all animate-in zoom-in-95 duration-200 border border-gray-200 dark:border-gray-700">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-gray-800 dark:to-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-100 dark:bg-primary-900/40 rounded-lg">
                            <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Solicitud de Alta de Usuario
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Se enviará un email con credenciales temporales
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-5">
                    {/* Name fields row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Input
                                label="Nombre"
                                placeholder="Ej: Juan"
                                icon={<User size={16} />}
                                error={errors.firstName?.message}
                                {...register('firstName')}
                            />
                        </div>
                        <div>
                            <Input
                                label="Apellido"
                                placeholder="Ej: Pérez"
                                icon={<User size={16} />}
                                error={errors.lastName?.message}
                                {...register('lastName')}
                            />
                        </div>
                    </div>

                    {/* DNI */}
                    <div>
                        <Input
                            label="DNI"
                            placeholder="Ej: 30456789"
                            icon={<CreditCard size={16} />}
                            maxLength={8}
                            error={errors.dni?.message}
                            rightElement={renderValidationIcon(dniValidation)}
                            {...register('dni')}
                        />
                        {!errors.dni && renderValidationMessage(dniValidation, dniMessage)}
                    </div>

                    {/* Email */}
                    <div>
                        <Input
                            label="Email"
                            type="email"
                            placeholder="Ej: juan.perez@empresa.com"
                            icon={<Mail size={16} />}
                            error={errors.email?.message}
                            rightElement={renderValidationIcon(emailValidation)}
                            {...register('email')}
                        />
                        {!errors.email && renderValidationMessage(emailValidation, emailMessage)}
                    </div>

                    {/* Role Selector */}
                    <div className="w-full">
                        <label className="block text-sm font-medium text-text-secondary dark:text-gray-300 mb-1">
                            <div className="flex items-center gap-1.5">
                                <Shield size={14} className="text-gray-400" />
                                Rol del Usuario
                            </div>
                        </label>
                        <select
                            className={`
                                w-full rounded-lg border bg-surface text-text-primary 
                                dark:bg-gray-800 dark:border-gray-700 dark:text-white
                                focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow
                                px-4 py-2 appearance-none cursor-pointer
                                ${errors.role ? 'border-red-500 focus:ring-red-200' : 'border-border'}
                            `}
                            {...register('role')}
                            defaultValue=""
                        >
                            <option value="" disabled>
                                Seleccionar rol...
                            </option>
                            {USER_ROLES.map((role) => (
                                <option key={role.value} value={role.value}>
                                    {role.label}
                                </option>
                            ))}
                        </select>
                        {errors.role && (
                            <p className="mt-1 text-sm text-red-500 text-left">{errors.role.message}</p>
                        )}
                    </div>

                    {/* Info box about temp password */}
                    <div className="p-3 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-lg">
                        <div className="flex items-start gap-2">
                            <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                            <div className="text-xs text-blue-800 dark:text-blue-300">
                                <p className="font-semibold mb-0.5">Contraseña Temporal Automática</p>
                                <p className="text-blue-600 dark:text-blue-400">
                                    Al confirmar, se generará automáticamente una contraseña temporal segura y se enviará un email
                                    al usuario con un link único para su primer inicio de sesión.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex justify-end gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            isLoading={isLoading}
                            disabled={isFormBlocked}
                            leftIcon={<Mail size={16} />}
                        >
                            Enviar Solicitud de Alta
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
