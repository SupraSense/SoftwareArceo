import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, User, Mail, CreditCard, Shield, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { createUserSchema, type CreateUserFormData } from '../../../schemasZod/userSchema';
import { USER_ROLES } from '../../../types/user';
import { userService } from '../../../services/userService';
import { useUsers } from '../../../hooks/useUsers';

type ValidationState = 'idle' | 'checking' | 'available' | 'unavailable';

export const UserCreatePage: React.FC = () => {
    const navigate = useNavigate();
    const { createUser } = useUsers();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<CreateUserFormData>({
        resolver: zodResolver(createUserSchema),
        mode: 'onBlur',
        defaultValues: {
            firstName: '',
            lastName: '',
            dni: '',
            email: '',
            role: undefined,
        },
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
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

    const handleFormSubmit = async (data: CreateUserFormData) => {
        if (emailValidation === 'unavailable' || dniValidation === 'unavailable') return;

        setIsSubmitting(true);
        try {
            const result = await createUser(data);
            if (result) {
                navigate('/app/configuration/usuarios');
            }
        } catch {
            // useUsers hook handles error notifications
        } finally {
            setIsSubmitting(false);
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

    const isFormBlocked = emailValidation === 'unavailable' || dniValidation === 'unavailable';

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/app/configuration/usuarios')}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Solicitud de Alta de Usuario
                </h1>
            </div>

            {/* Form Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors">
                {/* Info box */}
                <div className="p-3 mb-6 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-lg">
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

                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
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

                    {/* Action buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => navigate('/app/configuration/usuarios')}
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            isLoading={isSubmitting}
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
