import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { authService } from '../../auth/authService';
import { useNotification } from '../../hooks/useNotification';
import { ForceLightMode } from '../../components/ui/ForceLightMode';

const resetPasswordSchema = z.object({
    password: z.string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .regex(/^(?=.*[a-zA-Z])(?=.*\d)/, 'La contraseña debe tener al menos 8 caracteres, letras y números'),
    confirmPassword: z.string().min(1, 'Confirmar la nueva contraseña')
}).refine(data => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword']
});

type ResetPasswordInputs = z.infer<typeof resetPasswordSchema>;

export const ResetPasswordPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const notification = useNotification();
    
    const token = searchParams.get('token');

    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        if (!token) {
            notification.showValidationError('Enlace inválido o incompleto. Solicite la recuperación nuevamente.');
            navigate('/forgot-password');
        }
    }, [token, navigate, notification]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordInputs>({
        resolver: zodResolver(resetPasswordSchema)
    });

    const onSubmit = async (data: ResetPasswordInputs) => {
        if (!token) return;

        setIsLoading(true);
        try {
            await authService.resetPassword({
                token,
                newPassword: data.password,
                confirmPassword: data.confirmPassword
            });
            notification.showSuccess('Contraseña restablecida correctamente. Ya puedes iniciar sesión.');
            navigate('/login');
        } catch (error: any) {
            console.error('Reset password failed', error);
            const msg = error.response?.data?.message || 'El token ha caducado o es inválido';
            notification.showValidationError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            <ForceLightMode />
            <div className="flex items-center justify-center p-8 bg-surface">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-display font-bold text-text-primary">Restablecer contraseña</h2>
                        <p className="mt-2 text-text-secondary">Ingresa tu nueva contraseña para acceder</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
                        <Input
                            label="Nueva Contraseña"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            icon={<Lock className="w-5 h-5" />}
                            rightElement={
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="focus:outline-none hover:text-text-primary"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            }
                            {...register('password')}
                            error={errors.password?.message}
                        />

                        <Input
                            label="Confirmar Nueva Contraseña"
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            icon={<Lock className="w-5 h-5" />}
                            rightElement={
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="focus:outline-none hover:text-text-primary"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            }
                            {...register('confirmPassword')}
                            error={errors.confirmPassword?.message}
                        />

                        <Button
                            type="submit"
                            className="w-full"
                            size="lg"
                            isLoading={isLoading}
                            rightIcon={<ArrowRight className="w-4 h-4" />}
                        >
                            Confirmar nueva contraseña
                        </Button>
                    </form>
                </div>
            </div>

            <div className="hidden lg:flex relative bg-primary-900 overflow-hidden items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-800 to-black opacity-60"></div>
                <div className="relative z-10 p-12 text-white max-w-lg">
                    <h3 className="text-3xl font-bold mb-4">Seguridad de la información</h3>
                    <p className="text-primary-100 text-lg">
                        "La protección de tus credenciales y datos es el núcleo de nuestra arquitectura."
                    </p>
                </div>
            </div>
        </div>
    );
};
