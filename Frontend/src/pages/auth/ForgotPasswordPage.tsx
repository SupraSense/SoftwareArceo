import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { authService } from '../../auth/authService';
import { useNotification } from '../../hooks/useNotification';
import { ForceLightMode } from '../../components/ui/ForceLightMode';

const forgotPasswordSchema = z.object({
    email: z.string().email('Por favor ingresa un correo electrónico válido')
});

type ForgotPasswordInputs = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordPage: React.FC = () => {
    const navigate = useNavigate();
    const notification = useNotification();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordInputs>({
        resolver: zodResolver(forgotPasswordSchema)
    });

    const onSubmit = async (data: ForgotPasswordInputs) => {
        setIsLoading(true);
        try {
            await authService.forgotPassword(data.email);
            notification.showSuccess('Si el correo existe, recibirás instrucciones enviadas a tu bandeja.');
            navigate('/login');
        } catch (error) {
            console.error('Forgot password failed', error);
            // Default 200 is expected, but if network error we show generic feedback
            notification.showServerError(error, 'Error al intentar recuperar la contraseña. Intente más tarde.');
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
                        <Link to="/login" className="inline-flex items-center text-sm font-medium text-text-tertiary hover:text-text-primary mb-6">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Volver al inicio de sesión
                        </Link>
                        <h2 className="text-3xl font-display font-bold text-text-primary">Recuperar contraseña</h2>
                        <p className="mt-2 text-text-secondary">Ingresa tu correo y te enviaremos instrucciones</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
                        <Input
                            label="Correo Electrónico"
                            type="email"
                            placeholder="usuario@suprasense.com"
                            icon={<Mail className="w-5 h-5" />}
                            {...register('email')}
                            error={errors.email?.message}
                        />

                        <Button
                            type="submit"
                            className="w-full"
                            size="lg"
                            isLoading={isLoading}
                            rightIcon={<ArrowRight className="w-4 h-4" />}
                        >
                            Enviar correo de recuperación
                        </Button>
                    </form>
                </div>
            </div>

            <div className="hidden lg:flex relative bg-primary-900 overflow-hidden items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-800 to-black opacity-60"></div>
                <div className="relative z-10 p-12 text-white max-w-lg">
                    <h3 className="text-3xl font-bold mb-4">Eficiencia Operativa</h3>
                    <p className="text-primary-100 text-lg">
                        "La plataforma SGO nos permite monitorear y optimizar nuestros procesos para mejorar la eficiencia operativa."
                    </p>
                </div>
            </div>
        </div>
    );
};
